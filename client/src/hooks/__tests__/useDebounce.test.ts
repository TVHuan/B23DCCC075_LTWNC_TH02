import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('Hook Tests: useDebounce with renderHook and Fake Timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('trả về giá trị khởi tạo ngay lần render đầu tiên', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  test('không cập nhật giá trị ngay lập tức khi props thay đổi trước 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 300 },
      }
    );

    // Thay đổi prop value sang 'second'
    rerender({ value: 'second', delay: 300 });

    // Trôi qua 150ms (chưa đủ 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Giá trị vẫn phải là 'first'
    expect(result.current).toBe('first');

    // Trôi qua thêm 150ms nữa (tổng 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Lúc này giá trị mới cập nhật thành 'second'
    expect(result.current).toBe('second');
  });

  test('chỉ cập nhật giá trị mới nhất khi giá trị thay đổi liên tục (rapid keystrokes)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'a' },
      }
    );

    rerender({ value: 'ab' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'abc' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'abcd' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Chưa đủ 300ms kể từ lần đổi cuối ('abcd')
    expect(result.current).toBe('a');

    // Chạy tiếp 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Cập nhật giá trị cuối cùng 'abcd'
    expect(result.current).toBe('abcd');
  });
});
