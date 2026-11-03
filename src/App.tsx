import { Progress } from './components/Progress'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { formatToday } from './formatDate'
import { useTodos } from './useTodos'

export default function App() {
  const { todos, add, toggle, remove } = useTodos()
  const done = todos.filter((t) => t.completed).length

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Дела</h1>
        <p className="date">{formatToday(new Date())}</p>
      </header>
      <TodoForm onAdd={add} />
      <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
      <Progress total={todos.length} done={done} />
    </main>
  )
}
