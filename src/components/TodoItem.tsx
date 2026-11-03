import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../types'
import { removeButtonId } from './ids'

const LEAVE_MS = 250

type Props = {
  todo: Todo
  index: number
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

function prefersReducedMotion(): boolean {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
}

export function TodoItem({ todo, index, onToggle, onRemove }: Props) {
  const [leaving, setLeaving] = useState(false)
  const removed = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const finishRemove = () => {
    if (removed.current) return
    removed.current = true
    window.clearTimeout(timer.current)
    onRemove(todo.id)
  }

  const startRemove = () => {
    if (leaving) return
    if (prefersReducedMotion()) {
      finishRemove()
      return
    }
    setLeaving(true)
    // Fallback in case animationend never fires (hidden tab, no animation).
    timer.current = window.setTimeout(finishRemove, LEAVE_MS)
  }

  const className = [
    'item',
    todo.completed && 'item--done',
    leaving && 'item--leaving',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li
      className={className}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) finishRemove()
      }}
    >
      <span className="num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <input
        className="check"
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Отметить «${todo.text}»`}
      />
      <label className="text" htmlFor={`todo-${todo.id}`}>
        <span className="text__ink">{todo.text}</span>
      </label>
      <button
        className="remove"
        id={removeButtonId(todo.id)}
        type="button"
        onClick={startRemove}
        aria-label={`Удалить «${todo.text}»`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </li>
  )
}
