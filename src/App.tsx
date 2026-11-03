import { useCallback, useEffect, useRef, useState } from 'react'
import { Progress } from './components/Progress'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { formatToday } from './formatDate'
import { useTodos } from './useTodos'

export default function App() {
  const { todos, add, toggle, remove } = useTodos()
  const [today] = useState(() => formatToday(new Date()))
  const done = todos.filter((t) => t.completed).length

  // New tasks go to the top while the form is docked at the bottom on phones,
  // so bring the new row into view after adding.
  const listRef = useRef<HTMLUListElement>(null)
  const scrollToNewest = useRef(false)

  const handleAdd = useCallback(
    (text: string) => {
      const added = add(text)
      if (added) scrollToNewest.current = true
      return added
    },
    [add],
  )

  useEffect(() => {
    if (!scrollToNewest.current) return
    scrollToNewest.current = false
    listRef.current?.firstElementChild?.scrollIntoView?.({ block: 'nearest' })
  }, [todos])

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
      <TodoForm onAdd={handleAdd} />
      <TodoList
        ref={listRef}
        todos={todos}
        onToggle={toggle}
        onRemove={remove}
      />
      <Progress total={todos.length} done={done} />
    </main>
  )
}
