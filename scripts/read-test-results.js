/* eslint-disable */
const { spawnSync } = require('child_process')
const GWS = 'C:\\Users\\ADMIN\\AppData\\Roaming\\npm\\node_modules\\@googleworkspace\\cli\\bin\\gws.exe'
const SHEET_ID = '1f-AI4H-UMKDKSObyoEfZk_WlAvKuJZZDdoEgJ01T7SQ'

function gws(args) {
  const r = spawnSync(GWS, args, { encoding: 'utf-8', shell: false })
  if (r.error) throw r.error
  return JSON.parse(r.stdout)
}

// Tab names using unicode escapes to avoid encoding issues in the script file
// "Khảo sát test" = "Khảo sát test"
// "Thông tin" = "Thông tin"
const KS_TAB = "Khảo sát test"
const TT_TAB = "Thông tin"

const scores = gws([
  'sheets', 'spreadsheets', 'values', 'get',
  '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: "'" + KS_TAB + "'!A:O" })
])

const info = gws([
  'sheets', 'spreadsheets', 'values', 'get',
  '--params', JSON.stringify({ spreadsheetId: SHEET_ID, range: "'" + TT_TAB + "'!A:AM" })
])

console.log('=== KHAO SAT TEST ===')
const scoreRows = scores.values || []
scoreRows.forEach(function(row, i) {
  if (i === 0) { console.log('HEADER: ' + row.join(' | ')); return }
  if (!row[1]) return
  console.log('Row' + (i+1) + ': Name=' + row[1] + ' | Type=' + (row[5]||'') + ' | G=' + (row[6]||'') + ' | H=' + (row[7]||'') + ' | I=' + (row[8]||'') + ' | J=' + (row[9]||'') + ' | K=' + (row[10]||'') + ' | L=' + (row[11]||'') + ' | M=' + (row[12]||''))
})

console.log('\n=== THONG TIN ===')
const infoRows = info.values || []
infoRows.forEach(function(row, i) {
  if (i === 0) return
  if (!row[1]) return
  console.log('Row' + (i+1) + ': Name=' + row[1] + ' | Level=' + (row[6]||'') + ' | ExamDate=' + (row[23]||'') + ' | TargetBand=' + (row[25]||''))
})
