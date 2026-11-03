import { useRef, useState, type FormEvent } from 'react'
import { MAX_TODO_LENGTH } from '../useTodos'
import { NEW_TODO_INPUT_ID } from './ids'

type Props = {
  onAdd: (text: string) => boolean
}

export function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onAdd(text)) setText('')
    inputRef.current?.focus()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor={NEW_TODO_INPUT_ID}>
        Новая задача
      </label>
      <input
        ref={inputRef}
        id={NEW_TODO_INPUT_ID}
        className="input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новое дело…"
        maxLength={MAX_TODO_LENGTH}
        autoComplete="off"
        enterKeyHint="done"
      />
      <button className="add" type="submit" aria-label="Добавить задачу">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </form>
  )
}
