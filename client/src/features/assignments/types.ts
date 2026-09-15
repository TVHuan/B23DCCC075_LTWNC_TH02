// ==========================================
// Advanced TypeScript: Models, Generics, Utility Types & Type Guards
// ==========================================

export type Priority = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string format
  priority: Priority;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AssignmentFilter = 'all' | 'pending' | 'overdue' | 'completed';

export interface StatsSummary {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

// ------------------------------------------
// 1. Generic Types
// ------------------------------------------

/** Generic API Response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Generic Filter specification type */
export interface FilterCriteria<T> {
  field: keyof T;
  predicate: (value: T[keyof T]) => boolean;
}

/** Generic dictionary map */
export type EntityMap<K extends string | number, T> = Record<K, T>;

// ------------------------------------------
// 2. Utility Types (Pick, Omit, Partial, Record, Readonly)
// ------------------------------------------

/** Input payload for creating a new assignment */
export type CreateAssignmentInput = Pick<Assignment, 'subject' | 'title' | 'dueDate' | 'priority'> & {
  description?: string;
};

/** Input payload for updating an assignment */
export type UpdateAssignmentInput = Partial<CreateAssignmentInput> & {
  completed?: boolean;
};

/** Lightweight assignment representation omitting timestamps */
export type AssignmentSummary = Omit<Assignment, 'createdAt' | 'updatedAt'>;

/** Immutable assignment */
export type ReadonlyAssignment = Readonly<Assignment>;

/** Priority metadata mapping using Record utility type */
export interface PriorityMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const PRIORITY_CONFIG: Record<Priority, PriorityMeta> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  },
};

// ------------------------------------------
// 3. Custom Type Guards
// ------------------------------------------

/** Type guard verifying if an unknown value is a valid Priority */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['low', 'medium', 'high'].includes(value);
}

/** Type guard verifying if an assignment is overdue */
export function isOverdue(assignment: Assignment): boolean {
  if (assignment.completed) return false;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const due = new Date(assignment.dueDate);
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  return dueMidnight < todayMidnight;
}

/** Type guard verifying if an assignment is urgent (due today or within 1 day) */
export function isUrgent(assignment: Assignment): boolean {
  if (assignment.completed) return false;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const due = new Date(assignment.dueDate);
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const diffDays = Math.round((dueMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 1;
}

/** Type guard verifying if an unknown object conforms to Assignment */
export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== 'object' || obj === null) return false;
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.dueDate === 'string' &&
    isPriority(candidate.priority) &&
    typeof candidate.completed === 'boolean'
  );
}

// ------------------------------------------
// 4. Redux Feature State
// ------------------------------------------
export interface AssignmentState {
  items: Assignment[];
  loading: boolean;
  error: string | null;
  filter: AssignmentFilter;
  searchQuery: string;
  selectedPriority: Priority | 'all';
}
