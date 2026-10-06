import { isAssignment, isOverdue, isPriority, isUrgent, Assignment } from '../types';

describe('Unit Tests: types.ts type guards', () => {
  const getOffsetDate = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  test('isPriority kiểm tra chính xác giá trị Priority hợp lệ và không hợp lệ', () => {
    expect(isPriority('low')).toBe(true);
    expect(isPriority('medium')).toBe(true);
    expect(isPriority('high')).toBe(true);
    expect(isPriority('urgent')).toBe(false);
    expect(isPriority(123)).toBe(false);
    expect(isPriority(null)).toBe(false);
  });

  test('isAssignment kiểm tra cấu trúc đối tượng Assignment', () => {
    const valid: Assignment = {
      id: 'test-1',
      subject: 'Mạng',
      title: 'Lab',
      dueDate: new Date().toISOString(),
      priority: 'low',
      completed: false,
    };
    expect(isAssignment(valid)).toBe(true);
    expect(isAssignment(null)).toBe(false);
    expect(isAssignment('string')).toBe(false);
    expect(isAssignment({ id: '1' })).toBe(false);
  });

  test('isUrgent kiểm tra hạn chót hôm nay hoặc ngày mai (0-1 ngày)', () => {
    const urgentToday: Assignment = {
      id: 'urg-1',
      subject: 'Web',
      title: 'Gấp',
      dueDate: getOffsetDate(0),
      priority: 'high',
      completed: false,
    };
    const urgentTomorrow: Assignment = {
      id: 'urg-2',
      subject: 'Web',
      title: 'Gấp mai',
      dueDate: getOffsetDate(1),
      priority: 'high',
      completed: false,
    };
    const future: Assignment = {
      id: 'urg-3',
      subject: 'Web',
      title: 'Xa',
      dueDate: getOffsetDate(5),
      priority: 'high',
      completed: false,
    };
    const completed: Assignment = {
      ...urgentToday,
      completed: true,
    };

    expect(isUrgent(urgentToday)).toBe(true);
    expect(isUrgent(urgentTomorrow)).toBe(true);
    expect(isUrgent(future)).toBe(false);
    expect(isUrgent(completed)).toBe(false);

    // Kiểm tra isOverdue từ types.ts
    const overdueAsg: Assignment = {
      ...urgentToday,
      dueDate: getOffsetDate(-3),
    };
    expect(isOverdue(overdueAsg)).toBe(true);
    expect(isOverdue(future)).toBe(false);
  });
});
