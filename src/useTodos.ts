import { useCallback, useEffect, useState } from 'react'
import { createId } from './id'
import { STORAGE_KEY, loadTodos, parseTodos, saveTodos } from './storage'
import type { Todo } from './types'

export const MAX_TODO_LENGTH = 200

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  // Keep several open tabs in sync instead of overwriting each other.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setTodos(parseTodos(event.newValue))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((text: string): boolean => {
    const clean = text.trim().slice(0, MAX_TODO_LENGTH).trimEnd()
    if (!clean) return false
    const todo: Todo = {
      id: createId(),
      text: clean,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos((prev) => [todo, ...prev])
    return true
  }, [])

  const toggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { todos, add, toggle, remove }
}
