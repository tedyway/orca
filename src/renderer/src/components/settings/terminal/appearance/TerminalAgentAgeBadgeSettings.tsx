import type { GlobalSettings } from '../../../../../../shared/global-settings-types'
import { DEFAULT_AGENT_AGE_BADGE_SETTINGS } from '../../../../../../shared/terminal/appearance/agent-age-badge-settings'
import {
  ColorField,
  SettingsRow,
  SettingsSegmentedControl,
  SettingsSwitchRow
} from '../../form-controls/SettingsFormControls'
import { SearchableSetting } from '../../section-layout/SearchableSetting'
import { useTranslate } from '@/i18n/use-translate'

type TerminalAgentAgeBadgeSettingsProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}

export function TerminalAgentAgeBadgeSettings({
  settings,
  updateSettings
}: TerminalAgentAgeBadgeSettingsProps): React.JSX.Element {
  const t = useTranslate()
  const defaults = DEFAULT_AGENT_AGE_BADGE_SETTINGS
  const enabled = settings.terminalAgentAgeBadge ?? defaults.terminalAgentAgeBadge
  const palette = settings.terminalAgentAgeBadgePalette ?? defaults.terminalAgentAgeBadgePalette
  const customColors =
    settings.terminalAgentAgeBadgeCustomColors ?? defaults.terminalAgentAgeBadgeCustomColors
  const title = t('components.settings.terminal.agentAgeBadge.title', 'Agent age badge')

  return (
    <SearchableSetting
      title={title}
      description={t(
        'components.settings.terminal.agentAgeBadge.description',
        'Faint corner label with the time since an agent pane last finished, colored by whether you have looked at it.'
      )}
      keywords={['agent', 'age', 'idle', 'unread', 'badge', 'elapsed']}
    >
      <SettingsSwitchRow
        label={title}
        description={t(
          'components.settings.terminal.agentAgeBadge.switchDescription',
          'One color each for not viewed yet, viewed with no reply, and working.'
        )}
        checked={enabled}
        onChange={() => updateSettings({ terminalAgentAgeBadge: !enabled })}
      />
      {enabled ? (
        <>
          <SettingsRow
            label={t('components.settings.terminal.agentAgeBadge.colors', 'Badge colors')}
            control={
              <SettingsSegmentedControl
                ariaLabel={t('components.settings.terminal.agentAgeBadge.colors', 'Badge colors')}
                value={palette}
                onChange={(option) => updateSettings({ terminalAgentAgeBadgePalette: option })}
                options={[
                  {
                    value: 'traffic-light',
                    label: t(
                      'components.settings.terminal.agentAgeBadge.trafficLight',
                      'Traffic light'
                    )
                  },
                  {
                    value: 'agent-status',
                    label: t(
                      'components.settings.terminal.agentAgeBadge.agentStatus',
                      'Agent status'
                    )
                  },
                  {
                    value: 'custom',
                    label: t('components.settings.terminal.agentAgeBadge.custom', 'Custom')
                  }
                ]}
              />
            }
          />
          {palette === 'custom'
            ? (['unseen', 'held', 'working'] as const).map((kind) => (
                <ColorField
                  key={kind}
                  label={
                    kind === 'unseen'
                      ? t('components.settings.terminal.agentAgeBadge.unseenColor', 'Not viewed')
                      : kind === 'held'
                        ? t(
                            'components.settings.terminal.agentAgeBadge.heldColor',
                            'Viewed, no reply'
                          )
                        : t('components.settings.terminal.agentAgeBadge.workingColor', 'Working')
                  }
                  description=""
                  value={customColors[kind]}
                  fallback={defaults.terminalAgentAgeBadgeCustomColors[kind]}
                  onChange={(color) =>
                    updateSettings({
                      terminalAgentAgeBadgeCustomColors: { ...customColors, [kind]: color }
                    })
                  }
                />
              ))
            : null}
          <SettingsRow
            label={t(
              'components.settings.terminal.agentAgeBadge.heldTime',
              'Viewed, no reply shows'
            )}
            control={
              <SettingsSegmentedControl
                ariaLabel={t(
                  'components.settings.terminal.agentAgeBadge.heldTime',
                  'Viewed, no reply shows'
                )}
                value={
                  settings.terminalAgentAgeBadgeHeldTime ?? defaults.terminalAgentAgeBadgeHeldTime
                }
                onChange={(option) => updateSettings({ terminalAgentAgeBadgeHeldTime: option })}
                options={[
                  {
                    value: 'both',
                    label: t('components.settings.terminal.agentAgeBadge.heldBoth', 'Both')
                  },
                  {
                    value: 'since-finished',
                    label: t(
                      'components.settings.terminal.agentAgeBadge.heldFinished',
                      'Since finished'
                    )
                  },
                  {
                    value: 'since-seen',
                    label: t('components.settings.terminal.agentAgeBadge.heldSeen', 'Since viewed')
                  }
                ]}
              />
            }
          />
        </>
      ) : null}
    </SearchableSetting>
  )
}
