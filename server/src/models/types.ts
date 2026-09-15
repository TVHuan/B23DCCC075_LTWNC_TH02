export type Priority = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  priority: Priority;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAssignmentDTO = Pick<Assignment, 'subject' | 'title' | 'dueDate' | 'priority'> & {
  description?: string;
};

export type UpdateAssignmentDTO = Partial<CreateAssignmentDTO> & {
  completed?: boolean;
};

export type AssignmentFilter = 'all' | 'pending' | 'overdue' | 'completed';

export interface StatsResponse {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

// Type Guard for Priority
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['low', 'medium', 'high'].includes(value);
}
