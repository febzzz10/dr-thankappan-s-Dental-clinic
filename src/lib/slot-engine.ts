'use client';

import type { Slot as ApiSlot } from './api';

export interface SlotConfig {
  workStart: string;
  workEnd: string;
  intervalMinutes: number;
  procedureDurations: Record<string, number>;
}

export interface SlotItem {
  id: string;
  date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  endTime?: string;
  label: string;
  status: 'available' | 'booked' | 'blocked';
  is_active: boolean;
  is_draft?: boolean;
  procedure_type: string | null;
  patient_name?: string;
  phone?: string;
  patient_count?: number;
}

export interface GenConfig {
  workStart: string;
  workEnd: string;
  durationMinutes: number;
  breakStart: string;
  breakEnd: string;
  maxPatients: number;
  selectedDays: string[];
  enableMorning: boolean;
  enableAfternoon: boolean;
  enableEvening: boolean;
}

const CONFIG_KEY = 'dental-gen-config';

export const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

export const DAY_FULL: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

export const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const TIME_HUMAN: Record<string, string> = {};
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '15', '30', '45']) {
    const t = `${String(h).padStart(2, '0')}:${m}`;
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    TIME_HUMAN[t] = `${h12}:${m}${ampm}`;
  }
}

let slotsCache: SlotItem[] | null = null;

function mapSlot(s: ApiSlot): SlotItem {
  return {
    id: String(s.id),
    date: s.date,
    day_of_week: getDateDayName(s.date),
    start_time: s.start_time,
    end_time: s.end_time,
    endTime: s.end_time,
    label: s.slot_label || '',
    status: s.status,
    is_active: s.status === 'available' || s.status === 'booked',
    is_draft: false,
    procedure_type: s.procedure_type,
    patient_count: 0,
  };
}

function mapSlots(slots: ApiSlot[]): SlotItem[] {
  return slots.map(mapSlot);
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function to12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')}${ampm}`;
}

export function timeToMin(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function getWeekDates(dateStr?: string): string[] {
  const today = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
  const dayOfWeek = today.getDay();
  const monday = addDays(today, -((dayOfWeek + 6) % 7));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(addDays(monday, i)));
  }
  return dates;
}

export function getDateDayName(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

export function getDefaultConfig(): GenConfig {
  return {
    workStart: '09:00',
    workEnd: '18:00',
    durationMinutes: 30,
    breakStart: '13:00',
    breakEnd: '14:00',
    maxPatients: 1,
    selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    enableMorning: true,
    enableAfternoon: true,
    enableEvening: true,
  };
}

export function loadConfig(): GenConfig {
  if (typeof window === 'undefined') return getDefaultConfig();
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return { ...getDefaultConfig(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return getDefaultConfig();
}

export function saveConfig(config: GenConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export async function loadSlots(from?: string, to?: string): Promise<SlotItem[]> {
  const { getSlots } = await import('./api');
  if (!from) {
    const d = new Date();
    from = formatDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  if (!to) {
    const d = new Date(from + 'T00:00:00');
    d.setDate(d.getDate() + 60);
    to = formatDate(d);
  }
  const raw = await getSlots(from, to);
  slotsCache = mapSlots(raw);
  return slotsCache;
}

export async function saveSlots(slots: SlotItem[]): Promise<void> {
  slotsCache = slots;
}

export async function getPublishedSlots(): Promise<SlotItem[]> {
  return loadSlots();
}

export async function publishSlots(): Promise<void> {
}

export function hasUnpublishedChanges(): boolean {
  return false;
}

export function getUnpublishedCount(): number {
  return 0;
}

export async function getSlotsForWeek(dateStr?: string): Promise<SlotItem[]> {
  const all = await loadSlots();
  const dates = getWeekDates(dateStr);
  return all.filter((s) => dates.includes(s.date));
}

export async function getSlotsForRange(startDate: string, endDate: string): Promise<SlotItem[]> {
  const all = await loadSlots();
  return all.filter((s) => s.date >= startDate && s.date <= endDate);
}

export async function getSlotsByDate(date: string): Promise<SlotItem[]> {
  const all = await loadSlots();
  return all.filter((s) => s.date === date);
}

export async function addSlot(slot: Omit<SlotItem, 'id'>): Promise<SlotItem> {
  const { createSlot } = await import('./api');
  const result = await createSlot({
    date: slot.date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    slot_label: slot.label,
    status: slot.status,
    doctor_id: 1,
    procedure_type: slot.procedure_type,
  });
  const newSlot: SlotItem = {
    ...slot,
    id: String(result.id),
    day_of_week: getDateDayName(slot.date),
    is_draft: false,
    patient_count: 0,
  };
  if (slotsCache) slotsCache.push(newSlot);
  return newSlot;
}

export async function updateSlot(id: string, changes: Partial<SlotItem>): Promise<SlotItem | null> {
  const { updateSlot: apiUpdateSlot } = await import('./api');
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const apiChanges: { status?: string; procedure_type?: string; start_time?: string; end_time?: string } = {};
  if (changes.status) apiChanges.status = changes.status;
  if (changes.procedure_type != null) apiChanges.procedure_type = changes.procedure_type;
  if (changes.start_time) apiChanges.start_time = changes.start_time;
  if (changes.end_time) apiChanges.end_time = changes.end_time;

  try {
    await apiUpdateSlot(numId, apiChanges);
  } catch {
    // If the slot was marked booked on server, ignore
  }

  if (slotsCache) {
    const idx = slotsCache.findIndex((s) => s.id === id);
    if (idx !== -1) {
      slotsCache[idx] = { ...slotsCache[idx], ...changes };
      return slotsCache[idx];
    }
  }
  return null;
}

export async function deleteSlot(id: string): Promise<boolean> {
  const { deleteSlot: apiDeleteSlot } = await import('./api');
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return false;

  try {
    await apiDeleteSlot(numId);
  } catch {
    return false;
  }

  if (slotsCache) {
    const len = slotsCache.length;
    slotsCache = slotsCache.filter((s) => s.id !== id);
    return slotsCache.length < len;
  }
  return true;
}

export async function blockDay(date: string): Promise<SlotItem[]> {
  const { getSlots, updateSlot: apiUpdateSlot } = await import('./api');
  const daySlots = await getSlots(date, date);
  const updatedIds: number[] = [];

  for (const s of daySlots) {
    if (s.status === 'available') {
      try {
        await apiUpdateSlot(s.id, { status: 'blocked' });
        updatedIds.push(s.id);
      } catch { /* skip */ }
    }
  }

  if (slotsCache) {
    slotsCache = slotsCache.map((s) => {
      if (s.date === date && s.status === 'available') {
        return { ...s, status: 'blocked' as const, is_active: false };
      }
      return s;
    });
  }

  return (slotsCache || []).filter((s) => s.date === date);
}

export async function unblockDay(date: string): Promise<SlotItem[]> {
  const { getSlots, updateSlot: apiUpdateSlot } = await import('./api');
  const daySlots = await getSlots(date, date);
  const updatedIds: number[] = [];

  for (const s of daySlots) {
    if (s.status === 'blocked') {
      try {
        await apiUpdateSlot(s.id, { status: 'available' });
        updatedIds.push(s.id);
      } catch { /* skip */ }
    }
  }

  if (slotsCache) {
    slotsCache = slotsCache.map((s) => {
      if (s.date === date && s.status === 'blocked') {
        return { ...s, status: 'available' as const, is_active: true };
      }
      return s;
    });
  }

  return (slotsCache || []).filter((s) => s.date === date);
}

export function getSummary(slots: SlotItem[]): { available: number; booked: number; blocked: number } {
  return {
    available: slots.filter((s) => s.status === 'available' && s.is_active).length,
    booked: slots.filter((s) => s.status === 'booked').length,
    blocked: slots.filter((s) => s.status === 'blocked').length,
  };
}

export async function generateSlots(config: GenConfig, weekDates: string[]): Promise<SlotItem[]> {
  const { createBatchSlots } = await import('./api');

  const existing = slotsCache || await loadSlots();
  const existingKeys = new Set(existing.map((s) => `${s.date}-${s.start_time}`));
  const newSlots: SlotItem[] = [];

  for (const date of weekDates) {
    const dayName = getDateDayName(date);
    if (!config.selectedDays.includes(dayName)) continue;

    const startMin = timeToMin(config.workStart);
    const endMin = timeToMin(config.workEnd);
    const breakStartMin = timeToMin(config.breakStart);
    const breakEndMin = timeToMin(config.breakEnd);
    const dur = config.durationMinutes;

    for (let m = startMin; m + dur <= endMin; m += dur) {
      if (m >= breakStartMin && m < breakEndMin) continue;

      const start = minToTime(m);
      const end = minToTime(m + dur);
      const key = `${date}-${start}`;
      if (existingKeys.has(key)) continue;

      const hour = parseInt(start);
      const isMorning = hour >= 6 && hour < 12;
      const isAfternoon = hour >= 12 && hour < 17;
      const isEvening = hour >= 17;

      if (!config.enableMorning && isMorning) continue;
      if (!config.enableAfternoon && isAfternoon) continue;
      if (!config.enableEvening && isEvening) continue;

      const period = isMorning ? 'Morning' : isAfternoon ? 'Afternoon' : 'Evening';

      newSlots.push({
        id: `temp-${Math.random().toString(36).slice(2, 8)}`,
        date,
        day_of_week: dayName,
        start_time: start,
        end_time: end,
        label: period,
        status: 'available',
        is_active: true,
        is_draft: true,
        procedure_type: null,
        patient_count: 0,
      });
    }
  }

  // Persist new slots to the API
  if (newSlots.length > 0) {
    try {
      const batchPayload = newSlots.map((s) => ({
        date: s.date,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_label: 'available',
        status: 'available' as const,
        doctor_id: 1,
        procedure_type: null,
      }));
      await createBatchSlots(batchPayload);
      // Reload to get real IDs
      const reloaded = await loadSlots();
      if (slotsCache) {
        const newIds = reloaded.filter(
          (r) => !existing.some((e) => e.id === r.id)
        );
        return newIds;
      }
      return newSlots;
    } catch {
      // If batch fails, just return the locally generated ones
      if (slotsCache) {
        slotsCache.push(...newSlots);
      }
      return newSlots;
    }
  }

  return [];
}

export async function copyWeekSlots(fromDates: string[], toDates: string[]): Promise<number> {
  const { createBatchSlots } = await import('./api');
  const all = slotsCache || await loadSlots();
  const fromSlots = all.filter((s) => fromDates.includes(s.date));
  const existingKeys = new Set(all.map((s) => `${s.date}-${s.start_time}`));
  const toAdd: SlotItem[] = [];
  let count = 0;

  for (const slot of fromSlots) {
    const fromIdx = fromDates.indexOf(slot.date);
    if (fromIdx === -1 || fromIdx >= toDates.length) continue;
    const toDate = toDates[fromIdx];
    const key = `${toDate}-${slot.start_time}`;
    if (existingKeys.has(key)) continue;

    toAdd.push({
      ...slot,
      id: `temp-${Math.random().toString(36).slice(2, 8)}`,
      date: toDate,
      day_of_week: getDateDayName(toDate),
      is_draft: true,
      status: 'available',
      patient_count: 0,
    });
    count++;
  }

  if (toAdd.length > 0) {
    try {
      await createBatchSlots(toAdd.map((s) => ({
        date: s.date,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_label: 'available',
        status: 'available' as const,
        doctor_id: 1,
        procedure_type: null,
      })));
      await loadSlots();
    } catch {
      if (slotsCache) slotsCache.push(...toAdd);
    }
  }

  return count;
}
