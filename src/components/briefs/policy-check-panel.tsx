'use client'

import type { PolicyCheckResult } from '@/lib/policy-engine'

interface PolicyCheckPanelProps {
  policyResult: PolicyCheckResult | null
  requiresOwnerApproval?: boolean
  ownerApprovalReason?: string | null
  clubTier?: string
  estimatedCost?: number | null
  isCrisisCommunication?: boolean
}

export function PolicyCheckPanel({
  policyResult,
  requiresOwnerApproval,
  ownerApprovalReason,
  clubTier,
  estimatedCost,
  isCrisisCommunication,
}: PolicyCheckPanelProps) {
  if (!policyResult) {
    return null
  }

  const getStatusColor = () => {
    if (policyResult.autoRejectReasons.length > 0) return 'bg-red-50 border-red-200'
    if (policyResult.requiresOwnerApproval) return 'bg-amber-50 border-amber-200'
    if (policyResult.canAutoApprove) return 'bg-green-50 border-green-200'
    return 'bg-blue-50 border-blue-200'
  }

  const getStatusBadge = () => {
    if (policyResult.autoRejectReasons.length > 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ODRZUCONE
        </span>
      )
    }
    if (policyResult.requiresOwnerApproval) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          WYMAGA OWNERA
        </span>
      )
    }
    if (policyResult.canAutoApprove) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          AUTO-APPROVE
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        DO WALIDACJI
      </span>
    )
  }

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">🛡️ Policy Enforcer</h3>
        {getStatusBadge()}
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        {clubTier && clubTier !== 'STANDARD' && (
          <div className="flex items-center gap-1">
            <span className="text-amber-600">⭐</span>
            <span className="font-medium">{clubTier}</span>
          </div>
        )}
        {estimatedCost !== null && estimatedCost !== undefined && (
          <div className="flex items-center gap-1">
            <span>💰</span>
            <span>{estimatedCost} PLN</span>
          </div>
        )}
        {isCrisisCommunication && (
          <div className="flex items-center gap-1 col-span-2">
            <span className="text-red-600">🚨</span>
            <span className="font-medium text-red-700">Komunikacja kryzysowa</span>
          </div>
        )}
      </div>

      {/* Auto-reject reasons */}
      {policyResult.autoRejectReasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-red-700 mb-1">Powody odrzucenia:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {policyResult.autoRejectReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-1">
                <span>✕</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Owner approval reasons with Exception vs Escalation */}
      {policyResult.requiresOwnerApproval && policyResult.ownerApprovalReasons.length > 0 && (
        <div className="mb-3">
          {/* Escalation type badge */}
          {policyResult.escalationType && (
            <div className="mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                policyResult.escalationType === 'EXCEPTION'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {policyResult.escalationType === 'EXCEPTION' ? '🎯 Wyjatek' : '❓ Eskalacja'}
              </span>
              <p className="text-[10px] text-gray-500 mt-1">
                {policyResult.escalationType === 'EXCEPTION'
                  ? 'Swiadoma decyzja - lamie zasade, ale moze byc strategicznie uzasadniona'
                  : 'Niepewnosc - brak danych lub konflikt sygnalow, potrzeba decyzji Ownera'}
              </p>
            </div>
          )}
          <p className="text-xs font-medium text-amber-700 mb-1">Wymaga akceptacji Ownera:</p>
          <ul className="text-xs text-amber-600 space-y-1">
            {policyResult.escalationDetails && policyResult.escalationDetails.length > 0 ? (
              policyResult.escalationDetails.map((detail, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span>{detail.type === 'EXCEPTION' ? '🎯' : '❓'}</span>
                  <span>{detail.reason}</span>
                </li>
              ))
            ) : (
              policyResult.ownerApprovalReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span>⚠</span>
                  <span>{reason}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {policyResult.warnings.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-1">Ostrzezenia:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            {policyResult.warnings.map((warning, i) => (
              <li key={i} className="flex items-start gap-1">
                <span>!</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested values */}
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Sugerowany priorytet:</span>
          <span className={`font-medium ${
            policyResult.suggestedPriority === 'CRITICAL' ? 'text-red-600' :
            policyResult.suggestedPriority === 'HIGH' ? 'text-orange-600' :
            policyResult.suggestedPriority === 'MEDIUM' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {policyResult.suggestedPriority}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Sugerowane SLA:</span>
          <span className="font-medium">{policyResult.suggestedSLA} dni</span>
        </div>
      </div>

      {/* Detailed rules (collapsible) */}
      <details className="mt-3">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Szczegoly walidacji ({policyResult.rules.length} regul)
        </summary>
        <div className="mt-2 space-y-1">
          {policyResult.rules.map((rule, i) => (
            <div
              key={i}
              className={`text-xs p-1.5 rounded ${
                rule.passed
                  ? 'bg-green-50 text-green-700'
                  : rule.severity === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <span className="font-mono text-[10px] mr-1">
                {rule.passed ? '✓' : '✕'}
              </span>
              {rule.message}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
