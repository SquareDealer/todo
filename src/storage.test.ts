import { STORAGE_KEY, loadTodos, parseTodos, saveTodos } from './storage'
import type { Todo } from './types'

const todo: Todo = {
  id: 'a',
  text: 'Купить хлеб',
  completed: false,
  createdAt: 1,
}

describe('storage', () => {
  it('uses the versioned key', () => {
    expect(STORAGE_KEY).toBe('todo-app:v1')
  })

  it('returns [] when nothing stored', () => {
    expect(loadTodos()).toEqual([])
  })

  it('returns [] for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{oops')
    expect(loadTodos()).toEqual([])
  })

  it('returns [] when stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, '{"a":1}')
    expect(loadTodos()).toEqual([])
  })

  it('drops malformed items, keeps valid ones', () => {
    const raw = JSON.stringify([
      todo,
      { id: 1 },
      null,
      { id: 'x', text: 't', completed: 'yes', createdAt: 1 },
    ])
    expect(parseTodos(raw)).toEqual([todo])
  })

  it('save then load round-trips', () => {
    saveTodos([todo])
    expect(loadTodos()).toEqual([todo])
  })

  it('loadTodos returns [] when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(loadTodos()).toEqual([])
  })

  it('saveTodos does not throw when setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveTodos([todo])).not.toThrow()
  })
})
