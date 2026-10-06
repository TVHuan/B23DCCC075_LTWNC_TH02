import { Assignment, StatsSummary, isOverdue } from '../features/assignments/types';

export { isOverdue };

/**
 * Calculates number of days left until due date relative to today's midnight.
 * Negative indicates overdue days, 0 is today, positive is future days.
 */
export function calcDaysLeft(dueDateStr: string): number {
  const targetDate = new Date(dueDateStr);
  const now = new Date();
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffMs = targetMidnight - todayMidnight;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculates summary statistics for a list of assignments.
 */
export function calcStats(assignments: Assignment[]): StatsSummary {
  let pending = 0;
  let overdue = 0;
  let completed = 0;

  for (const item of assignments) {
    if (item.completed) {
      completed += 1;
    } else if (isOverdue(item)) {
      overdue += 1;
    } else {
      pending += 1;
    }
  }

  return {
    total: assignments.length,
    pending,
    overdue,
    completed,
  };
}

export type DeadlineType = 'completed' | 'overdue' | 'urgent' | 'warning' | 'normal';

export interface DeadlineStatus {
  type: DeadlineType;
  label: string;
  days: number;
  badgeClass: string;
  iconType: 'check' | 'flame' | 'clock' | 'calendar' | 'alert';
}

/**
 * Subject theme configuration with elegant pastel backgrounds and distinct border accents.
 * Inspired by Notion tag pills.
 */
export interface SubjectTheme {
  bg: string;
  text: string;
  border: string;
  accent: string;
}

const DEFAULT_THEME: SubjectTheme = {
  bg: 'bg-indigo-50/70',
  text: 'text-indigo-700',
  border: 'border-indigo-100',
  accent: 'bg-indigo-500',
};

const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  'Trí tuệ nhân tạo': {
    bg: 'bg-purple-50/80',
    text: 'text-purple-700',
    border: 'border-purple-200/60',
    accent: 'bg-purple-500',
  },
  'Lập trình Web Nâng Cao': {
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-700',
    border: 'border-indigo-200/60',
    accent: 'bg-indigo-500',
  },
  'Cơ sở dữ liệu': {
    bg: 'bg-cyan-50/80',
    text: 'text-cyan-800',
    border: 'border-cyan-200/60',
    accent: 'bg-cyan-500',
  },
  'An toàn thông tin': {
    bg: 'bg-amber-50/80',
    text: 'text-amber-800',
    border: 'border-amber-200/60',
    accent: 'bg-amber-500',
  },
  'Phát triển ứng dụng di động': {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-800',
    border: 'border-emerald-200/60',
    accent: 'bg-emerald-500',
  },
  'Mạng máy tính': {
    bg: 'bg-blue-50/80',
    text: 'text-blue-800',
    border: 'border-blue-200/60',
    accent: 'bg-blue-500',
  },
  'Kiến trúc phần mềm': {
    bg: 'bg-violet-50/80',
    text: 'text-violet-800',
    border: 'border-violet-200/60',
    accent: 'bg-violet-500',
  },
  'Điện toán đám mây': {
    bg: 'bg-sky-50/80',
    text: 'text-sky-800',
    border: 'border-sky-200/60',
    accent: 'bg-sky-500',
  },
  'Cấu trúc dữ liệu & Giải thuật': {
    bg: 'bg-rose-50/80',
    text: 'text-rose-800',
    border: 'border-rose-200/60',
    accent: 'bg-rose-500',
  },
  'Nhập môn Lập trình Web': {
    bg: 'bg-teal-50/80',
    text: 'text-teal-800',
    border: 'border-teal-200/60',
    accent: 'bg-teal-500',
  },
};

export function getSubjectTheme(subject: string): SubjectTheme {
  return SUBJECT_THEMES[subject] || DEFAULT_THEME;
}

/**
 * Calculates deadline status and human-friendly Vietnamese label based on due date and completion state.
 * Normalized to midnight to accurately reflect remaining calendar days.
 */
export function getDeadlineStatus(dueDateStr: string, completed: boolean): DeadlineStatus {
  if (completed) {
    return {
      type: 'completed',
      label: 'Đã hoàn thành',
      days: 0,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconType: 'check',
    };
  }

  const targetDate = new Date(dueDateStr);
  const now = new Date();

  // Normalize dates to midnight to compute day boundaries
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffMs = targetMidnight - todayMidnight;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      type: 'overdue',
      label: `Quá hạn ${overdueDays} ngày`,
      days: diffDays,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      iconType: 'alert',
    };
  }

  if (diffDays === 0) {
    return {
      type: 'urgent',
      label: 'Hạn hôm nay',
      days: 0,
      badgeClass: 'bg-amber-100/90 text-amber-900 border-amber-300 font-bold ring-1 ring-amber-400/30',
      iconType: 'flame',
    };
  }

  if (diffDays === 1) {
    return {
      type: 'urgent',
      label: 'Còn 1 ngày (Ngày mai)',
      days: 1,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
      iconType: 'clock',
    };
  }

  if (diffDays <= 3) {
    return {
      type: 'warning',
      label: `Còn ${diffDays} ngày`,
      days: diffDays,
      badgeClass: 'bg-amber-50/70 text-amber-800 border-amber-200',
      iconType: 'clock',
    };
  }

  return {
    type: 'normal',
    label: `Còn ${diffDays} ngày`,
    days: diffDays,
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200/90',
    iconType: 'calendar',
  };
}

/**
 * Groups assignments by timeline categories for Things 3 / Todoist style smart view
 */
export interface TimelineGroup {
  id: string;
  title: string;
  subtitle: string;
  badgeClass: string;
  assignments: Assignment[];
}

export function groupAssignmentsByTimeline(assignments: Assignment[]): TimelineGroup[] {
  const overdue: Assignment[] = [];
  const today: Assignment[] = [];
  const tomorrow: Assignment[] = [];
  const thisWeek: Assignment[] = [];
  const upcoming: Assignment[] = [];
  const completed: Assignment[] = [];

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  for (const asg of assignments) {
    if (asg.completed) {
      completed.push(asg);
      continue;
    }

    const due = new Date(asg.dueDate);
    const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const diffDays = Math.round((dueMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      overdue.push(asg);
    } else if (diffDays === 0) {
      today.push(asg);
    } else if (diffDays === 1) {
      tomorrow.push(asg);
    } else if (diffDays <= 7) {
      thisWeek.push(asg);
    } else {
      upcoming.push(asg);
    }
  }

  const groups: TimelineGroup[] = [];

  if (overdue.length > 0) {
    groups.push({
      id: 'overdue',
      title: 'Quá hạn',
      subtitle: 'Cần giải quyết hoặc nộp bù ngay',
      badgeClass: 'bg-rose-100 text-rose-700',
      assignments: overdue,
    });
  }

  if (today.length > 0) {
    groups.push({
      id: 'today',
      title: 'Hôm nay',
      subtitle: 'Phải hoàn thành trước 23:59',
      badgeClass: 'bg-amber-100 text-amber-800',
      assignments: today,
    });
  }

  if (tomorrow.length > 0) {
    groups.push({
      id: 'tomorrow',
      title: 'Ngày mai',
      subtitle: 'Hạn chót vào ngày mai',
      badgeClass: 'bg-amber-50 text-amber-700',
      assignments: tomorrow,
    });
  }

  if (thisWeek.length > 0) {
    groups.push({
      id: 'thisWeek',
      title: 'Trong 7 ngày tới',
      subtitle: 'Bài tập tuần này',
      badgeClass: 'bg-blue-50 text-blue-700',
      assignments: thisWeek,
    });
  }

  if (upcoming.length > 0) {
    groups.push({
      id: 'upcoming',
      title: 'Sắp tới',
      subtitle: 'Các tuần tiếp theo',
      badgeClass: 'bg-slate-100 text-slate-700',
      assignments: upcoming,
    });
  }

  if (completed.length > 0) {
    groups.push({
      id: 'completed',
      title: 'Đã hoàn thành',
      subtitle: 'Các bài tập đã hoàn thành',
      badgeClass: 'bg-emerald-50 text-emerald-700',
      assignments: completed,
    });
  }

  return groups;
}
