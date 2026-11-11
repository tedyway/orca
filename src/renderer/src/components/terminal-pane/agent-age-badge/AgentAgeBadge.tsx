import { makePaneKey } from '../../../../../shared/workspace-layout/stable-pane-id'
import { DEFAULT_AGENT_AGE_BADGE_SETTINGS } from '../../../../../shared/terminal/appearance/agent-age-badge-settings'
import { useAppStore } from '@/store/index'
import { useNow } from '@/hooks/use-now'
import { useTranslate } from '@/i18n/use-translate'
import { formatPaletteSessionAge } from '@/components/cmd-j/palette-session-age'
import { resolveAgentAgeBadge, resolveAgentAgeBadgeColors } from './agent-age-badge-state'

const AGE_TICK_MS = 30_000

/** Faint corner age of the pane's agent turn; colored by whether the user has looked since it stopped. */
export function AgentAgeBadge({
  tabId,
  leafId
}: {
  tabId: string
  leafId: string
}): React.JSX.Element | null {
  const t = useTranslate()
  const paneKey = makePaneKey(tabId, leafId)
  const entry = useAppStore((state) => state.agentStatusByPaneKey[paneKey])
  const acknowledgedAt = useAppStore((state) => state.acknowledgedAgentsByPaneKey[paneKey])
  const settings = useAppStore((state) => state.settings)
  const enabled =
    settings?.terminalAgentAgeBadge ?? DEFAULT_AGENT_AGE_BADGE_SETTINGS.terminalAgentAgeBadge
  const now = useNow(AGE_TICK_MS, enabled && entry !== undefined)
  if (!enabled) {
    return null
  }
  const badge = resolveAgentAgeBadge(
    entry,
    acknowledgedAt,
    settings?.terminalAgentAgeBadgeHeldTime ??
      DEFAULT_AGENT_AGE_BADGE_SETTINGS.terminalAgentAgeBadgeHeldTime
  )
  if (!badge) {
    return null
  }
  const colors = resolveAgentAgeBadgeColors(
    settings?.terminalAgentAgeBadgePalette ??
      DEFAULT_AGENT_AGE_BADGE_SETTINGS.terminalAgentAgeBadgePalette,
    settings?.terminalAgentAgeBadgeCustomColors ??
      DEFAULT_AGENT_AGE_BADGE_SETTINGS.terminalAgentAgeBadgeCustomColors
  )
  const ages = badge.since.map((at) => formatPaletteSessionAge(at, now, t)).join(' · ')
  return (
    // Why aria-hidden: the sidebar already announces agent state; a 30s ticking label would be noise.
    <div
      aria-hidden="true"
      className="pane-agent-age-badge"
      data-kind={badge.kind}
      style={{ color: colors[badge.kind] }}
    >
      {ages}
    </div>
  )
}
