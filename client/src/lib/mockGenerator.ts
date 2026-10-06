import { Assignment, Priority } from '../features/assignments/types';

const SUBJECTS = [
  'Lập trình Web Nâng Cao',
  'Trí tuệ nhân tạo',
  'Cơ sở dữ liệu',
  'An toàn thông tin',
  'Phát triển ứng dụng di động',
  'Mạng máy tính',
  'Kiến trúc phần mềm',
  'Điện toán đám mây',
  'Cấu trúc dữ liệu & Giải thuật',
  'Nhập môn Lập trình Web',
];

const ACTIONS = [
  'Báo cáo bài tập lớn',
  'Thực hành Lab định kỳ',
  'Tiểu luận nghiên cứu',
  'Nộp mã nguồn dự án sprint',
  'Làm bài kiểm tra tiến độ',
  'Trắc nghiệm đánh giá kiến thức',
  'Thuyết trình nhóm chủ đề',
  'Bài tập tuần chuyên đề',
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

/**
 * High-performance generator to produce 10,000 synthetic assignments for stress testing.
 */
export function generateSampleAssignments(count: number = 10000): Assignment[] {
  const result: Assignment[] = new Array(count);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const subject = SUBJECTS[i % SUBJECTS.length];
    const action = ACTIONS[i % ACTIONS.length];
    const priority = PRIORITIES[i % PRIORITIES.length];

    // Offset in days: from -10 days (overdue) to +30 days (future)
    const dayOffset = (i % 40) - 10;
    const dueDate = new Date(now + dayOffset * dayMs).toISOString();

    const completed = i % 4 === 0; // 25% completed

    result[i] = {
      id: `stress-test-${i + 1}`,
      subject,
      title: `${action} #${i + 1} - ${subject}`,
      description: `Mô tả tự động cho bài tập thử nghiệm hiệu năng #${i + 1}. Yêu cầu hoàn thành đúng tiến độ.`,
      dueDate,
      priority,
      completed,
      createdAt: new Date(now - 5 * dayMs).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };
  }

  return result;
}
