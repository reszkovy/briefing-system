'use client'

import {
  CLUB_CHARACTERS,
  KEY_MEMBER_GROUPS,
  LOCAL_CONSTRAINTS,
  ACTIVITY_REASONS,
  POPULARITY_LEVELS,
  getKeyMemberGroupLabel,
  getLocalConstraintLabel,
  getActivityReasonLabel,
  getClubCharacterLabel,
  type ClubCharacterKey,
  type PopularityLevelKey,
} from '@/lib/constants/club-context'
import type { TopActivity, ActivityReasonsData } from '@/types/club-context'

interface ClubManager {
  name: string
  email: string
  phone?: string | null
}

interface ClubContextDisplayProps {
  clubName: string
  context: {
    clubCharacter?: string | null
    customCharacter?: string | null
    keyMemberGroups?: string[] | null
    localConstraints?: string[] | null
    topActivities?: TopActivity[] | null
    activityReasons?: ActivityReasonsData | null
    localDecisionBrief?: string | null
    contextUpdatedAt?: string | Date | null
  }
  manager?: ClubManager | null // Club manager info
  compact?: boolean // For inline display in brief form
}

export function ClubContextDisplay({
  clubName,
  context,
  manager,
  compact = false,
}: ClubContextDisplayProps) {
  const hasCharacter = context.clubCharacter
  const hasGroups =
    context.keyMemberGroups && (context.keyMemberGroups as string[]).length > 0
  const hasConstraints =
    context.localConstraints && (context.localConstraints as string[]).length > 0
  const hasActivities =
    context.topActivities && (context.topActivities as TopActivity[]).length > 0
  const hasReasons =
    context.activityReasons &&
    (context.activityReasons as ActivityReasonsData).selected?.length > 0
  const hasBrief = context.localDecisionBrief

  const hasAnyContext =
    hasCharacter ||
    hasGroups ||
    hasConstraints ||
    hasActivities ||
    hasReasons ||
    hasBrief

  if (!hasAnyContext) {
    return (
      <div
        className={`${compact ? 'p-3' : 'p-4'} bg-gray-50 rounded-lg border border-gray-200`}
      >
        <p className="text-sm text-gray-500 italic">
          Brak kontekstu dla tego klubu
        </p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏢</span>
          <div>
            <h3 className="font-semibold text-blue-800 text-sm">
              Kontekst: {clubName}
            </h3>
          </div>
        </div>

        {/* Club Character */}
        {hasCharacter && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">Charakter:</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              {getClubCharacterLabel(
                context.clubCharacter!,
                context.customCharacter
              )}
            </span>
          </div>
        )}

        {/* Key Member Groups */}
        {hasGroups && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Grupy: </span>
            {(context.keyMemberGroups as string[]).map((group, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs mr-1 mb-1"
              >
                {getKeyMemberGroupLabel(group)}
              </span>
            ))}
          </div>
        )}

        {/* Constraints */}
        {hasConstraints && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Ograniczenia: </span>
            {(context.localConstraints as string[]).map((constraint, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs mr-1 mb-1"
              >
                {getLocalConstraintLabel(constraint)}
              </span>
            ))}
          </div>
        )}

        {/* Top Activities */}
        {hasActivities && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Top aktywności: </span>
            {(context.topActivities as TopActivity[]).map((act, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-800 rounded text-xs mr-1 mb-1"
              >
                {act.name}
                <span
                  className={`text-[10px] ${
                    act.popularity === 'HIGH'
                      ? 'text-green-600'
                      : act.popularity === 'MEDIUM'
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                  }`}
                >
                  ({POPULARITY_LEVELS[act.popularity as PopularityLevelKey]})
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Local Decision Brief */}
        {hasBrief && (
          <div className="bg-white/50 rounded p-2 text-sm text-gray-700 italic">
            &ldquo;{context.localDecisionBrief}&rdquo;
          </div>
        )}

        {/* Manager Info - Compact */}
        {manager && (
          <div className="border-t border-blue-200 pt-2 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600">👤</span>
              <span className="font-medium text-gray-700">{manager.name}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 ml-5">
              <a href={`mailto:${manager.email}`} className="hover:text-blue-600">
                {manager.email}
              </a>
              {manager.phone && (
                <>
                  <span>•</span>
                  <a href={`tel:${manager.phone}`} className="hover:text-blue-600">
                    {manager.phone}
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full display (for admin panel or detailed view)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏢</span>
          <h3 className="font-semibold text-[#2b3b82]">
            Kontekst lokalny: {clubName}
          </h3>
        </div>
        {context.contextUpdatedAt && (
          <span className="text-xs text-gray-400">
            Zaktualizowano:{' '}
            {new Date(context.contextUpdatedAt).toLocaleDateString('pl-PL')}
          </span>
        )}
      </div>

      {/* Static Profile */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <span>📋</span> Profil klubu
        </h4>

        {hasCharacter && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Charakter:</span>
            <span className="px-3 py-1 bg-[#2b3b82] text-white rounded-lg text-sm">
              {getClubCharacterLabel(
                context.clubCharacter!,
                context.customCharacter
              )}
            </span>
          </div>
        )}

        {hasGroups && (
          <div>
            <span className="text-sm text-gray-500">Kluczowe grupy:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(context.keyMemberGroups as string[]).map((group, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    group.startsWith('custom:')
                      ? 'bg-[#daff47] text-[#2b3b82]'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {getKeyMemberGroupLabel(group)}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasConstraints && (
          <div>
            <span className="text-sm text-gray-500">Ograniczenia lokalne:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(context.localConstraints as string[]).map((constraint, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm"
                >
                  {getLocalConstraintLabel(constraint)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Context */}
      {(hasActivities || hasReasons) && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span>📊</span> Popularne aktywności
          </h4>

          {hasActivities && (
            <div className="grid gap-2">
              {(context.topActivities as TopActivity[]).map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="font-medium text-gray-800">{act.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      act.popularity === 'HIGH'
                        ? 'bg-green-100 text-green-700'
                        : act.popularity === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {POPULARITY_LEVELS[act.popularity as PopularityLevelKey]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {hasReasons && (
            <div>
              <span className="text-sm text-gray-500">Dlaczego działają:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {(context.activityReasons as ActivityReasonsData).selected.map(
                  (reason, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm"
                    >
                      {getActivityReasonLabel(reason)}
                    </span>
                  )
                )}
              </div>
              {(context.activityReasons as ActivityReasonsData).note && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  &ldquo;
                  {(context.activityReasons as ActivityReasonsData).note}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Local Decision Brief */}
      {hasBrief && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
            <span>💡</span> Brief decyzyjny
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{context.localDecisionBrief}</p>
          </div>
        </div>
      )}

      {/* Manager Info - Full Display */}
      {manager && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
            <span>👤</span> Opiekun klubu
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-gray-800">{manager.name}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
              <a href={`mailto:${manager.email}`} className="hover:text-[#2b3b82] flex items-center gap-1">
                <span>📧</span> {manager.email}
              </a>
              {manager.phone && (
                <a href={`tel:${manager.phone}`} className="hover:text-[#2b3b82] flex items-center gap-1">
                  <span>📞</span> {manager.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
