import { useState } from 'react'
import { Progress } from './components/Progress'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { formatToday } from './formatDate'
import { useTodos } from './useTodos'

export default function App() {
  const { todos, add, toggle, remove } = useTodos()
  const [today] = useState(() => formatToday(new Date()))
  const done = todos.filter((t) => t.completed).length

  return (
    <main className="page">
      <header className="header">
        <p className="date">{today}</p>
        <h1 className="title">
          Дела
          <span className="title__dot" aria-hidden="true">
            .
          </span>
        </h1>
      </header>
      <TodoForm onAdd={add} />
      <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
      <Progress total={todos.length} done={done} />
    </main>
  )
}
