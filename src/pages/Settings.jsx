import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import ToggleSwitch from '../components/ToggleSwitch.jsx';

const defaultSettings = {
  apps: {
    crm: true,
    lead_engine: true,
  },
  channels: {
    telegram: {
      enabled: false,
      auto_reply: false,
      welcome_message: '',
    },
  },
  automation: {
    auto_save_lead: true,
    auto_followup: true,
    followup_delay_hours: 24,
  },
};

export default function Settings() {
  const [workspace, setWorkspace] = useState(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [slug, setSlug] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [hasSettingsRow, setHasSettingsRow] = useState(false);

  useEffect(() => {
    const loadWorkspaceSettings = async () => {
      setLoading(true);
      setError('');

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setError('Unable to restore session.');
        setLoading(false);
        return;
      }

      const { data: workspaceRow, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id, name, slug')
        .eq('owner_id', session.user.id)
        .maybeSingle();

      if (workspaceError) {
        setError('Unable to load workspace information.');
        setLoading(false);
        console.warn('Workspace fetch error:', workspaceError.message);
        return;
      }

      if (!workspaceRow) {
        setError('No workspace found for your account.');
        setLoading(false);
        return;
      }

      setWorkspace(workspaceRow);
      setWorkspaceName(workspaceRow.name || '');
      setSlug(workspaceRow.slug || '');

      const { data: settingsRow, error: settingsError } = await supabase
        .from('workspace_settings')
        .select('id, settings')
        .eq('workspace_id', workspaceRow.id)
        .maybeSingle();

      if (settingsError) {
        setError('Unable to load workspace settings.');
        console.warn('Workspace settings fetch error:', settingsError.message);
      }

      if (settingsRow?.settings) {
        setSettings({
          apps: {
            crm: settingsRow.settings.apps?.crm ?? defaultSettings.apps.crm,
            lead_engine: settingsRow.settings.apps?.lead_engine ?? defaultSettings.apps.lead_engine,
          },
          channels: {
            telegram: {
              enabled: settingsRow.settings.channels?.telegram?.enabled ?? defaultSettings.channels.telegram.enabled,
              auto_reply: settingsRow.settings.channels?.telegram?.auto_reply ?? defaultSettings.channels.telegram.auto_reply,
              welcome_message:
                settingsRow.settings.channels?.telegram?.welcome_message ?? defaultSettings.channels.telegram.welcome_message,
            },
          },
          automation: {
            auto_save_lead:
              settingsRow.settings.automation?.auto_save_lead ?? defaultSettings.automation.auto_save_lead,
            auto_followup:
              settingsRow.settings.automation?.auto_followup ?? defaultSettings.automation.auto_followup,
            followup_delay_hours:
              settingsRow.settings.automation?.followup_delay_hours ?? defaultSettings.automation.followup_delay_hours,
          },
        });
        setHasSettingsRow(true);
      } else {
        setSettings(defaultSettings);
        setHasSettingsRow(false);
      }

      setLoading(false);
    };

    loadWorkspaceSettings();
  }, []);

  const handleSettingChange = (path, value) => {
    setSettings((current) => {
      const next = JSON.parse(JSON.stringify(current));
      const keys = path.split('.');
      let target = next;
      keys.slice(0, -1).forEach((key) => {
        if (!target[key]) target[key] = {};
        target = target[key];
      });
      target[keys[keys.length - 1]] = value;
      return next;
    });
    setFeedback('');
    setError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setFeedback('');

    if (!workspaceName.trim() || !slug.trim()) {
      setError('Workspace name and slug are required.');
      return;
    }

    if (!workspace?.id) {
      setError('Workspace not initialized.');
      return;
    }

    setSaving(true);

    try {
      const { error: workspaceUpdateError } = await supabase
        .from('workspaces')
        .update({ name: workspaceName.trim(), slug: slug.trim() })
        .eq('id', workspace.id);

      if (workspaceUpdateError) {
        throw workspaceUpdateError;
      }

      const settingsPayload = {
        workspace_id: workspace.id,
        settings,
      };

      if (hasSettingsRow) {
        const { error: updateError } = await supabase
          .from('workspace_settings')
          .update({ settings })
          .eq('workspace_id', workspace.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from('workspace_settings')
          .insert(settingsPayload);

        if (insertError) {
          throw insertError;
        }
        setHasSettingsRow(true);
      }

      setWorkspace((prev) => ({ ...prev, name: workspaceName.trim(), slug: slug.trim() }));
      setFeedback('Workspace settings saved successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save workspace settings.');
      console.error('Save workspace settings error:', saveError.message || saveError);
    } finally {
      setSaving(false);
    }
  };

  const disabled = loading || saving;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-white/40">Settings</p>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Workspace controls</h2>
            <p className="max-w-2xl text-white/60">
              Configure workspace identity, channel routing, and automation with settings from workspace_settings.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="font-semibold text-white">Workspace overview</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-black/50 px-4 py-3">
                <span className="text-white/70">Workspace</span>
                <span className="font-medium text-white">{workspace?.name ?? 'Not configured'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-black/50 px-4 py-3">
                <span className="text-white/70">Slug</span>
                <span className="font-medium text-white">{workspace?.slug ?? 'pending'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-black/50 px-4 py-3">
                <span className="text-white/70">Settings source</span>
                <span className="font-medium text-white">workspace_settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          {loading ? (
            <div className="rounded-3xl bg-black/50 p-6 text-center text-white/70">Loading workspace settings…</div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/80">Workspace name</label>
                <input
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  placeholder="OpsAI Growth HQ"
                  disabled={disabled}
                  className="w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/80">Workspace slug</label>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="opsai-growth"
                  disabled={disabled}
                  className="w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-sm text-white/50">A unique, shareable identifier used by your workspace settings.</p>
              </div>

            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-lg font-semibold text-white">Channel & feature controls</p>
            <p className="mt-2 text-sm text-white/60">Update app access and Telegram config from the workspace settings object.</p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 px-5 py-4">
                <div>
                  <p className="font-medium text-white">CRM access</p>
                  <p className="text-sm text-white/50">Enable or disable CRM functionality for the workspace.</p>
                </div>
                <ToggleSwitch
                  checked={settings.apps?.crm ?? false}
                  onChange={(enabled) => handleSettingChange('apps.crm', enabled)}
                  label="CRM toggle"
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 px-5 py-4">
                <div>
                  <p className="font-medium text-white">Lead engine</p>
                  <p className="text-sm text-white/50">Enable lead engine automation for smart sourcing.</p>
                </div>
                <ToggleSwitch
                  checked={settings.apps?.lead_engine ?? false}
                  onChange={(enabled) => handleSettingChange('apps.lead_engine', enabled)}
                  label="Lead engine toggle"
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 px-5 py-4">
                <div>
                  <p className="font-medium text-white">Telegram enabled</p>
                  <p className="text-sm text-white/50">Allow Telegram channel automation to receive and reply to messages.</p>
                </div>
                <ToggleSwitch
                  checked={settings.channels?.telegram?.enabled ?? false}
                  onChange={(enabled) => handleSettingChange('channels.telegram.enabled', enabled)}
                  label="Telegram enabled"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <label className="block text-sm font-semibold text-white/80">Telegram welcome message</label>
                <textarea
                  value={settings.channels?.telegram?.welcome_message ?? ''}
                  onChange={(event) => handleSettingChange('channels.telegram.welcome_message', event.target.value)}
                  disabled={disabled}
                  rows={3}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter the welcome message for Telegram leads"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <label className="block text-sm font-semibold text-white/80">Follow-up delay (hours)</label>
                <input
                  type="number"
                  min={1}
                  value={settings.automation?.followup_delay_hours ?? 24}
                  onChange={(event) => handleSettingChange('automation.followup_delay_hours', Number(event.target.value))}
                  disabled={disabled}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {(error || feedback) && (
            <div className={`rounded-3xl p-4 text-sm ${error ? 'bg-red-500/10 text-red-200 border border-red-500/10' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/10'}`}>
              {error || feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-3xl bg-white text-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] shadow-xl shadow-white/10 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving workspace...' : loading ? 'Loading settings…' : 'Save workspace settings'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
