import { format, parseISO, isToday, isTomorrow, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isBefore, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date, fmt = 'dd/MM/yyyy') {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: es })
}

export function formatTime(time) {
  if (!time) return ''
  return time.slice(0, 5)
}

export function formatDateTime(date, time) {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  const dateStr = format(d, 'EEEE d \'de\' MMMM', { locale: es })
  return `${dateStr} - ${formatTime(time)}`
}

export function getRelativeDay(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return 'Hoy'
  if (isTomorrow(d)) return 'Ma\u00f1ana'
  return format(d, 'EEEE d \'de\' MMMM', { locale: es })
}

export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  const days = []
  let current = start
  while (current <= end) {
    days.push(new Date(current))
    current = addDays(current, 1)
  }
  return days
}

export function getMonthDays(date) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const days = []
  let current = start
  while (current <= end) {
    days.push(new Date(current))
    current = addDays(current, 1)
  }
  return days
}

export function isDateInRange(date, start, end) {
  const d = typeof date === 'string' ? parseISO(date) : date
  const s = typeof start === 'string' ? parseISO(start) : start
  const e = typeof end === 'string' ? parseISO(end) : end
  return (isSameDay(d, s) || isAfter(d, s)) && (isSameDay(d, e) || isBefore(d, e))
}

export function toISODate(date) {
  if (typeof date === 'string') return date
  return format(date, 'yyyy-MM-dd')
}

export { isToday, isTomorrow, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, parseISO, format }
