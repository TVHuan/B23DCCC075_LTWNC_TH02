import { createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentApi } from '../../services/api';
import { Assignment, AssignmentFilter, CreateAssignmentInput, UpdateAssignmentInput } from './types';

export const fetchAssignmentsThunk = createAsyncThunk<
  Assignment[],
  { filter?: AssignmentFilter; search?: string } | undefined,
  { rejectValue: string }
>('assignments/fetchAssignments', async (params, { rejectWithValue }) => {
  try {
    return await assignmentApi.fetchAssignments(params?.filter, params?.search);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi tải danh sách bài tập');
  }
});

export const createAssignmentThunk = createAsyncThunk<
  Assignment,
  CreateAssignmentInput,
  { rejectValue: string }
>('assignments/createAssignment', async (input, { rejectWithValue }) => {
  try {
    return await assignmentApi.createAssignment(input);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi tạo bài tập mới');
  }
});

export const updateAssignmentThunk = createAsyncThunk<
  Assignment,
  { id: string; input: UpdateAssignmentInput },
  { rejectValue: string }
>('assignments/updateAssignment', async ({ id, input }, { rejectWithValue }) => {
  try {
    return await assignmentApi.updateAssignment(id, input);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi cập nhật bài tập');
  }
});

export const toggleAssignmentThunk = createAsyncThunk<
  Assignment,
  string,
  { rejectValue: string }
>('assignments/toggleAssignment', async (id, { rejectWithValue }) => {
  try {
    return await assignmentApi.toggleAssignment(id);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi thay đổi trạng thái');
  }
});

export const deleteAssignmentThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('assignments/deleteAssignment', async (id, { rejectWithValue }) => {
  try {
    return await assignmentApi.deleteAssignment(id);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi xóa bài tập');
  }
});

export const resetSeedThunk = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/resetSeed', async (_, { rejectWithValue }) => {
  try {
    return await assignmentApi.resetSeed();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi khi khôi phục dữ liệu mẫu');
  }
});
