import { useEffect, useRef, type Ref } from 'react'
import type { Todo } from '../types'
import { NEW_TODO_INPUT_ID, removeButtonId } from './ids'
import { TodoItem } from './TodoItem'

type Props = {
  todos: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  ref?: Ref<HTMLUListElement>
}

export function TodoList({ todos, onToggle, onRemove, ref }: Props) {
  // Element to focus once a deleted task's button is gone, so keyboard users
  // keep their place instead of falling back to the top of the page.
  const focusAfterRemove = useRef<string | null>(null)

  useEffect(() => {
    const target = focusAfterRemove.current
    if (!target) return
    focusAfterRemove.current = null
    const active = document.activeElement
    if (!active || active === document.body) {
      document.getElementById(target)?.focus()
    }
  }, [todos])

  const handleRemove = (id: string) => {
    const index = todos.findIndex((t) => t.id === id)
    const neighbour = todos[index + 1] ?? todos[index - 1]
    focusAfterRemove.current = neighbour
      ? removeButtonId(neighbour.id)
      : NEW_TODO_INPUT_ID
    onRemove(id)
  }

  if (todos.length === 0) {
    return <p className="empty">Чистая страница. Запишите первое дело.</p>
  }

  return (
    <ul className="list" ref={ref}>
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          onToggle={onToggle}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  )
}
