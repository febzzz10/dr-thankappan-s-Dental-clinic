'use client';

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

const STORAGE_KEY = 'dental-slots';
const CONFIG_KEY = 'dental-gen-config';
const PUBLISH_KEY = 'dental-published';

const DAYS: Record<number, string> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
};

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

export function loadSlots(): SlotItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

export function saveSlots(slots: SlotItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function getPublishedSlots(): SlotItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PUBLISH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

export function publishSlots(slots: SlotItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PUBLISH_KEY, JSON.stringify(slots.map((s) => ({ ...s, is_draft: false }))));
  saveSlots(slots.map((s) => ({ ...s, is_draft: false })));
}

export function hasUnpublishedChanges(): boolean {
  const all = loadSlots();
  return all.some((s) => s.is_draft);
}

export function getUnpublishedCount(): number {
  return loadSlots().filter((s) => s.is_draft).length;
}

export function getSlotsForWeek(dateStr?: string): SlotItem[] {
  const all = loadSlots();
  const dates = getWeekDates(dateStr);
  return all.filter((s) => dates.includes(s.date));
}

export function getSlotsForRange(startDate: string, endDate: string): SlotItem[] {
  return loadSlots().filter((s) => s.date >= startDate && s.date <= endDate);
}

export function getSlotsByDate(date: string): SlotItem[] {
  return loadSlots().filter((s) => s.date === date);
}

export function addSlot(slot: Omit<SlotItem, 'id'>): SlotItem {
  const slots = loadSlots();
  const id = `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newSlot: SlotItem = { ...slot, id };
  slots.push(newSlot);
  saveSlots(slots);
  return newSlot;
}

export function updateSlot(id: string, changes: Partial<SlotItem>): SlotItem | null {
  const slots = loadSlots();
  const idx = slots.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  slots[idx] = { ...slots[idx], ...changes };
  saveSlots(slots);
  return slots[idx];
}

export function deleteSlot(id: string): boolean {
  const slots = loadSlots();
  const filtered = slots.filter((s) => s.id !== id);
  if (filtered.length === slots.length) return false;
  saveSlots(filtered);
  return true;
}

export function blockDay(date: string): SlotItem[] {
  const slots = loadSlots();
  const updated = slots.map((s) => {
    if (s.date === date && s.status === 'available') {
      return { ...s, status: 'blocked' as const, is_active: false };
    }
    return s;
  });
  saveSlots(updated);
  return updated.filter((s) => s.date === date);
}

export function unblockDay(date: string): SlotItem[] {
  const slots = loadSlots();
  const updated = slots.map((s) => {
    if (s.date === date && s.status === 'blocked') {
      return { ...s, status: 'available' as const, is_active: true };
    }
    return s;
  });
  saveSlots(updated);
  return updated.filter((s) => s.date === date);
}

export function getSummary(slots: SlotItem[]): { available: number; booked: number; blocked: number } {
  return {
    available: slots.filter((s) => s.status === 'available' && s.is_active).length,
    booked: slots.filter((s) => s.status === 'booked').length,
    blocked: slots.filter((s) => s.status === 'blocked').length,
  };
}

export function generateSlots(config: GenConfig, weekDates: string[]): SlotItem[] {
  const existing = loadSlots();
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

      const h = hour;
      const period = isMorning ? 'Morning' : isAfternoon ? 'Afternoon' : 'Evening';

      newSlots.push({
        id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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

  const all = [...existing, ...newSlots];
  saveSlots(all);
  return newSlots;
}

export function copyWeekSlots(fromDates: string[], toDates: string[]): number {
  const all = loadSlots();
  const fromSlots = all.filter((s) => fromDates.includes(s.date));
  const toDateSet = new Set(toDates);
  const existingKeys = new Set(all.map((s) => `${s.date}-${s.start_time}`));
  let count = 0;

  for (const slot of fromSlots) {
    const fromDate = slot.date;
    const fromIdx = fromDates.indexOf(fromDate);
    if (fromIdx === -1 || fromIdx >= toDates.length) continue;
    const toDate = toDates[fromIdx];
    const key = `${toDate}-${slot.start_time}`;
    if (existingKeys.has(key)) continue;

    all.push({
      ...slot,
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: toDate,
      day_of_week: getDateDayName(toDate),
      is_draft: true,
      status: 'available',
      patient_count: 0,
    });
    count++;
  }

  saveSlots(all);
  return count;
}
