import {
  selectAllAssignments,
  selectCurrentFilter,
  selectError,
  selectFilteredAssignments,
  selectLoading,
  selectSearchQuery,
  selectSelectedPriority,
  selectStats,
  selectUrgentAssignments,
} from '../assignmentsSelectors';
import { RootState } from '../../../store';
import { Assignment } from '../types';

describe('Unit Tests: assignmentsSelectors', () => {
  const getOffsetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const sampleItems: Assignment[] = [
    {
      id: '1',
      subject: 'Lập trình Web Nâng Cao',
      title: 'Xây dựng Zustand store',
      dueDate: getOffsetDate(0), // urgent today
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      subject: 'Cơ sở dữ liệu',
      title: 'Tối ưu hóa query',
      dueDate: getOffsetDate(-3), // overdue
      priority: 'medium',
      completed: false,
    },
    {
      id: '3',
      subject: 'Trí tuệ nhân tạo',
      title: 'Huấn luyện mạng nơ-ron',
      dueDate: getOffsetDate(5), // pending
      priority: 'low',
      completed: true,
    },
  ];

  const mockState: RootState = {
    assignments: {
      items: sampleItems,
      loading: false,
      error: null,
      filter: 'all',
      searchQuery: '',
      selectedPriority: 'all',
    },
  };

  test('các basic selectors trả về đúng giá trị slice state', () => {
    expect(selectAllAssignments(mockState)).toEqual(sampleItems);
    expect(selectLoading(mockState)).toBe(false);
    expect(selectError(mockState)).toBeNull();
    expect(selectCurrentFilter(mockState)).toBe('all');
    expect(selectSearchQuery(mockState)).toBe('');
    expect(selectSelectedPriority(mockState)).toBe('all');
  });

  test('selectStats tính toán tổng, hoàn thành, quá hạn, chưa hoàn thành', () => {
    const stats = selectStats(mockState);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.overdue).toBe(1);
    expect(stats.pending).toBe(1);
  });

  test('selectFilteredAssignments lọc chính xác theo filter tab', () => {
    // Filter: completed
    let state: RootState = {
      ...mockState,
      assignments: { ...mockState.assignments, filter: 'completed' },
    };
    expect(selectFilteredAssignments(state)).toHaveLength(1);
    expect(selectFilteredAssignments(state)[0].id).toBe('3');

    // Filter: overdue
    state = {
      ...mockState,
      assignments: { ...mockState.assignments, filter: 'overdue' },
    };
    expect(selectFilteredAssignments(state)).toHaveLength(1);
    expect(selectFilteredAssignments(state)[0].id).toBe('2');

    // Filter: pending
    state = {
      ...mockState,
      assignments: { ...mockState.assignments, filter: 'pending' },
    };
    expect(selectFilteredAssignments(state)).toHaveLength(1);
    expect(selectFilteredAssignments(state)[0].id).toBe('1');
  });

  test('selectFilteredAssignments lọc chính xác theo priority và search query', () => {
    // Priority: high
    let state: RootState = {
      ...mockState,
      assignments: { ...mockState.assignments, selectedPriority: 'high' },
    };
    expect(selectFilteredAssignments(state)).toHaveLength(1);
    expect(selectFilteredAssignments(state)[0].priority).toBe('high');

    // Search query: theo môn học hoặc tiêu đề
    state = {
      ...mockState,
      assignments: { ...mockState.assignments, searchQuery: 'query' },
    };
    const results = selectFilteredAssignments(state);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Tối ưu hóa query');
  });

  test('selectUrgentAssignments lọc các bài tập cận kề hạn nộp (hôm nay hoặc ngày mai)', () => {
    const urgent = selectUrgentAssignments(mockState);
    expect(urgent.some((a) => a.id === '1')).toBe(true);
  });
});
