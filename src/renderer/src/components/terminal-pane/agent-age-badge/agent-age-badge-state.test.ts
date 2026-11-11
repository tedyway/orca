import { describe, expect, it } from 'vitest'
import { resolveAgentAgeBadge } from './agent-age-badge-state'

const FINISHED_AT = 1_000_000
const SEEN_AT = 2_000_000

describe('resolveAgentAgeBadge', () => {
  it('shows nothing for a pane without an agent', () => {
    expect(resolveAgentAgeBadge(undefined, SEEN_AT, 'both')).toBeNull()
  })

  it('counts a running turn from when it started', () => {
    expect(
      resolveAgentAgeBadge({ state: 'working', stateStartedAt: FINISHED_AT }, SEEN_AT, 'both')
    ).toEqual({ kind: 'working', since: [FINISHED_AT] })
  })

  it('treats a finished turn never viewed as unseen', () => {
    expect(
      resolveAgentAgeBadge({ state: 'done', stateStartedAt: FINISHED_AT }, undefined, 'both')
    ).toEqual({ kind: 'unseen', since: [FINISHED_AT] })
  })

  it('treats a turn viewed only before it finished as unseen', () => {
    expect(
      resolveAgentAgeBadge({ state: 'done', stateStartedAt: FINISHED_AT }, FINISHED_AT - 1, 'both')
    ).toEqual({ kind: 'unseen', since: [FINISHED_AT] })
  })

  it('shows both clocks for a viewed but unanswered turn', () => {
    expect(
      resolveAgentAgeBadge({ state: 'done', stateStartedAt: FINISHED_AT }, SEEN_AT, 'both')
    ).toEqual({ kind: 'held', since: [FINISHED_AT, SEEN_AT] })
  })

  it('honors the single-clock held settings', () => {
    const entry = { state: 'waiting', stateStartedAt: FINISHED_AT } as const
    expect(resolveAgentAgeBadge(entry, SEEN_AT, 'since-finished')?.since).toEqual([FINISHED_AT])
    expect(resolveAgentAgeBadge(entry, SEEN_AT, 'since-seen')?.since).toEqual([SEEN_AT])
  })
})
