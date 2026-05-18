/**
 * EmptyState — reusable empty/zero state component.
 *
 * Use in lists/dashboards when there's no data, instead of a blank screen.
 *
 * Example:
 *   <EmptyState
 *     icon="📭"
 *     title="Brak briefów"
 *     description="Stwórz pierwszy brief, żeby zacząć"
 *     action={{ label: '+ Nowy brief', href: '/briefs/new' }}
 *   />
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** Emoji or icon character (e.g. '📭', '✨') */
  icon?: string
  /** Main heading */
  title: string
  /** Optional description below title */
  description?: string
  /** Optional CTA */
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Optional secondary CTA */
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Visual variant */
  variant?: 'default' | 'compact'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-slate-200 text-center',
        isCompact ? 'p-6' : 'p-12',
        className
      )}
    >
      {icon && (
        <div className={cn(isCompact ? 'text-4xl mb-3' : 'text-6xl mb-4')}>{icon}</div>
      )}

      <h2
        className={cn(
          'font-semibold text-slate-900',
          isCompact ? 'text-base' : 'text-xl'
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'text-slate-500 mx-auto',
            isCompact ? 'text-sm mt-1 max-w-sm' : 'text-base mt-2 max-w-md'
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {action && <CTAButton {...action} primary />}
          {secondaryAction && <CTAButton {...secondaryAction} />}
        </div>
      )}
    </div>
  )
}

function CTAButton({
  label,
  href,
  onClick,
  primary = false,
}: {
  label: string
  href?: string
  onClick?: () => void
  primary?: boolean
}) {
  const cls = cn(
    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
    primary
      ? 'bg-[#daff47] text-[#2b3b82] hover:bg-[#c5eb3d]'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  )
}
