import type { Todo } from './types'

export const STORAGE_KEY = 'todo-app:v1'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.text === 'string' &&
    typeof v.completed === 'boolean' &&
    typeof v.createdAt === 'number'
  )
}

/** Parses a stored value; anything unexpected becomes an empty list. */
export function parseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isTodo) : []
  } catch {
    return []
  }
}

export function loadTodos(): Todo[] {
  try {
    return parseTodos(localStorage.getItem(STORAGE_KEY))
  } catch {
    // Storage can be unavailable (e.g. blocked cookies, private mode).
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // Quota exceeded or storage unavailable: keep working in memory.
  }
}
