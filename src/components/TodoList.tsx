import type { Todo } from '../types'
import { TodoItem } from './TodoItem'

type Props = {
  todos: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TodoList({ todos, onToggle, onRemove }: Props) {
  if (todos.length === 0) {
    return <p className="empty">Чистая страница. Запишите первое дело.</p>
  }

  return (
    <ul className="list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
