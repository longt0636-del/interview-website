export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function isAnswerCorrect(studentAnswer: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(studentAnswer)
  if (!normalized) return false
  return accepted.some((a) => normalizeAnswer(a) === normalized)
}
