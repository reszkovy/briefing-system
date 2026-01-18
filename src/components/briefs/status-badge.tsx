'use client'

import { cn, getStatusColor, getPriorityColor } from '@/lib/utils'
import { BriefStatusLabels, PriorityLabels } from '@/lib/validations/brief'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        getStatusColor(status),
        className
      )}
    >
      {BriefStatusLabels[status] || status}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        getPriorityColor(priority),
        className
      )}
    >
      {PriorityLabels[priority] || priority}
    </span>
  )
}
