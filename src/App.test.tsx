import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const input = () => screen.getByRole('textbox', { name: 'Новая задача' })
const addButton = () => screen.getByRole('button', { name: 'Добавить задачу' })
const items = () => screen.queryAllByRole('listitem')

async function addTodo(text: string) {
  await userEvent.type(input(), text)
  await userEvent.click(addButton())
}

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Дела' })).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<App />)
    expect(
      screen.getByText('Чистая страница. Запишите первое дело.'),
    ).toBeInTheDocument()
  })

  it('adds todo by button', async () => {
    render(<App />)
    await addTodo('Купить хлеб')
    expect(screen.getByText('Купить хлеб')).toBeInTheDocument()
    expect(input()).toHaveValue('')
    expect(input()).toHaveFocus()
    expect(
      screen.queryByText('Чистая страница. Запишите первое дело.'),
    ).not.toBeInTheDocument()
  })

  it('adds todo by Enter', async () => {
    render(<App />)
    await userEvent.type(input(), 'Позвонить маме{Enter}')
    expect(screen.getByText('Позвонить маме')).toBeInTheDocument()
    expect(input()).toHaveValue('')
  })

  it('does not add whitespace-only todo', async () => {
    render(<App />)
    await userEvent.type(input(), '   {Enter}')
    await userEvent.click(addButton())
    expect(items()).toHaveLength(0)
  })

  it('limits input to 200 characters', () => {
    render(<App />)
    expect(input()).toHaveAttribute('maxLength', '200')
  })

  it('toggles todo', async () => {
    render(<App />)
    await addTodo('Купить хлеб')
    const checkbox = screen.getByRole('checkbox', {
      name: 'Отметить «Купить хлеб»',
    })
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(items()[0]).toHaveClass('item--done')
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(items()[0]).not.toHaveClass('item--done')
  })

  it('removes todo', async () => {
    render(<App />)
    await addTodo('Купить хлеб')
    await addTodo('Позвонить маме')
    await userEvent.click(
      screen.getByRole('button', { name: 'Удалить «Купить хлеб»' }),
    )
    await waitFor(() =>
      expect(screen.queryByText('Купить хлеб')).not.toBeInTheDocument(),
    )
    expect(screen.getByText('Позвонить маме')).toBeInTheDocument()
  })

  it('renders HTML as plain text', async () => {
    render(<App />)
    await addTodo('<b>x</b>')
    expect(screen.getByText('<b>x</b>')).toBeInTheDocument()
  })

  it('restores todos and completed state after remount', async () => {
    const { unmount } = render(<App />)
    await addTodo('Купить хлеб')
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Отметить «Купить хлеб»' }),
    )
    unmount()

    render(<App />)
    expect(
      screen.getByRole('checkbox', { name: 'Отметить «Купить хлеб»' }),
    ).toBeChecked()
  })

  it('shows progress', async () => {
    render(<App />)
    await addTodo('a')
    await addTodo('b')
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Отметить «a»' }),
    )
    expect(screen.getByText('осталось 1 из 2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    )

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Отметить «b»' }),
    )
    expect(screen.getByText('Всё сделано')).toBeInTheDocument()
  })

  it('moves focus to the next task after deleting one', async () => {
    render(<App />)
    await addTodo('a')
    await addTodo('b')
    await userEvent.click(screen.getByRole('button', { name: 'Удалить «b»' }))
    await waitFor(() => expect(screen.queryByText('b')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Удалить «a»' })).toHaveFocus()
  })

  it('moves focus to the input after deleting the last task', async () => {
    render(<App />)
    await addTodo('a')
    await userEvent.click(screen.getByRole('button', { name: 'Удалить «a»' }))
    await waitFor(() => expect(screen.queryByText('a')).not.toBeInTheDocument())
    expect(input()).toHaveFocus()
  })

  it('scrolls the new task into view after adding', async () => {
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    render(<App />)
    await addTodo('a')
    await addTodo('b')
    expect(scroll).toHaveBeenCalledTimes(2)
    expect(scroll.mock.contexts[1]).toBe(items()[0])
  })

  it('numbers items 01, 02', async () => {
    render(<App />)
    await addTodo('a')
    await addTodo('b')
    expect(within(items()[0]).getByText('01')).toBeInTheDocument()
    expect(within(items()[1]).getByText('02')).toBeInTheDocument()
  })
})
