import { formatToday } from './formatDate'

describe('formatToday', () => {
  it('formats a date in Russian with weekday', () => {
    expect(formatToday(new Date(2026, 10, 3))).toBe('вторник, 3 ноября')
  })
})
