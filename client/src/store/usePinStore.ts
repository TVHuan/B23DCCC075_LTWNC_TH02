import { create } from 'zustand';

export interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

const STORAGE_KEY = 'student_deadline_pinned_ids';

const loadInitialPinnedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage read errors in environments like SSR or testing
  }
  return [];
};

/**
 * Zustand store for managing pinned assignments.
 * Kept completely decoupled from Redux as specified in requirements.
 */
export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: loadInitialPinnedIds(),

  togglePin: (id: string) => {
    set((state) => {
      const exists = state.pinnedIds.includes(id);
      const newPinned = exists
        ? state.pinnedIds.filter((item) => item !== id)
        : [...state.pinnedIds, id];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPinned));
      } catch {
        // Ignore storage write errors
      }

      return { pinnedIds: newPinned };
    });
  },

  isPinned: (id: string) => {
    return get().pinnedIds.includes(id);
  },
}));
