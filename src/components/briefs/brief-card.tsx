'use client'

import Link from 'next/link'
import { formatDate, formatRelativeTime, getSLAIndicator } from '@/lib/utils'
import { StatusBadge, PriorityBadge } from './status-badge'
import type { BriefListItem } from '@/types'

interface BriefCardProps {
  brief: BriefListItem
}

export function BriefCard({ brief }: BriefCardProps) {
  const sla = getSLAIndicator(brief.deadline)

  return (
    <Link href={`/briefs/${brief.id}`}>
      <div className="bg-white dark:bg-card rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-border h-[180px] flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{brief.code}</p>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{brief.title}</h3>
          </div>
          <StatusBadge status={brief.status} className="ml-2 flex-shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 mb-3 flex-1">
          <span
            className="inline-flex items-center rounded px-2 py-0.5 text-xs h-fit"
            style={{
              backgroundColor: (brief.brand.primaryColor || '#888') + '20',
              color: brief.brand.primaryColor || '#888',
            }}
          >
            {brief.brand.name}
          </span>
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300 h-fit">
            {brief.club.name}
          </span>
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300 h-fit">
            {brief.template.name}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={brief.priority} />
          </div>
          <div className="text-right">
            <p className={`text-xs ${sla.color}`}>
              Deadline: {formatDate(brief.deadline)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatRelativeTime(brief.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
