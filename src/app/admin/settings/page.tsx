'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getSettings, updateSettings } from '@/lib/api';
import type { Settings } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Admin configuration</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700" aria-live="polite">
          Settings saved successfully.
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Admin Information</h2>
        </div>
        <div className="space-y-5 p-6">
          {([
            { key: 'clinic_name', label: 'Admin Name', type: 'text' },
            { key: 'clinic_phone', label: 'Phone Number', type: 'text' },
            { key: 'clinic_email', label: 'Email Address', type: 'email' },
            { key: 'clinic_address', label: 'Admin Address', type: 'textarea' },
          ] as const).map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-slate-700">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.key}
                  value={settings[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  rows={3}
                  autoComplete="off"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              ) : (
                <input
                  id={field.key}
                  type={field.type}
                  value={settings[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  autoComplete="off"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">WhatsApp Configuration</h2>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-slate-700">WhatsApp Number</label>
            <input
              id="whatsapp_number"
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => updateField('whatsapp_number', e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="919447121519"
            />
            <p className="mt-1 text-xs text-slate-400">
              Include country code without + (e.g., 919447121519)
            </p>
          </div>
          <div>
            <label htmlFor="google_maps_link" className="block text-sm font-medium text-slate-700">Google Maps Link</label>
            <input
              id="google_maps_link"
              type="text"
              value={settings.google_maps_link}
              onChange={(e) => updateField('google_maps_link', e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Booking Configuration</h2>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Enable Online Booking</label>
              <p className="text-xs text-slate-400">Disable to pause all online bookings</p>
            </div>
            <button
              onClick={() => updateField('booking_enabled', settings.booking_enabled === '1' ? '0' : '1')}
              role="switch"
              aria-checked={settings.booking_enabled === '1'}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.booking_enabled === '1' ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.booking_enabled === '1' ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
          <div>
            <label htmlFor="slot_advance_days" className="block text-sm font-medium text-slate-700">
              Advance Booking Days
            </label>
            <input
              id="slot_advance_days"
              type="number"
              value={settings.slot_advance_days}
              onChange={(e) => updateField('slot_advance_days', e.target.value)}
              autoComplete="off"
              className="mt-1 block w-32 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Social Media</h2>
        </div>
        <div className="space-y-5 p-6">
          {([
            { key: 'instagram_url', label: 'Instagram URL' },
            { key: 'facebook_url', label: 'Facebook URL' },
          ] as const).map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-slate-700">{field.label}</label>
              <input
                id={field.key}
                type="url"
                value={settings[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                autoComplete="off"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
