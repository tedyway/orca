import type { AgentStatusEntry } from '../../../../../shared/agent-status/contracts/agent-status-types'
import type {
  AgentAgeBadgeColors,
  AgentAgeBadgeHeldTime,
  AgentAgeBadgePalette
} from '../../../../../shared/terminal/appearance/agent-age-badge-settings'
import { isAgentTurnUnacknowledged } from '@/attention/agent-attention-acknowledgement'

export type AgentAgeBadgeKind = keyof AgentAgeBadgeColors

export type AgentAgeBadgeState = {
  kind: AgentAgeBadgeKind
  /** Timestamps rendered as ages, left to right. */
  since: number[]
}

/** Working counts from the turn start; any other state counts from when the agent stopped and waits on the user. */
export function resolveAgentAgeBadge(
  entry: Pick<AgentStatusEntry, 'state' | 'stateStartedAt'> | undefined,
  acknowledgedAt: number | undefined,
  heldTime: AgentAgeBadgeHeldTime
): AgentAgeBadgeState | null {
  if (!entry) {
    return null
  }
  if (entry.state === 'working') {
    return { kind: 'working', since: [entry.stateStartedAt] }
  }
  if (
    acknowledgedAt === undefined ||
    isAgentTurnUnacknowledged(acknowledgedAt, entry.stateStartedAt)
  ) {
    return { kind: 'unseen', since: [entry.stateStartedAt] }
  }
  const since =
    heldTime === 'since-finished'
      ? [entry.stateStartedAt]
      : heldTime === 'since-seen'
        ? [acknowledgedAt]
        : [entry.stateStartedAt, acknowledgedAt]
  return { kind: 'held', since }
}

const PRESET_COLORS: Record<Exclude<AgentAgeBadgePalette, 'custom'>, AgentAgeBadgeColors> = {
  'traffic-light': {
    unseen: 'var(--destructive)',
    held: 'var(--status-warning)',
    working: 'var(--status-success)'
  },
  'agent-status': {
    unseen: 'var(--status-success)',
    held: 'var(--muted-foreground)',
    working: 'var(--agent-working)'
  }
}

export function resolveAgentAgeBadgeColors(
  palette: AgentAgeBadgePalette,
  custom: AgentAgeBadgeColors
): AgentAgeBadgeColors {
  return palette === 'custom' ? custom : PRESET_COLORS[palette]
}
