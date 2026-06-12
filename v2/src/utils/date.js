/**
 * Date formatting utilities for match times and scheduling.
 */

export function formatDate(dateStr, locale = 'zh') {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  if (locale === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelative(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date - now

  if (diff < 0) return ''
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  return `${Math.floor(diff / (1000 * 60))}m`
}
