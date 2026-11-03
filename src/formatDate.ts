const formatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

/** "вторник, 3 ноября" */
export function formatToday(date: Date): string {
  return formatter.format(date)
}
