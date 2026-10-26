// 25/10/2026: bỏ gói `@googleapis/sheets` (thư viện Node, không chạy gọn trên Cloudflare Workers) — gọi REST thẳng qua
// lib/google-lite.ts. Trên Cloudflare dùng tài khoản Google của thầy (chủ sổ), trên Vercel vẫn tài khoản dịch vụ.
import { oauthUserFromEnv, serviceAccountFromEnv, sheetsClient } from './google-lite'
import { StudentRecord } from './test-logic'

const SHEET_ID   = '1f-AI4H-UMKDKSObyoEfZk_WlAvKuJZZDdoEgJ01T7SQ'
const INFO_TAB   = 'Thông tin'
const SCORES_TAB = 'Khảo sát test'

function getSheets() {
  return sheetsClient(oauthUserFromEnv() ?? serviceAccountFromEnv())
}

// Row (1-based) in "Khảo sát test" whose column-B name loosely matches; header row skipped.
function findNameRow(nameRows: string[][], name: string): number | null {
  const norm = name.trim().toLowerCase()
  for (let i = 1; i < nameRows.length; i++) {
    const cell = (nameRows[i]?.[0] || '').trim().toLowerCase()
    if (cell && (cell.includes(norm) || norm.includes(cell))) return i + 1
  }
  return null
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

// Manual column the teacher adds to "Thông tin" to force a specific test for one student.
// Resolved by header text (not a fixed index) so it keeps working if the Form adds questions.
const OVERRIDE_HEADER = /chỉ\s*định/i

// Câu "Lịch trong tuần của con…" thêm vào form 26/10/2026 — Google chèn cột mới trước các cột thầy tự thêm,
// nên tìm theo tên cột chứ không cố định vị trí.
const SCHEDULE_HEADER = /lịch[^:]{0,12}trong\s*tuần/i   // "Lịch trong tuần…" hoặc "Lịch rảnh trong tuần…"

function findScheduleCol(header: string[] | undefined): number {
  if (!header) return -1
  return header.findIndex(h => SCHEDULE_HEADER.test((h || '').normalize('NFC').trim()))
}

function findOverrideCol(header: string[] | undefined): number {
  if (!header) return -1
  return header.findIndex(h => OVERRIDE_HEADER.test((h || '').trim()))
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

function makeRecord(row: string[], index: number, overrideCol = -1, scheduleCol = -1): StudentRecord {
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
    testOverride: overrideCol >= 0 ? (row[overrideCol] || '') : '',
    schedule:     scheduleCol >= 0 ? (row[scheduleCol] || '') : '',
    rowIndex:     index + 1,
  }
}

export async function findStudent(name: string, phone: string): Promise<StudentRecord | null> {
  const res = await getSheets().spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${INFO_TAB}!A:BA`,
  })
  const rows: string[][] = res.data.values || []

  const overrideCol = findOverrideCol(rows[0])
  const scheduleCol = findScheduleCol(rows[0])

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
      return makeRecord(row, i, overrideCol, scheduleCol)
    }
    if ((nameMatch || phoneMatch) && !partialMatch) {
      partialMatch = { row, index: i }
      // Keep scanning for a perfect match
    }
  }

  return partialMatch ? makeRecord(partialMatch.row, partialMatch.index, overrideCol, scheduleCol) : null
}

export async function scheduleCallback(
  studentName: string,
  callbackDate: string,
  status = 'Đang tư vấn',
  insertIfMissing = false,
): Promise<void> {
  const tab = SCORES_TAB

  const updatePayload = (row: number, quotedTab: string) => [
    { range: `${quotedTab}!C${row}`, values: [[status]] },
    { range: `${quotedTab}!E${row}`, values: [[callbackDate]] },
  ]

  // Minimal row for a student who hasn't submitted a test yet: A-O (15 cols)
  const newRow = ['', studentName, status, '', callbackDate, '', '', '', '', '', '', '', '', '', '']

  const sheets = getSheets()
  const existing = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${tab}!B:B` })
  const targetRow = findNameRow(existing.data.values || [], studentName)

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
  const sheets = getSheets()
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SCORES_TAB}!B:B`,
  })

  const targetRow = findNameRow(existing.data.values || [], data.studentName)

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
