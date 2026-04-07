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
        <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Settings</p>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Workspace settings</h2>
          <p className="max-w-2xl text-gray-600">Manage workspace identity, access controls, and automation settings in one place.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[0.95fr_0.65fr]">
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          {loading ? (
            <div className="rounded-3xl bg-gray-50 p-6 text-center text-gray-700">Loading workspace settings…</div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Workspace name</label>
                <input
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  placeholder="OpsAI Growth HQ"
                  disabled={disabled}
                  className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Workspace slug</label>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="opsai-growth"
                  disabled={disabled}
                  className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-sm text-gray-500">A unique identifier for your workspace settings.</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">CRM access</p>
                      <p className="text-sm text-gray-600">Enable or disable CRM features.</p>
                    </div>
                    <ToggleSwitch
                      checked={settings.apps?.crm ?? false}
                      onChange={(enabled) => handleSettingChange('apps.crm', enabled)}
                      label="CRM access"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">Lead engine</p>
                      <p className="text-sm text-gray-600">Enable lead generation automation.</p>
                    </div>
                    <ToggleSwitch
                      checked={settings.apps?.lead_engine ?? false}
                      onChange={(enabled) => handleSettingChange('apps.lead_engine', enabled)}
                      label="Lead engine"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Telegram</p>
                    <p className="text-sm text-gray-600">Control Telegram automation and welcome messages.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.channels?.telegram?.enabled ?? false}
                    onChange={(enabled) => handleSettingChange('channels.telegram.enabled', enabled)}
                    label="Telegram enabled"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">Welcome message</label>
                  <textarea
                    value={settings.channels?.telegram?.welcome_message ?? ''}
                    onChange={(event) => handleSettingChange('channels.telegram.welcome_message', event.target.value)}
                    disabled={disabled}
                    rows={3}
                    className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Welcome message for Telegram leads"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Automation delay</p>
                    <p className="text-sm text-gray-600">Set delay for follow-up actions.</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={settings.automation?.followup_delay_hours ?? 24}
                    onChange={(event) => handleSettingChange('automation.followup_delay_hours', Number(event.target.value))}
                    disabled={disabled}
                    className="w-24 rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Workspace</p>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Name</p>
              <p className="mt-2 text-base font-semibold text-gray-900">{workspace?.name ?? 'Not configured'}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Slug</p>
              <p className="mt-2 text-base font-semibold text-gray-900">{workspace?.slug ?? 'pending'}</p>
            </div>
          </div>
        </aside>
      </form>

      {(error || feedback) && (
        <div className={`rounded-3xl p-4 text-sm ${error ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
          {error || feedback}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={disabled}
        className="w-full rounded-3xl bg-white text-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] shadow-xl shadow-white/10 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? 'Saving…' : loading ? 'Loading…' : 'Save settings'}
      </button>
    </motion.div>
  );
}
