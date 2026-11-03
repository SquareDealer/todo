import { act, renderHook } from '@testing-library/react'
import { STORAGE_KEY } from './storage'
import type { Todo } from './types'
import { MAX_TODO_LENGTH, useTodos } from './useTodos'

const texts = (todos: Todo[]) => todos.map((t) => t.text)

describe('useTodos', () => {
  it('add trims text and prepends new todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('  a ')
    })
    act(() => {
      result.current.add('b')
    })
    expect(texts(result.current.todos)).toEqual(['b', 'a'])
    expect(result.current.todos.every((t) => !t.completed)).toBe(true)
  })

  it('add rejects empty and whitespace-only text', () => {
    const { result } = renderHook(() => useTodos())
    let a = true
    let b = true
    act(() => {
      a = result.current.add('')
      b = result.current.add('   ')
    })
    expect(a).toBe(false)
    expect(b).toBe(false)
    expect(result.current.todos).toEqual([])
  })

  it('add truncates text to 200 chars', () => {
    expect(MAX_TODO_LENGTH).toBe(200)
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('x'.repeat(250))
    })
    expect(result.current.todos[0].text).toHaveLength(200)
  })

  it('gives each todo a unique id', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('a')
      result.current.add('a')
    })
    const [first, second] = result.current.todos
    expect(first.id).not.toBe(second.id)
  })

  it('toggle flips completed both ways', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('a')
    })
    const id = result.current.todos[0].id
    act(() => result.current.toggle(id))
    expect(result.current.todos[0].completed).toBe(true)
    act(() => result.current.toggle(id))
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('remove deletes only the given todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('a')
      result.current.add('b')
    })
    const b = result.current.todos[0]
    act(() => result.current.remove(b.id))
    expect(texts(result.current.todos)).toEqual(['a'])
  })

  it('persists changes to localStorage', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.add('a')
    })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].text).toBe('a')
  })

  it('restores todos on new mount', () => {
    const first = renderHook(() => useTodos())
    act(() => {
      first.result.current.add('a')
    })
    act(() => first.result.current.toggle(first.result.current.todos[0].id))
    first.unmount()

    const { result } = renderHook(() => useTodos())
    expect(texts(result.current.todos)).toEqual(['a'])
    expect(result.current.todos[0].completed).toBe(true)
  })

  it('syncs from storage event of another tab', () => {
    const { result } = renderHook(() => useTodos())
    const todo: Todo = {
      id: 'z',
      text: 'из другой вкладки',
      completed: false,
      createdAt: 1,
    }
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify([todo]),
        }),
      )
    })
    expect(result.current.todos).toEqual([todo])

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'other', newValue: '[]' }),
      )
    })
    expect(result.current.todos).toEqual([todo])
  })
})
