import { usePinStore } from '../usePinStore';

describe('Zustand Store Tests: usePinStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand store state
    usePinStore.setState({ pinnedIds: [] });
  });

  test('togglePin thêm ID vào pinnedIds khi chưa tồn tại và isPinned trả về true', () => {
    const { togglePin, isPinned } = usePinStore.getState();

    expect(isPinned('task-1')).toBe(false);

    togglePin('task-1');
    expect(usePinStore.getState().pinnedIds).toContain('task-1');
    expect(usePinStore.getState().isPinned('task-1')).toBe(true);
  });

  test('togglePin gỡ ID khỏi pinnedIds khi đã tồn tại và lưu vào localStorage', () => {
    const { togglePin } = usePinStore.getState();

    // Ghim bài tập
    togglePin('task-1');
    expect(usePinStore.getState().isPinned('task-1')).toBe(true);

    // Bỏ ghim bài tập
    togglePin('task-1');
    expect(usePinStore.getState().isPinned('task-1')).toBe(false);
    expect(usePinStore.getState().pinnedIds).not.toContain('task-1');
  });
});
