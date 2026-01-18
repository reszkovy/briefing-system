// Utility functions

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'

// Tailwind class merger (for shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'd MMM yyyy', { locale: pl })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'd MMM yyyy, HH:mm', { locale: pl })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: pl })
}

// Status badge colors
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Brief statuses
    DRAFT: 'bg-gray-100 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    CHANGES_REQUESTED: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
    // Task statuses
    QUEUED: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    IN_REVIEW: 'bg-purple-100 text-purple-700',
    NEEDS_CHANGES: 'bg-yellow-100 text-yellow-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-500',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

// Priority badge colors
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    CRITICAL: 'bg-red-100 text-red-600',
  }
  return colors[priority] || 'bg-gray-100 text-gray-600'
}

// SLA indicator
export function getSLAIndicator(dueDate: Date): {
  text: string
  color: string
  isOverdue: boolean
} {
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)} dni po terminie`,
      color: 'text-red-600',
      isOverdue: true,
    }
  } else if (diffDays === 0) {
    return {
      text: 'Dziś',
      color: 'text-orange-600',
      isOverdue: false,
    }
  } else if (diffDays === 1) {
    return {
      text: 'Jutro',
      color: 'text-orange-600',
      isOverdue: false,
    }
  } else if (diffDays <= 3) {
    return {
      text: `${diffDays} dni`,
      color: 'text-yellow-600',
      isOverdue: false,
    }
  } else {
    return {
      text: `${diffDays} dni`,
      color: 'text-green-600',
      isOverdue: false,
    }
  }
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Validate URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// Extract domain from URL
export function getDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '')
  } catch {
    return url
  }
}

// File type icon mapping
export function getFileTypeIcon(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽️',
    pptx: '📽️',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    mp4: '🎬',
    mov: '🎬',
    zip: '📦',
    rar: '📦',
  }
  return icons[extension || ''] || '📎'
}

// Polish pluralization helper
export function pluralize(
  count: number,
  singular: string,
  plural2to4: string,
  plural5plus: string
): string {
  if (count === 1) return singular
  if (count >= 2 && count <= 4) return plural2to4
  if (count >= 5 && count <= 21) return plural5plus
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return plural2to4
  }
  return plural5plus
}

// Example: pluralize(1, 'dzień', 'dni', 'dni') => 'dzień'
// Example: pluralize(3, 'dzień', 'dni', 'dni') => 'dni'
// Example: pluralize(5, 'dzień', 'dni', 'dni') => 'dni'
