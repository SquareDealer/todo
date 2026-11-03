export function createId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  // randomUUID requires a secure context; fall back for plain-http previews.
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
