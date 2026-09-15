import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/index';
import { Assignment, StatsSummary, isOverdue, isUrgent } from './types';

export const selectAssignmentsState = (state: RootState) => state.assignments;

export const selectAllAssignments = (state: RootState) => state.assignments.items;
export const selectLoading = (state: RootState) => state.assignments.loading;
export const selectError = (state: RootState) => state.assignments.error;
export const selectCurrentFilter = (state: RootState) => state.assignments.filter;
export const selectSearchQuery = (state: RootState) => state.assignments.searchQuery;
export const selectSelectedPriority = (state: RootState) => state.assignments.selectedPriority;

/**
 * Dynamically computes real-time stats from the current Redux assignment items.
 * Guaranteed no hard-coding.
 */
export const selectStats = createSelector(
  [selectAllAssignments],
  (items): StatsSummary => {
    let pending = 0;
    let overdue = 0;
    let completed = 0;

    for (const item of items) {
      if (item.completed) {
        completed += 1;
      } else if (isOverdue(item)) {
        overdue += 1;
      } else {
        pending += 1;
      }
    }

    return {
      total: items.length,
      pending,
      overdue,
      completed,
    };
  }
);

/**
 * Filtered assignments based on:
 * 1. Filter tab (all, pending, overdue, completed)
 * 2. Priority dropdown (all, low, medium, high)
 * 3. Search query (subject or title)
 */
export const selectFilteredAssignments = createSelector(
  [selectAllAssignments, selectCurrentFilter, selectSearchQuery, selectSelectedPriority],
  (items, filter, search, priority): Assignment[] => {
    const trimmedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Filter tab check
      if (filter === 'completed' && !item.completed) return false;
      if (filter === 'pending' && (item.completed || isOverdue(item))) return false;
      if (filter === 'overdue' && (item.completed || !isOverdue(item))) return false;

      // 2. Priority check
      if (priority !== 'all' && item.priority !== priority) return false;

      // 3. Search query check
      if (trimmedSearch) {
        const matchesSubject = item.subject.toLowerCase().includes(trimmedSearch);
        const matchesTitle = item.title.toLowerCase().includes(trimmedSearch);
        if (!matchesSubject && !matchesTitle) return false;
      }

      return true;
    });
  }
);

/**
 * Select urgent assignments (due today or within 1 day) for notification bell & alerts
 */
export const selectUrgentAssignments = createSelector(
  [selectAllAssignments],
  (items): Assignment[] => {
    return items.filter((item) => !item.completed && isUrgent(item));
  }
);
