export type AgentAgeBadgePalette = 'traffic-light' | 'agent-status' | 'custom'

/** Which clock a viewed-but-unanswered pane shows: finish age, seen age, or both. */
export type AgentAgeBadgeHeldTime = 'both' | 'since-finished' | 'since-seen'

export type AgentAgeBadgeColors = {
  unseen: string
  held: string
  working: string
}

export type AgentAgeBadgeSettings = {
  terminalAgentAgeBadge: boolean
  terminalAgentAgeBadgePalette: AgentAgeBadgePalette
  terminalAgentAgeBadgeCustomColors: AgentAgeBadgeColors
  terminalAgentAgeBadgeHeldTime: AgentAgeBadgeHeldTime
}

export const DEFAULT_AGENT_AGE_BADGE_SETTINGS: AgentAgeBadgeSettings = {
  terminalAgentAgeBadge: true,
  terminalAgentAgeBadgePalette: 'traffic-light',
  terminalAgentAgeBadgeCustomColors: { unseen: '#ef4444', held: '#f59e0b', working: '#22c55e' },
  terminalAgentAgeBadgeHeldTime: 'both'
}
