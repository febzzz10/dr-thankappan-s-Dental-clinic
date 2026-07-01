'use client';

import { useState, useEffect, useMemo, useCallback, startTransition } from 'react';
import {
  PiPlus, PiCheck, PiXBold, PiTrash,
  PiCaretLeft, PiCaretRight, PiClock, PiNotePencil,
  PiCircle, PiProhibitInset, PiSun, PiSunDim, PiMoon,
  PiMagnifyingGlass, PiCalendarBlank, PiDotsThree,
} from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  loadSlots, saveSlots, getSlotsForWeek, getWeekDates,
  addSlot, updateSlot, deleteSlot, blockDay, unblockDay,
  getSummary, generateSlots,
  loadConfig, saveConfig, getDefaultConfig,
  hasUnpublishedChanges, getUnpublishedCount,
  publishSlots,
  DAY_LABELS, DAY_FULL, DAYS_ORDER, formatDate,
  to12h, timeToMin, minToTime, getDateDayName, TIME_HUMAN,
  type SlotItem, type GenConfig,
} from '@/lib/slot-engine';

const ALL_TIMES: string[] = [];
for (let h = 7; h <= 20; h++) {
  for (const m of ['00', '15', '30', '45']) {
    const t = `${String(h).padStart(2, '0')}:${m}`;
    if (t >= '06:00' && t <= '21:00') ALL_TIMES.push(t);
  }
}
const DURATIONS = [15, 30, 45, 60];

function shortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fullDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function monthStartDay(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getPeriod(time: string): 'morning' | 'afternoon' | 'evening' {
  const h = parseInt(time);
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const PERIOD_CONFIG = [
  { key: 'morning' as const, label: 'Morning', icon: PiSun, time: '6:00 AM – 11:59 AM', bg: 'bg-amber-50/40', border: 'border-amber-100/60' },
  { key: 'afternoon' as const, label: 'Afternoon', icon: PiSunDim, time: '12:00 PM – 4:59 PM', bg: 'bg-sky-50/40', border: 'border-sky-100/60' },
  { key: 'evening' as const, label: 'Evening', icon: PiMoon, time: '5:00 PM – 9:00 PM', bg: 'bg-indigo-50/40', border: 'border-indigo-100/60' },
];

function isPastDate(dateStr: string): boolean {
  return dateStr < formatDate(new Date());
}

export default function AdminSlotsPage() {
  // Calendar state
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  // Data
  const [allSlots, setAllSlots] = useState<SlotItem[]>([]);
  const [genConfig, setGenConfig] = useState<GenConfig>(getDefaultConfig());

  // UI
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDaySettings, setShowDaySettings] = useState(false);
  const [editSlotId, setEditSlotId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [addSlotPeriod, setAddSlotPeriod] = useState<string | null>(null);
  const [addSlotTime, setAddSlotTime] = useState('');

  const weekDates = useMemo(() => getWeekDates(formatDate(new Date())), []);
  const weekKey = weekDates.join(',');

  const refresh = useCallback(async () => {
    const loaded = await loadSlots();
    setAllSlots(loaded);
  }, []);

  useEffect(() => { startTransition(() => { refresh(); }); }, []);
  useEffect(() => { startTransition(() => { setGenConfig(loadConfig()); }); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Calendar logic
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const totalDays = daysInMonth(calYear, calMonth);
  const startDay = monthStartDay(calYear, calMonth);

  const calDays = useMemo(() => {
    const days: { date: string; dayNum: number; slots: SlotItem[] }[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const daySlots = allSlots.filter((s) => s.date === dateStr);
      days.push({ date: dateStr, dayNum: d, slots: daySlots });
    }
    return days;
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [calYear, calMonth, totalDays, allSlots]);

  const selectedDaySlots = useMemo(
    () => allSlots.filter((s) => s.date === selectedDate),
    [allSlots, selectedDate],
  );

  const filteredDaySlots = useMemo(() => {
    let result = [...selectedDaySlots];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.start_time.includes(q) || s.label?.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') {
      result = result.filter((s) => {
        if (filterStatus === 'available') return s.status === 'available' && s.is_active;
        if (filterStatus === 'booked') return s.status === 'booked';
        if (filterStatus === 'blocked') return s.status === 'blocked';
        if (filterStatus === 'inactive') return !s.is_active && s.status === 'available';
        return true;
      });
    }
    result.sort((a, b) => {
      const cmp = a.start_time.localeCompare(b.start_time);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [selectedDaySlots, searchQuery, filterStatus, sortOrder]);

  const groupedSlots = useMemo(() => {
    const groups: Record<string, SlotItem[]> = { morning: [], afternoon: [], evening: [] };
    for (const s of filteredDaySlots) {
      const p = getPeriod(s.start_time);
      groups[p].push(s);
    }
    return groups;
  }, [filteredDaySlots]);

  const summary = useMemo(() => getSummary(allSlots), [allSlots]);

  const handleGenerateSlots = async () => {
    saveConfig(genConfig);
    const dates = getWeekDates(selectedDate);
    const result = await generateSlots(genConfig, dates);
    showToast(`Generated ${result.length} new slots for ${shortDate(dates[0])} – ${shortDate(dates[6])}`);
    setShowBulkModal(false);
    await refresh();
  };

  const handlePublish = async () => {
    await publishSlots();
    showToast('Schedule published successfully');
    await refresh();
  };

  const handleDiscardDrafts = async () => {
    await refresh();
    showToast('Changes discarded');
  };

  const handleToggle = async (slot: SlotItem) => {
    if (slot.status === 'booked') return;
    if (slot.status === 'blocked') {
      await unblockDay(slot.date);
      showToast(`Unblocked ${to12h(slot.start_time)}`);
    } else if (!slot.is_active) {
      await updateSlot(slot.id, { is_active: true, status: 'available' });
      showToast(`Enabled ${to12h(slot.start_time)}`);
    } else {
      await updateSlot(slot.id, { is_active: false });
      showToast(`Disabled ${to12h(slot.start_time)}`);
    }
    await refresh();
  };

  const handleBlockSlot = async (slot: SlotItem) => {
    await updateSlot(slot.id, { status: 'blocked', is_active: false });
    showToast(`Blocked ${to12h(slot.start_time)}`);
    await refresh();
  };

  const handleSaveEdit = async (slot: SlotItem) => {
    await updateSlot(slot.id, { start_time: editStart, end_time: editEnd });
    setEditSlotId(null);
    showToast(`Updated to ${to12h(editStart)}`);
    await refresh();
  };

  const handleQuickAddSlot = async () => {
    if (!addSlotTime || !addSlotPeriod || !selectedDate) return;
    const h = parseInt(addSlotTime);
    const endH = h + 1;
    const d = new Date(selectedDate + 'T00:00:00');
    await addSlot({
      date: selectedDate,
      day_of_week: d.toLocaleDateString('en-US', { weekday: 'short' }),
      start_time: addSlotTime,
      end_time: `${String(endH).padStart(2, '0')}:00`,
      label: to12h(addSlotTime),
      status: 'available',
      is_active: true,
      is_draft: true,
      procedure_type: null,
    });
    setAddSlotPeriod(null);
    setAddSlotTime('');
    showToast(`Added ${to12h(addSlotTime)}`);
    await refresh();
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const unpublishedCount = useMemo(() => getUnpublishedCount(), [allSlots]);
  const isToday = (d: string) => d === formatDate(new Date());
  const isSelected = (d: string) => d === selectedDate;

  const dateDot = (slots: SlotItem[]) => {
    const hasAvailable = slots.some((s) => s.status === 'available' && s.is_active);
    const hasBooked = slots.some((s) => s.status === 'booked');
    const hasBlocked = slots.some((s) => s.status === 'blocked');
    if (slots.length === 0) return 'bg-slate-200';
    if (hasBooked) return 'bg-red-400';
    if (hasBlocked) return 'bg-orange-400';
    if (hasAvailable) return 'bg-emerald-400';
    return 'bg-slate-200';
  };

  const dotLabel = (slots: SlotItem[]) => {
    if (slots.length === 0) return 'No slots';
    const a = slots.filter((s) => s.status === 'available' && s.is_active).length;
    const b = slots.filter((s) => s.status === 'booked').length;
    const bl = slots.filter((s) => s.status === 'blocked').length;
    const parts: string[] = [];
    if (a) parts.push(`${a} available`);
    if (b) parts.push(`${b} booked`);
    if (bl) parts.push(`${bl} blocked`);
    return parts.join(', ');
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white shadow-2xl shadow-slate-900/20 flex items-center gap-2.5">
          <PiCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Time Slot Management</h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage clinic availability and appointment slots with ease.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {unpublishedCount > 0 && (
            <Button size="sm" onClick={handlePublish}>
              <PiCheck className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Publish Schedule
            </Button>
          )}
          <Button size="sm" onClick={() => setShowBulkModal(true)}>
            Create Slots
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { label: 'Available Slots', value: summary.available, icon: PiCircle, gradient: 'from-emerald-50 to-emerald-100/60', iconColor: 'text-emerald-500' },
          { label: 'Booked Slots', value: summary.booked, icon: PiCalendarBlank, gradient: 'from-red-50 to-red-100/60', iconColor: 'text-red-500' },
          { label: 'Blocked Slots', value: summary.blocked, icon: PiProhibitInset, gradient: 'from-orange-50 to-amber-100/60', iconColor: 'text-orange-400' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                  <p className="mt-1.5 font-display text-3xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${card.iconColor} opacity-60`} aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish banner */}
      {unpublishedCount > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-3.5 flex items-center justify-between shadow-sm">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{unpublishedCount}</span> unpublished slot{unpublishedCount !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDiscardDrafts}>Discard</Button>
            <Button size="sm" onClick={handlePublish}>Publish Now</Button>
          </div>
        </div>
      )}

      {/* Main 2-col */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* LEFT: Calendar + Quick Add */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar Card */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-5">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                >
                  <PiCaretLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="text-sm font-semibold text-slate-800">{monthLabel(calDate)}</span>
                <button
                  onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                >
                  <PiCaretRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {calDays.map((day) => {
                  const sel = isSelected(day.date);
                  const today = isToday(day.date);
                  const past = isPastDate(day.date);
                  return (
                    <button
                      key={day.date}
                      onClick={() => handleDateClick(day.date)}
                      disabled={past && day.slots.length === 0}
                      className={`relative flex flex-col items-center justify-center rounded-xl py-2.5 text-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none ${
                        sel
                          ? 'bg-teal-500 text-white shadow-md shadow-teal-200'
                          : today
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-slate-700 hover:bg-slate-50'
                      } ${past && day.slots.length === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={dotLabel(day.slots)}
                    >
                      <span className={`text-sm font-semibold leading-none ${sel ? 'text-white' : ''}`}>
                        {day.dayNum}
                      </span>
                      {day.slots.length > 0 && (
                        <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${sel ? 'bg-white/80' : dateDot(day.slots)}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-red-400" /> Booked</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-orange-400" /> Blocked</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-slate-200" /> No slots</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Slot chips */}
        <div className="lg:col-span-3 space-y-4">
          {/* Day header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">{fullDate(selectedDate)}</h2>
              <p className="text-xs text-slate-400">{selectedDaySlots.length} slot{selectedDaySlots.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedDaySlots.length > 0 && (
                <button
                  onClick={async () => {
                    await blockDay(selectedDate);
                    await refresh();
                    showToast(`Blocked ${fullDate(selectedDate)}`);
                  }}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                >
                  Block Day
                </button>
              )}
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <PiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search slots..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm transition-colors focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              />
            </div>
            {['all', 'available', 'booked', 'blocked'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none ${
                  filterStatus === f
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setSortOrder((o) => o === 'asc' ? 'desc' : 'asc')}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
            >
              {sortOrder === 'asc' ? '↑' : '↓'} Time
            </button>
          </div>

          {/* Slot groups by period */}
          {selectedDaySlots.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <PiCalendarBlank className="h-8 w-8 text-slate-300" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-600">No slots for this day</p>
                <p className="mt-1 text-sm text-slate-400">
                  Add a slot or select a different date.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PERIOD_CONFIG.map((period) => (
                  <button
                    key={period.key}
                    onClick={() => { setAddSlotPeriod(period.key); setAddSlotTime(''); }}
                    className="flex items-center gap-1.5 rounded-xl border border-dashed border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-400 transition-all hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                  >
                    <PiPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    {period.label}
                  </button>
                ))}
              </div>
              {/* Inline add form in empty state */}
              {PERIOD_CONFIG.map((period) => {
                if (addSlotPeriod !== period.key) return null;
                const Icon = period.icon;
                return (
                  <div className="w-full max-w-sm" key={period.key}>
                    <div className="flex items-center gap-2 rounded-xl border-2 border-teal-200 bg-teal-50/50 px-3.5 py-2.5">
                      <Icon className="h-4 w-4 text-teal-500 shrink-0" aria-hidden="true" />
                      <select
                        value={addSlotTime}
                        onChange={(e) => setAddSlotTime(e.target.value)}
                        className="flex-1 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        autoFocus
                      >
                        <option value="">Select time</option>
                        {ALL_TIMES.map((t) => (
                          <option key={t} value={t}>{to12h(t)}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleQuickAddSlot}
                        disabled={!addSlotTime}
                        className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <PiCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Add
                      </button>
                      <button
                        onClick={() => { setAddSlotPeriod(null); setAddSlotTime(''); }}
                        className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
              <div className="space-y-4">
              {PERIOD_CONFIG.map((period) => {
                const slots = groupedSlots[period.key];
                const Icon = period.icon;
                const showAdd = addSlotPeriod === period.key;
                return (
                  <div key={period.key} className={`rounded-2xl border ${period.border} ${period.bg} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{period.label}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{period.time}</span>
                      <span className="ml-auto text-xs font-medium text-slate-400">{slots.length} slot{slots.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2">
                      {slots.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => {
                        const isEditing = editSlotId === slot.id;
                        const past = isPastDate(slot.date);
                        const statusColors: Record<string, string> = {
                          available: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300',
                          booked: 'border-red-200 bg-red-50 text-red-800',
                          blocked: 'border-orange-200 bg-orange-50 text-orange-800',
                        };
                        const inactiveStyle = !slot.is_active && slot.status === 'available'
                          ? 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                          : '';

                        return (
                          <div
                            key={slot.id}
                            className={`group relative rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${
                              inactiveStyle || statusColors[slot.status] || 'border-slate-100 bg-white'
                            } ${past ? 'opacity-40' : !inactiveStyle && slot.status !== 'booked' ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : ''}`}
                            onClick={async () => {
                              if (past || slot.status === 'booked') return;
                              if (slot.status === 'blocked') {
                                await unblockDay(slot.date);
                                await refresh();
                                showToast(`Unblocked ${to12h(slot.start_time)}`);
                              } else {
                                await handleToggle(slot);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <PiClock className={`h-3.5 w-3.5 shrink-0 ${
                                slot.status === 'booked' ? 'text-red-400' :
                                slot.status === 'blocked' ? 'text-orange-400' :
                                !slot.is_active ? 'text-slate-300' : 'text-emerald-500'
                              }`} aria-hidden="true" />
                              <div>
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <select value={editStart} onChange={(e) => setEditStart(e.target.value)} className="w-[76px] rounded-lg border border-slate-200 px-1.5 py-1 text-xs" autoFocus>
                                      {ALL_TIMES.map((t) => <option key={t} value={t}>{to12h(t)}</option>)}
                                    </select>
                                    <span className="text-xs text-slate-300">–</span>
                                    <select value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="w-[76px] rounded-lg border border-slate-200 px-1.5 py-1 text-xs">
                                      {ALL_TIMES.filter((t) => t > editStart).map((t) => <option key={t} value={t}>{to12h(t)}</option>)}
                                    </select>
                                  </div>
                                ) : (
                                  <span className="text-sm font-semibold tabular-nums">
                                    {to12h(slot.start_time)}
                                  </span>
                                )}
                                <span className="ml-2 text-[10px] font-medium uppercase tracking-wider opacity-70">
                                  {slot.status === 'booked' ? 'Booked' :
                                   slot.status === 'blocked' ? 'Blocked' :
                                   !slot.is_active ? 'Inactive' : 'Available'}
                                </span>
                              </div>
                            </div>

                            {/* Hover actions */}
                            {!past && slot.status !== 'booked' && !isEditing && (
                              <div className="absolute -right-1 -top-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditSlotId(slot.id); setEditStart(slot.start_time); setEditEnd(slot.end_time || slot.start_time); }}
                                  className="rounded-lg bg-white border border-slate-200 p-1 text-slate-400 hover:text-teal-600 shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                                >
                                  <PiNotePencil className="h-3 w-3" aria-hidden="true" />
                                </button>
                                {slot.status !== 'blocked' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleBlockSlot(slot); }}
                                    className="rounded-lg bg-white border border-slate-200 p-1 text-slate-400 hover:text-orange-600 shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                                  >
                                    <PiProhibitInset className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(slot.id); }}
                                  className="rounded-lg bg-white border border-slate-200 p-1 text-slate-400 hover:text-red-500 shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
                                >
                                  <PiTrash className="h-3 w-3" aria-hidden="true" />
                                </button>
                              </div>
                            )}

                            {/* Inline edit actions */}
                            {isEditing && (
                              <div className="mt-1.5 flex gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSaveEdit(slot); }}
                                  className="rounded-lg bg-teal-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-teal-600 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditSlotId(null); }}
                                  className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-slate-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      </div>)}
                      {/* Add Slot */}
                      {showAdd ? (
                        <div className="flex items-center gap-2 rounded-xl border-2 border-teal-200 bg-teal-50/50 px-3.5 py-2.5">
                          <select
                            value={addSlotTime}
                            onChange={(e) => setAddSlotTime(e.target.value)}
                            className="rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            autoFocus
                          >
                            <option value="">Select time</option>
                            {ALL_TIMES.map((t) => (
                              <option key={t} value={t}>{to12h(t)}</option>
                            ))}
                          </select>
                          <button
                            onClick={handleQuickAddSlot}
                            disabled={!addSlotTime}
                            className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PiPlus className="h-3.5 w-3.5" aria-hidden="true" />
                            Add
                          </button>
                          <button
                            onClick={() => { setAddSlotPeriod(null); setAddSlotTime(''); }}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddSlotPeriod(period.key);
                            setAddSlotTime('');
                          }}
                          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-400 transition-all hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none w-full"
                        >
                          <PiPlus className="h-4 w-4" aria-hidden="true" />
                          Add Slot — {period.label}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BULK CREATE MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setShowBulkModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-slate-900">Create Weekly Slots</h3>
              <button onClick={() => setShowBulkModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none">
                <PiXBold className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_ORDER.map((day) => {
                    const active = genConfig.selectedDays.includes(day);
                    return (
                      <button key={day} onClick={() => setGenConfig((c) => ({ ...c, selectedDays: active ? c.selectedDays.filter((d) => d !== day) : [...c.selectedDays, day] }))}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none ${active ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >{DAY_LABELS[day]}</button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">From</label>
                  <select value={genConfig.workStart} onChange={(e) => setGenConfig((c) => ({ ...c, workStart: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >{ALL_TIMES.map((t) => <option key={t} value={t}>{to12h(t)}</option>)}</select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">To</label>
                  <select value={genConfig.workEnd} onChange={(e) => setGenConfig((c) => ({ ...c, workEnd: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >{ALL_TIMES.filter((t) => t > genConfig.workStart).map((t) => <option key={t} value={t}>{to12h(t)}</option>)}</select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Duration</label>
                  <select value={genConfig.durationMinutes} onChange={(e) => setGenConfig((c) => ({ ...c, durationMinutes: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >{DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}</select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Break Start</label>
                  <select value={genConfig.breakStart} onChange={(e) => setGenConfig((c) => ({ ...c, breakStart: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >{ALL_TIMES.map((t) => <option key={t} value={t}>{to12h(t)}</option>)}</select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Break End</label>
                  <select value={genConfig.breakEnd} onChange={(e) => setGenConfig((c) => ({ ...c, breakEnd: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >{ALL_TIMES.filter((t) => t > genConfig.breakStart).map((t) => <option key={t} value={t}>{to12h(t)}</option>)}</select>
                </div>
              </div>
              <div className="rounded-xl bg-teal-50/60 border border-teal-100 px-4 py-3">
                <p className="text-sm text-teal-800">
                  <span className="font-semibold">Preview:</span> Approximately{' '}
                  {(() => {
                    const sm = timeToMin(genConfig.workStart);
                    const em = timeToMin(genConfig.workEnd);
                    const bs = timeToMin(genConfig.breakStart);
                    const be = timeToMin(genConfig.breakEnd);
                    const total = em - sm - Math.max(0, be - bs);
                    return Math.floor(total / genConfig.durationMinutes) * genConfig.selectedDays.length;
                  })()} slots
                </p>
                <p className="mt-0.5 text-xs text-teal-600">
                  Week of {shortDate(getWeekDates(selectedDate)[0])} – {shortDate(getWeekDates(selectedDate)[6])}
                  {' · '}{genConfig.selectedDays.length} day{genConfig.selectedDays.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowBulkModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleGenerateSlots}>Generate Slots</Button>
            </div>
          </div>
        </div>
      )}

      {/* COPY WEEK MODAL */}
      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900">Delete slot?</h3>
            <p className="mt-2 text-sm text-slate-500">This will permanently remove this time slot.</p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button className="flex-1" onClick={async () => { await deleteSlot(confirmDelete); setConfirmDelete(null); showToast('Slot deleted'); await refresh(); }} variant="danger">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
