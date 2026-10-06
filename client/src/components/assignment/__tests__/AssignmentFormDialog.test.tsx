import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentFormDialog } from '../AssignmentFormDialog';

describe('Component Tests: AssignmentFormDialog (RTL + userEvent)', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị thông báo validate lỗi khi để trống trường bắt buộc và submit', async () => {
    const user = userEvent.setup();
    render(
      <AssignmentFormDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={null}
      />
    );

    // Xóa trắng trường môn học để kích hoạt validate
    const subjectInput = screen.getByPlaceholderText(/Nhập môn học.../i);
    await user.clear(subjectInput);

    // Để trống tên bài tập
    const titleInput = screen.getByPlaceholderText(/Nhập tên bài tập.../i);
    await user.clear(titleInput);

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /Tạo bài tập/i });
    await user.click(submitBtn);

    // Kì vọng hiển thị các thông báo lỗi
    expect(screen.getByText(/Vui lòng chọn hoặc nhập môn học/i)).toBeInTheDocument();
    expect(screen.getByText(/Vui lòng nhập tên bài tập/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submit thành công khi điền đầy đủ dữ liệu hợp lệ', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(true);

    render(
      <AssignmentFormDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={null}
      />
    );

    const subjectInput = screen.getByPlaceholderText(/Nhập môn học.../i);
    await user.clear(subjectInput);
    await user.type(subjectInput, 'Lập trình Web Nâng Cao');

    const titleInput = screen.getByPlaceholderText(/Nhập tên bài tập.../i);
    await user.type(titleInput, 'Hoàn thiện Bài thực hành số 2');

    const submitBtn = screen.getByRole('button', { name: /Tạo bài tập/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Lập trình Web Nâng Cao',
        title: 'Hoàn thiện Bài thực hành số 2',
        priority: 'medium',
      })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });
});
