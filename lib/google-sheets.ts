import { google } from 'googleapis'
import { StudentRecord } from './test-logic'

const SHEET_ID   = '1f-AI4H-UMKDKSObyoEfZk_WlAvKuJZZDdoEgJ01T7SQ'
const INFO_TAB   = 'Thông tin'
const SCORES_TAB = 'Khảo sát test'

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() })
}

// 0-based column indices in "Thông tin" tab (verified from live sheet: A=0, G=6, N=13, X=23 …)
const COL = {
  NAME:         1,   // B
  DOB:          5,   // F  — Ngày tháng năm sinh
  LEVEL:        6,   // G
  IELTS_STUDIED:21,  // V
  EXAM_DATE:    23,  // X  ← primary trigger for Test 3
  TARGET_BAND:  25,  // Z
  SKILLS:       9,   // J
  STUDY_TIME:   13,  // N
  BEST_TIME:    14,  // O
  WORKPLACE:    18,  // S  — Nơi học tập hoặc làm việc hiện tại
  LEARNING_FORMAT: 29, // AD — Bạn thích học hình thức nào?
  IELTS_TESTED: 31,  // AF
  PHONE:        32,  // AG
}

// "Khảo sát test" tab columns (confirmed from row 1 headers)
// A=STT, B=HO VA TEN, C=TRẠNG THÁI, D=NOTE, E=NGÀY NHẮC, F=LOẠI BÀI TEST
// G=GRAMMAR(40), H=VOCAB(40), I=READING FULL, J=LISTENING FULL
// K=READING PARTIAL(13C), L=LISTENING PARTIAL S1, M=LISTENING PARTIAL S2
// N=WRITING, O=SPEAKING
const COL_LETTER = {
  TEST_TYPE:    'F',
  GRAMMAR:      'G',
  VOCAB:        'H',
  READING_FULL: 'I',
  LISTEN_FULL:  'J',
  READING_P:    'K',
  LISTEN_S1:    'L',
  LISTEN_S2:    'M',
  WRITING:      'N',
  SPEAKING:     'O',
}

const TEST_TYPE_LABEL: Record<number, string> = {
  1: 'test mất gốc',
  2: 'partial test',
  3: 'test full',
}

export interface TestSubmission {
  studentName:    string
  studentPhone:   string
  testLevel:      number
  grammarScore?:  string
  vocabScore?:    string
  readingScore?:  string
  listeningS1?:   string
  listeningS2?:   string
  listeningScore?:string
  writingTask1?:  string
  writingTask2?:  string
  recordingUrl?:  string
  suggestedClass: string
  submittedAt:    string
}

// ─── Dev-mode: call gws.exe directly via spawnSync (no shell quoting issues) ──

const GWS_EXE = 'C:\\Users\\ADMIN\\AppData\\Roaming\\npm\\node_modules\\@googleworkspace\\cli\\bin\\gws.exe'

function gwsDirect(args: string[]): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { spawnSync } = require('child_process') as typeof import('child_process')
  const result = spawnSync(GWS_EXE, args, {
    encoding: 'utf-8',
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  if (result.error) throw result.error
  const json = (result.stdout || '').trim()
  if (!json) throw new Error(`gws returned empty output. stderr: ${result.stderr}`)
  const parsed = JSON.parse(json) as Record<string, unknown>
  if (parsed.error) throw new Error(`gws API error: ${JSON.stringify(parsed.error)}`)
  return parsed
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function buildUpdateRanges(
  data: TestSubmission,
  row: number,
  quotedTab: string
): Array<{ range: string; values: string[][] }> {
  const r = row
  const t = quotedTab
  // Always write all score columns G-O so old data from a different test type gets cleared
  const writing = [data.writingTask1, data.writingTask2].filter(Boolean).join('\n---\n')
  return [
    { range: `${t}!${COL_LETTER.TEST_TYPE}${r}`,    values: [[TEST_TYPE_LABEL[data.testLevel] || '']] },
    { range: `${t}!${COL_LETTER.GRAMMAR}${r}`,      values: [[data.testLevel === 1 ? (data.grammarScore  || '') : '']] },
    { range: `${t}!${COL_LETTER.VOCAB}${r}`,        values: [[data.testLevel === 1 ? (data.vocabScore    || '') : '']] },
    { range: `${t}!${COL_LETTER.READING_FULL}${r}`, values: [[data.testLevel === 3 ? (data.readingScore  || '') : '']] },
    { range: `${t}!${COL_LETTER.LISTEN_FULL}${r}`,  values: [[data.testLevel === 3 ? (data.listeningScore|| '') : '']] },
    { range: `${t}!${COL_LETTER.READING_P}${r}`,    values: [[data.testLevel === 2 ? (data.readingScore  || '') : '']] },
    { range: `${t}!${COL_LETTER.LISTEN_S1}${r}`,    values: [[data.testLevel === 2 ? (data.listeningS1   || '') : '']] },
    { range: `${t}!${COL_LETTER.LISTEN_S2}${r}`,    values: [[data.testLevel === 2 ? (data.listeningS2   || '') : '']] },
    { range: `${t}!${COL_LETTER.WRITING}${r}`,      values: [[data.testLevel !== 1 ? writing : '']] },
    { range: `${t}!${COL_LETTER.SPEAKING}${r}`,     values: [[data.testLevel === 3 ? (data.recordingUrl  || '') : '']] },
  ]
}

function buildNewRow(data: TestSubmission): string[] {
  const label = TEST_TYPE_LABEL[data.testLevel] || ''
  const writing =
    data.testLevel === 3
      ? [data.writingTask1, data.writingTask2].filter(Boolean).join('\n---\n')
      : data.writingTask2 || ''

  if (data.testLevel === 1) {
    return ['', data.studentName, 'Đã làm test', '', data.submittedAt, label,
      data.grammarScore || '', data.vocabScore || '', '', '', '', '', '', '', '']
  }
  if (data.testLevel === 2) {
    return ['', data.studentName, 'Đã làm test', '', data.submittedAt, label,
      '', '', '', '',
      data.readingScore || '', data.listeningS1 || '', data.listeningS2 || '',
      writing, '']
  }
  return ['', data.studentName, 'Đã làm test', '', data.submittedAt, label,
    '', '', data.readingScore || '', data.listeningScore || '',
    '', '', '', writing, data.recordingUrl || '']
}

// ─── Dev-mode write ───────────────────────────────────────────────────────────

function saveTestResultDevMode(data: TestSubmission): void {
  const tab = SCORES_TAB  // 'Khảo sát test'

  // Find existing row by matching name in column B
  let targetRow: number | null = null
  try {
    const readResult = gwsDirect([
      'sheets', 'spreadsheets', 'values', 'get',
      '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: `'${tab}'!B:B` }),
    ]) as { values?: string[][] }

    const nameRows = readResult.values || []
    const normName = data.studentName.trim().toLowerCase()
    for (let i = 1; i < nameRows.length; i++) {
      const cell = (nameRows[i]?.[0] || '').trim().toLowerCase()
      if (cell && (cell.includes(normName) || normName.includes(cell))) {
        targetRow = i + 1
        break
      }
    }
  } catch (e) {
    console.warn('[DEV] Could not read name column:', e)
  }

  if (targetRow) {
    const ranges = buildUpdateRanges(data, targetRow, `'${tab}'`)
    gwsDirect([
      'sheets', 'spreadsheets', 'values', 'batchUpdate',
      '--params', JSON.stringify({ spreadsheetId: SHEET_ID }),
      '--json',   JSON.stringify({ valueInputOption: 'RAW', data: ranges }),
    ])
    console.log(`[DEV] Updated row ${targetRow} for "${data.studentName}"`)
  } else {
    gwsDirect([
      'sheets', 'spreadsheets', 'values', 'append',
      '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: `'${tab}'!A:O`, valueInputOption: 'RAW' }),
      '--json',   JSON.stringify({ values: [buildNewRow(data)] }),
    ])
    console.log(`[DEV] Appended new row for "${data.studentName}"`)
  }
}

// ─── Production: googleapis ───────────────────────────────────────────────────

function makeRecord(row: string[], index: number): StudentRecord {
  return {
    name:         row[COL.NAME]          || '',
    phone:        row[COL.PHONE]         || '',
    dob:          row[COL.DOB]           || '',
    level:        row[COL.LEVEL]         || '',
    ieltsStudied: row[COL.IELTS_STUDIED] || '',
    ieltsTested:  row[COL.IELTS_TESTED]  || '',
    examDate:     row[COL.EXAM_DATE]     || '',
    targetBand:   row[COL.TARGET_BAND]   || '',
    skills:       row[COL.SKILLS]        || '',
    studyTime:    row[COL.STUDY_TIME]    || '',
    bestTime:     row[COL.BEST_TIME]     || '',
    workplace:    row[COL.WORKPLACE]     || '',
    learningFormat: row[COL.LEARNING_FORMAT] || '',
    rowIndex:     index + 1,
  }
}

export async function findStudent(name: string, phone: string): Promise<StudentRecord | null> {
  const isDev = process.env.NODE_ENV === 'development'
  const isPlaceholder = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').includes('placeholder')

  let rows: string[][]

  if (isDev && isPlaceholder) {
    const result = gwsDirect([
      'sheets', 'spreadsheets', 'values', 'get',
      '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: `${INFO_TAB}!A:AM` }),
    ]) as { values?: string[][] }
    rows = result.values || []
  } else {
    const sheets = getSheets()
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${INFO_TAB}!A:AO`,
    })
    rows = res.data.values || []
  }

  const normPhone = phone.replace(/\D/g, '').slice(-9)
  const normName  = name.trim().toLowerCase()

  // Two-pass: prefer rows matching BOTH name and phone; fall back to either alone
  let partialMatch: { row: string[]; index: number } | null = null

  for (let i = 1; i < rows.length; i++) {
    const row      = rows[i]
    const rowName  = (row[COL.NAME]  || '').trim().toLowerCase()
    const rowPhone = (row[COL.PHONE] || '').replace(/\D/g, '').slice(-9)

    const nameMatch  = normName.length > 0 && rowName.length > 0 &&
                       (rowName.includes(normName) || normName.includes(rowName))
    const phoneMatch = normPhone.length > 0 && rowPhone.length > 0 &&
                       rowPhone === normPhone

    if (nameMatch && phoneMatch) {
      // Perfect match — stop immediately
      return makeRecord(row, i)
    }
    if ((nameMatch || phoneMatch) && !partialMatch) {
      partialMatch = { row, index: i }
      // Keep scanning for a perfect match
    }
  }

  return partialMatch ? makeRecord(partialMatch.row, partialMatch.index) : null
}

export async function scheduleCallback(
  studentName: string,
  callbackDate: string,
  status = 'Đang tư vấn',
  insertIfMissing = false,
): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development'
  const isPlaceholder = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').includes('placeholder')
  const tab = SCORES_TAB

  const findRow = (nameRows: string[][]): number | null => {
    const norm = studentName.trim().toLowerCase()
    for (let i = 1; i < nameRows.length; i++) {
      const cell = (nameRows[i]?.[0] || '').trim().toLowerCase()
      if (cell && (cell.includes(norm) || norm.includes(cell))) return i + 1
    }
    return null
  }

  const updatePayload = (row: number, quotedTab: string) => [
    { range: `${quotedTab}!C${row}`, values: [[status]] },
    { range: `${quotedTab}!E${row}`, values: [[callbackDate]] },
  ]

  // Minimal row for a student who hasn't submitted a test yet: A-O (15 cols)
  const newRow = ['', studentName, status, '', callbackDate, '', '', '', '', '', '', '', '', '', '']

  if (isDev && isPlaceholder) {
    const readResult = gwsDirect([
      'sheets', 'spreadsheets', 'values', 'get',
      '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: `'${tab}'!B:B` }),
    ]) as { values?: string[][] }

    const targetRow = findRow(readResult.values || [])

    if (targetRow) {
      gwsDirect([
        'sheets', 'spreadsheets', 'values', 'batchUpdate',
        '--params', JSON.stringify({ spreadsheetId: SHEET_ID }),
        '--json', JSON.stringify({ valueInputOption: 'RAW', data: updatePayload(targetRow, `'${tab}'`) }),
      ])
      console.log(`[DEV] scheduleCallback: row ${targetRow} → "${status}", date=${callbackDate}`)
    } else if (insertIfMissing) {
      gwsDirect([
        'sheets', 'spreadsheets', 'values', 'append',
        '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: `'${tab}'!A:O`, valueInputOption: 'RAW' }),
        '--json', JSON.stringify({ values: [newRow] }),
      ])
      console.log(`[DEV] scheduleCallback: inserted new row for "${studentName}" → "${status}", date=${callbackDate}`)
    } else {
      console.warn('[DEV] scheduleCallback: student not found:', studentName)
    }
    return
  }

  const sheets = getSheets()
  const existing = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${tab}!B:B` })
  const targetRow = findRow(existing.data.values || [])

  if (targetRow) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { valueInputOption: 'RAW', data: updatePayload(targetRow, tab) },
    })
  } else if (insertIfMissing) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:O`,
      valueInputOption: 'RAW',
      requestBody: { values: [newRow] },
    })
  } else {
    console.warn('scheduleCallback: student not found:', studentName)
  }
}

export async function saveTestResult(data: TestSubmission): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development'
  const isPlaceholder = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').includes('placeholder')

  if (isDev && isPlaceholder) {
    saveTestResultDevMode(data)
    return
  }

  // Production: googleapis with service account
  const sheets = getSheets()
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SCORES_TAB}!B:B`,
  })

  const nameRows = existing.data.values || []
  let targetRow: number | null = null
  const normName = data.studentName.trim().toLowerCase()

  for (let i = 1; i < nameRows.length; i++) {
    const cell = (nameRows[i][0] || '').trim().toLowerCase()
    if (cell && (cell.includes(normName) || normName.includes(cell))) {
      targetRow = i + 1
      break
    }
  }

  if (targetRow) {
    const updateData = buildUpdateRanges(data, targetRow, SCORES_TAB)
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { valueInputOption: 'RAW', data: updateData },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SCORES_TAB}!A:O`,
      valueInputOption: 'RAW',
      requestBody: { values: [buildNewRow(data)] },
    })
  }
}
