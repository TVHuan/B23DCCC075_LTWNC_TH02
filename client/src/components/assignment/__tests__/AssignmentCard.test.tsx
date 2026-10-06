import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentCard } from '../AssignmentCard';
import { Assignment } from '../../../features/assignments/types';

describe('Component Tests: AssignmentCard (RTL + userEvent)', () => {
  const mockAssignment: Assignment = {
    id: 'card-1',
    subject: 'Lập trình Web Nâng Cao',
    title: 'Xây dựng Zustand Store & RTL Tests',
    description: 'Thực hiện đầy đủ các yêu cầu của Bài thực hành 2.',
    dueDate: '2026-10-15T23:59:59.000Z',
    priority: 'high',
    completed: false,
  };

  const defaultProps = {
    assignment: mockAssignment,
    isPinned: false,
    onToggle: jest.fn(),
    onTogglePin: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị chính xác thông tin tiêu đề, môn học và mức độ ưu tiên', () => {
    render(<AssignmentCard {...defaultProps} />);

    expect(screen.getByText('Xây dựng Zustand Store & RTL Tests')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web Nâng Cao')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('tương tác click nút Checkbox gọi hàm onToggle với ID bài tập', async () => {
    const user = userEvent.setup();
    render(<AssignmentCard {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /Đánh dấu hoàn thành: Xây dựng Zustand Store & RTL Tests/i,
    });
    await user.click(checkbox);

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggle).toHaveBeenCalledWith('card-1');
  });

  test('tương tác click nút Ghim (Pin) gọi hàm onTogglePin', async () => {
    const user = userEvent.setup();
    render(<AssignmentCard {...defaultProps} isPinned={false} />);

    const pinButton = screen.getByRole('button', { name: /Ghim bài tập lên đầu/i });
    await user.click(pinButton);

    expect(defaultProps.onTogglePin).toHaveBeenCalledTimes(1);
    expect(defaultProps.onTogglePin).toHaveBeenCalledWith('card-1');
  });

  test('hiển thị huy hiệu "Đã ghim" khi isPinned là true', () => {
    render(<AssignmentCard {...defaultProps} isPinned={true} />);

    expect(screen.getByText('Đã ghim')).toBeInTheDocument();
  });
});
