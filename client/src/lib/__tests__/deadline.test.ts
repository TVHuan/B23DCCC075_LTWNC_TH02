import { calcDaysLeft, calcStats, isOverdue } from '../deadline';
import { Assignment } from '../../features/assignments/types';

describe('Unit Tests: deadline calculation utilities', () => {
  const getOffsetDateString = (offsetDays: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString();
  };

  describe('isOverdue', () => {
    test('trả về true khi bài tập quá hạn (hôm qua) và chưa hoàn thành', () => {
      const assignment: Assignment = {
        id: '1',
        subject: 'Lập trình Web Nâng Cao',
        title: 'Báo cáo Lab 1',
        dueDate: getOffsetDateString(-2),
        priority: 'high',
        completed: false,
      };
      expect(isOverdue(assignment)).toBe(true);
    });

    test('trả về false khi bài tập đến hạn hôm nay hoặc tương lai', () => {
      const todayAssignment: Assignment = {
        id: '2',
        subject: 'Cơ sở dữ liệu',
        title: 'Nộp bài tập lớn',
        dueDate: getOffsetDateString(0),
        priority: 'medium',
        completed: false,
      };
      const futureAssignment: Assignment = {
        id: '3',
        subject: 'Trí tuệ nhân tạo',
        title: 'Bài tập tuần sau',
        dueDate: getOffsetDateString(5),
        priority: 'low',
        completed: false,
      };
      expect(isOverdue(todayAssignment)).toBe(false);
      expect(isOverdue(futureAssignment)).toBe(false);
    });

    test('trả về false khi bài tập đã hoàn thành dù ngày hết hạn đã qua', () => {
      const completedOverdue: Assignment = {
        id: '4',
        subject: 'An toàn thông tin',
        title: 'Thực hành bảo mật',
        dueDate: getOffsetDateString(-5),
        priority: 'high',
        completed: true,
      };
      expect(isOverdue(completedOverdue)).toBe(false);
    });
  });

  describe('calcDaysLeft', () => {
    test('tính đúng số ngày âm cho ngày đã quá hạn', () => {
      const yesterday = getOffsetDateString(-1);
      expect(calcDaysLeft(yesterday)).toBe(-1);
    });

    test('tính đúng 0 ngày cho ngày hôm nay', () => {
      const today = getOffsetDateString(0);
      expect(calcDaysLeft(today)).toBe(0);
    });

    test('tính đúng số ngày dương cho ngày trong tương lai', () => {
      const nextWeek = getOffsetDateString(7);
      expect(calcDaysLeft(nextWeek)).toBe(7);
    });
  });

  describe('calcStats', () => {
    test('xử lý chính xác trường hợp danh sách rỗng (trường hợp biên)', () => {
      const stats = calcStats([]);
      expect(stats).toEqual({
        total: 0,
        pending: 0,
        overdue: 0,
        completed: 0,
      });
    });

    test('tính toán chính xác các chỉ số tổng hợp với danh sách hỗn hợp', () => {
      const mockList: Assignment[] = [
        {
          id: '1',
          subject: 'Web',
          title: 'Bài 1',
          dueDate: getOffsetDateString(-2),
          priority: 'high',
          completed: false, // overdue
        },
        {
          id: '2',
          subject: 'CSDL',
          title: 'Bài 2',
          dueDate: getOffsetDateString(3),
          priority: 'medium',
          completed: false, // pending
        },
        {
          id: '3',
          subject: 'AI',
          title: 'Bài 3',
          dueDate: getOffsetDateString(-1),
          priority: 'low',
          completed: true, // completed
        },
      ];

      const stats = calcStats(mockList);
      expect(stats.total).toBe(3);
      expect(stats.overdue).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.completed).toBe(1);
    });
  });
});
