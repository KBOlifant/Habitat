import { useSyncExternalStore } from 'react';

// Development-only simulated date. Held in memory on purpose: a reload always
// returns to the real date, so a forgotten toggle can't keep writing fake dates.

/** Master switch for every dev tool (time travel, complete/clear day, clear progress). */
export const DEV_TOOLS = false;

type DevClockState ={ enabled: boolean; date: string };

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

let state: DevClockState = { enabled: false, date: toIsoDate(new Date()) };
const listeners = new Set<() => void>();

const getState = () => state;
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const setState = (next: DevClockState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

/** The current moment: the simulated day (at the real time of day) when time travel is on. */
export function getNow(): Date {
  const now = new Date();
  if (!DEV_TOOLS || !state.enabled) return now;

  const [year, month, day] = state.date.split('-').map(Number);
  now.setFullYear(year, month - 1, day);
  return now;
}

export function setDevClockEnabled(enabled: boolean) {
  setState({ enabled, date: enabled ? state.date : toIsoDate(new Date()) });
}

export function shiftDevClock(days: number) {
  const next = new Date(`${state.date}T12:00:00`);
  next.setDate(next.getDate() + days);
  setState({ ...state, date: toIsoDate(next) });
}

export function resetDevClock() {
  setState({ ...state, date: toIsoDate(new Date()) });
}

export function useDevClock() {
  const clock = useSyncExternalStore(subscribe, getState, getState);
  // Derived from `clock` rather than getNow() so the React Compiler can't cache a stale date.
  return { ...clock, today: DEV_TOOLS && clock.enabled ? clock.date : toIsoDate(new Date()) };
}
