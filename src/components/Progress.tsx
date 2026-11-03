import type { CSSProperties } from 'react'

type Props = {
  total: number
  done: number
}

export function Progress({ total, done }: Props) {
  if (total === 0) return null
  const left = total - done
  const style = { '--p': done / total } as CSSProperties

  return (
    <div className="progress">
      <div
        className="progress__bar"
        role="progressbar"
        aria-label="Выполнено задач"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        style={style}
      />
      <p className="progress__label" aria-live="polite">
        {left === 0 ? 'Всё сделано' : `осталось ${left} из ${total}`}
      </p>
    </div>
  )
}
