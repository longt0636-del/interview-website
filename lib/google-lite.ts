// Gọi Google Sheets / Docs bằng tài khoản dịch vụ (service account) — bản gọn thay cho gói `googleapis` (25/10/2026).
//
// Vì sao: `googleapis` là thư viện Node khổng lồ (cả trăm API, cần mô-đun mạng riêng của Node) — không chạy gọn trên
// Cloudflare Workers. Web này chỉ dùng 5 lệnh (đọc vùng, thêm dòng, ghi nhiều vùng, đọc Doc, sửa Doc), nên tự gọi
// thẳng REST bằng fetch, ký thẻ JWT bằng Web Crypto (có sẵn ở cả Node 20+ lẫn Workers). Hình dạng gọi + kết quả giữ
// giống `googleapis` (`sheets.spreadsheets.values.get({...})` → `{ data }`) để code cũ đổi ít nhất.

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri?: string
}

/** Tài khoản Google thường (OAuth refresh token) — dùng khi không có khoá tài khoản dịch vụ. */
interface OAuthUser {
  client_id: string
  client_secret: string
  refresh_token: string
}

export type GoogleAuth = ServiceAccount | OAuthUser

async function oauthToken(u: OAuthUser): Promise<string> {
  const key = `oauth|${u.client_id}|${u.refresh_token.slice(-12)}`
  const cached = tokenCache.get(key)
  if (cached && cached.exp > Date.now() + 60_000) return cached.token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: u.client_id, client_secret: u.client_secret, refresh_token: u.refresh_token, grant_type: 'refresh_token' }),
  })
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string; error?: string }
  if (!res.ok || !data.access_token) throw new Error(`Google không cấp thẻ truy cập: ${data.error_description || data.error || res.status}`)
  tokenCache.set(key, { token: data.access_token, exp: Date.now() + (data.expires_in ?? 3600) * 1000 })
  return data.access_token
}

/** Thẻ truy cập cho bất kỳ kiểu tài khoản nào ở trên. */
export function getAccessTokenFor(auth: GoogleAuth, scopes: string[]): Promise<string> {
  return 'refresh_token' in auth ? oauthToken(auth) : accessToken(auth, scopes)
}

const tokenCache = new Map<string, { token: string; exp: number }>()

function b64url(data: ArrayBuffer | Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data as ArrayBuffer)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function pemToDer(pem: string): ArrayBuffer {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')
  const bin = atob(body)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}

async function accessToken(sa: ServiceAccount, scopes: string[]): Promise<string> {
  const key = `${sa.client_email}|${scopes.join(' ')}`
  const cached = tokenCache.get(key)
  if (cached && cached.exp > Date.now() + 60_000) return cached.token

  const now = Math.floor(Date.now() / 1000)
  const tokenUri = sa.token_uri || 'https://oauth2.googleapis.com/token'
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(JSON.stringify({ iss: sa.client_email, scope: scopes.join(' '), aud: tokenUri, iat: now, exp: now + 3600 }))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(`${header}.${claims}`))
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${b64url(sig)}`,
    }),
  })
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string; error?: string }
  if (!res.ok || !data.access_token) throw new Error(`Google không cấp thẻ truy cập: ${data.error_description || data.error || res.status}`)
  tokenCache.set(key, { token: data.access_token, exp: Date.now() + (data.expires_in ?? 3600) * 1000 })
  return data.access_token
}

/** Lỗi giống `googleapis`: có `code` (HTTP status) để các hàm thử lại cũ (withRetry) nhận ra 429/5xx. */
export class GoogleApiError extends Error {
  code: number
  errors?: unknown
  constructor(message: string, code: number, errors?: unknown) {
    super(message)
    this.code = code
    this.errors = errors
  }
}

async function call<T>(sa: GoogleAuth, scopes: string[], url: string, init: RequestInit = {}): Promise<{ data: T; status: number }> {
  const token = await getAccessTokenFor(sa, scopes)
  // Tài khoản thầy dùng chung cho nhiều web: tính lượt gọi vào dự án riêng của web này (trần 60 lượt/phút tính theo
  // cặp dự án + người — xem memory/reference-google-quota-dung-chung.md). Tài khoản dịch vụ thì đã có dự án riêng.
  const quota = 'refresh_token' in sa ? process.env.GOOGLE_QUOTA_PROJECT : undefined
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(quota ? { 'X-Goog-User-Project': quota } : {}),
    },
  })
  const text = await res.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  if (!res.ok) {
    const msg = (body as { error?: { message?: string } } | null)?.error?.message || `HTTP ${res.status}`
    throw new GoogleApiError(msg, res.status, (body as { error?: { errors?: unknown } } | null)?.error?.errors)
  }
  return { data: body as T, status: res.status }
}

function query(params: Record<string, unknown>, skip: string[]): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (skip.includes(k) || v === undefined || v === null) continue
    if (Array.isArray(v)) for (const x of v) q.append(k, String(x))
    else q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets'
const DOCS = 'https://docs.googleapis.com/v1/documents'

type Params = Record<string, unknown> & { requestBody?: unknown }

/** Tài khoản Google thường của thầy từ biến môi trường GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN (giống portal). */
export function oauthUserFromEnv(): OAuthUser | null {
  const { GOOGLE_CLIENT_ID: id, GOOGLE_CLIENT_SECRET: secret, GOOGLE_REFRESH_TOKEN: rt } = process.env
  return id && secret && rt ? { client_id: id, client_secret: secret, refresh_token: rt } : null
}

/** Đọc khoá tài khoản dịch vụ từ biến môi trường (chuỗi JSON). */
export function serviceAccountFromEnv(name = 'GOOGLE_SERVICE_ACCOUNT_JSON'): ServiceAccount {
  const raw = process.env[name]
  if (!raw) throw new Error(`Thiếu biến môi trường ${name}.`)
  return JSON.parse(raw) as ServiceAccount
}

export function sheetsClient(sa: GoogleAuth, scopes = ['https://www.googleapis.com/auth/spreadsheets']) {
  const enc = encodeURIComponent
  return {
    spreadsheets: {
      values: {
        get: <T = { values?: string[][] }>(p: Params & { spreadsheetId: string; range: string }) =>
          call<T>(sa, scopes, `${SHEETS}/${enc(p.spreadsheetId)}/values/${enc(p.range)}${query(p, ['spreadsheetId', 'range', 'requestBody'])}`),
        append: <T = unknown>(p: Params & { spreadsheetId: string; range: string }) =>
          call<T>(sa, scopes, `${SHEETS}/${enc(p.spreadsheetId)}/values/${enc(p.range)}:append${query(p, ['spreadsheetId', 'range', 'requestBody'])}`, {
            method: 'POST',
            body: JSON.stringify(p.requestBody ?? {}),
          }),
        update: <T = unknown>(p: Params & { spreadsheetId: string; range: string }) =>
          call<T>(sa, scopes, `${SHEETS}/${enc(p.spreadsheetId)}/values/${enc(p.range)}${query(p, ['spreadsheetId', 'range', 'requestBody'])}`, {
            method: 'PUT',
            body: JSON.stringify(p.requestBody ?? {}),
          }),
        batchUpdate: <T = unknown>(p: Params & { spreadsheetId: string }) =>
          call<T>(sa, scopes, `${SHEETS}/${enc(p.spreadsheetId)}/values:batchUpdate`, {
            method: 'POST',
            body: JSON.stringify(p.requestBody ?? {}),
          }),
      },
    },
  }
}

export function docsClient(sa: GoogleAuth, scopes = ['https://www.googleapis.com/auth/documents']) {
  const enc = encodeURIComponent
  return {
    documents: {
      get: <T = unknown>(p: Params & { documentId: string }) =>
        call<T>(sa, scopes, `${DOCS}/${enc(p.documentId)}${query(p, ['documentId', 'requestBody'])}`),
      batchUpdate: <T = unknown>(p: Params & { documentId: string }) =>
        call<T>(sa, scopes, `${DOCS}/${enc(p.documentId)}:batchUpdate`, {
          method: 'POST',
          body: JSON.stringify(p.requestBody ?? {}),
        }),
    },
  }
}
