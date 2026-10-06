import assignmentsReducer, {
  setFilter,
  setSearchQuery,
  setSelectedPriority,
  clearError,
  setBulkAssignments,
} from '../assignmentsSlice';
import {
  createAssignmentThunk,
  deleteAssignmentThunk,
  fetchAssignmentsThunk,
  resetSeedThunk,
  toggleAssignmentThunk,
  updateAssignmentThunk,
} from '../assignmentsThunks';
import { Assignment, AssignmentState } from '../types';

describe('Unit Tests: assignmentsSlice Reducer (kể cả trường hợp biên)', () => {
  const initialState: AssignmentState = {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
    searchQuery: '',
    selectedPriority: 'all',
  };

  const sampleAssignment: Assignment = {
    id: 'asg-1',
    subject: 'Lập trình Web Nâng Cao',
    title: 'Bài thực hành số 2',
    dueDate: new Date().toISOString(),
    priority: 'high',
    completed: false,
  };

  test('xử lý action setFilter chính xác', () => {
    const nextState = assignmentsReducer(initialState, setFilter('overdue'));
    expect(nextState.filter).toBe('overdue');
  });

  test('xử lý action setSearchQuery và setSelectedPriority', () => {
    let state = assignmentsReducer(initialState, setSearchQuery('React'));
    expect(state.searchQuery).toBe('React');

    state = assignmentsReducer(state, setSelectedPriority('high'));
    expect(state.selectedPriority).toBe('high');
  });

  test('xử lý action clearError khôi phục error về null', () => {
    const errorState: AssignmentState = { ...initialState, error: 'Lỗi mạng' };
    const state = assignmentsReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });

  test('xử lý action setBulkAssignments nạp dữ liệu số lượng lớn (stress test)', () => {
    const bulk = [sampleAssignment, { ...sampleAssignment, id: 'asg-2' }];
    const state = assignmentsReducer(initialState, setBulkAssignments(bulk));
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('asg-1');
  });

  describe('extraReducers async actions', () => {
    test('fetchAssignmentsThunk: pending, fulfilled, rejected (trường hợp lỗi mạng)', () => {
      // Pending
      let state = assignmentsReducer(initialState, { type: fetchAssignmentsThunk.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Fulfilled
      state = assignmentsReducer(state, {
        type: fetchAssignmentsThunk.fulfilled.type,
        payload: [sampleAssignment],
      });
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([sampleAssignment]);

      // Rejected
      state = assignmentsReducer(state, {
        type: fetchAssignmentsThunk.rejected.type,
        payload: 'Không thể kết nối máy chủ',
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Không thể kết nối máy chủ');
    });

    test('createAssignmentThunk.fulfilled thêm bài tập mới vào đầu danh sách (unshift)', () => {
      const existingState: AssignmentState = {
        ...initialState,
        items: [sampleAssignment],
      };
      const newAsg: Assignment = {
        ...sampleAssignment,
        id: 'asg-new',
        title: 'Bài tập mới',
      };

      const state = assignmentsReducer(existingState, {
        type: createAssignmentThunk.fulfilled.type,
        payload: newAsg,
      });

      expect(state.items).toHaveLength(2);
      expect(state.items[0].id).toBe('asg-new');
    });

    test('updateAssignmentThunk.fulfilled cập nhật bài tập đúng ID và giữ nguyên nếu không tìm thấy (trường hợp biên)', () => {
      const existingState: AssignmentState = {
        ...initialState,
        items: [sampleAssignment],
      };
      const updatedAsg: Assignment = {
        ...sampleAssignment,
        title: 'Tiêu đề sau sửa',
      };

      // Cập nhật thành công
      let state = assignmentsReducer(existingState, {
        type: updateAssignmentThunk.fulfilled.type,
        payload: updatedAsg,
      });
      expect(state.items[0].title).toBe('Tiêu đề sau sửa');

      // Trường hợp biên: ID không tồn tại trong danh sách
      const nonExistent: Assignment = {
        ...sampleAssignment,
        id: 'not-found-id',
        title: 'Không tồn tại',
      };
      state = assignmentsReducer(state, {
        type: updateAssignmentThunk.fulfilled.type,
        payload: nonExistent,
      });
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('asg-1');
    });

    test('toggleAssignmentThunk.fulfilled đảo trạng thái hoàn thành', () => {
      const existingState: AssignmentState = {
        ...initialState,
        items: [sampleAssignment],
      };
      const toggledAsg: Assignment = {
        ...sampleAssignment,
        completed: true,
      };

      const state = assignmentsReducer(existingState, {
        type: toggleAssignmentThunk.fulfilled.type,
        payload: toggledAsg,
      });
      expect(state.items[0].completed).toBe(true);
    });

    test('deleteAssignmentThunk.fulfilled gỡ bỏ bài tập theo ID', () => {
      const existingState: AssignmentState = {
        ...initialState,
        items: [sampleAssignment],
      };

      const state = assignmentsReducer(existingState, {
        type: deleteAssignmentThunk.fulfilled.type,
        payload: 'asg-1',
      });
      expect(state.items).toHaveLength(0);
    });

    test('resetSeedThunk.fulfilled thay thế toàn bộ danh sách bằng dữ liệu khởi tạo', () => {
      const existingState: AssignmentState = {
        ...initialState,
        items: [],
      };
      const seedData = [sampleAssignment];

      const state = assignmentsReducer(existingState, {
        type: resetSeedThunk.fulfilled.type,
        payload: seedData,
      });
      expect(state.items).toEqual(seedData);
    });
  });
});
