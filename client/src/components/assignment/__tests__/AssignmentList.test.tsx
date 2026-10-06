import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentList } from '../AssignmentList';
import { Assignment } from '../../../features/assignments/types';

describe('Asynchronous & State Tests: AssignmentList with Mock API States', () => {
  const mockAssignments: Assignment[] = [
    {
      id: 'asg-async-1',
      subject: 'Lập trình Web Nâng Cao',
      title: 'Kiểm thử bất đồng bộ với Jest',
      dueDate: '2026-10-20T23:59:59.000Z',
      priority: 'high',
      completed: false,
    },
  ];

  const defaultProps = {
    assignments: mockAssignments,
    totalAssignmentsCount: 1,
    isGroupedView: false,
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onOpenAddModal: jest.fn(),
    onRetry: jest.fn(),
  };

  test('trạng thái đang tải (loading: true): hiển thị skeleton loading container', () => {
    render(<AssignmentList {...defaultProps} loading={true} error={null} />);

    const loadingContainer = screen.getByRole('generic', { busy: true });
    expect(loadingContainer).toBeInTheDocument();
    // Khi đang loading, danh sách bài tập chưa hiển thị
    expect(screen.queryByText('Kiểm thử bất đồng bộ với Jest')).not.toBeInTheDocument();
  });

  test('trạng thái thành công (loading: false, error: null): hiển thị danh sách bài tập', () => {
    render(<AssignmentList {...defaultProps} loading={false} error={null} />);

    expect(screen.getByText('Kiểm thử bất đồng bộ với Jest')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web Nâng Cao')).toBeInTheDocument();
  });

  test('trạng thái lỗi (error: string): hiển thị thông báo lỗi và nút Thử lại, click gọi onRetry', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Không thể kết nối đến máy chủ API';

    render(<AssignmentList {...defaultProps} loading={false} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(/Không thể tải dữ liệu từ máy chủ/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Thử lại/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });
});
