import {
  fetchAssignmentsThunk,
  createAssignmentThunk,
  updateAssignmentThunk,
  toggleAssignmentThunk,
  deleteAssignmentThunk,
  resetSeedThunk,
} from '../assignmentsThunks';
import { assignmentApi } from '../../../services/api';
import { Assignment } from '../types';

jest.mock('../../../services/api');

describe('Async Thunks Tests: assignmentsThunks (fulfilled & rejected states)', () => {
  const sample: Assignment = {
    id: 'thunk-1',
    subject: 'Web Nâng Cao',
    title: 'Thực hành Redux Thunks',
    dueDate: '2026-10-30T00:00:00Z',
    priority: 'medium',
    completed: false,
  };

  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchAssignmentsThunk thành công và thất bại', async () => {
    (assignmentApi.fetchAssignments as jest.Mock).mockResolvedValueOnce([sample]);
    const thunk = fetchAssignmentsThunk();
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe('assignments/fetchAssignments/fulfilled');
    expect(result.payload).toEqual([sample]);

    // Thất bại
    (assignmentApi.fetchAssignments as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    const failThunk = fetchAssignmentsThunk();
    const failResult = await failThunk(dispatch, getState, undefined);
    expect(failResult.type).toBe('assignments/fetchAssignments/rejected');
    expect(failResult.payload).toBe('Network Error');
  });

  test('createAssignmentThunk thành công và thất bại', async () => {
    (assignmentApi.createAssignment as jest.Mock).mockResolvedValueOnce(sample);
    const thunk = createAssignmentThunk({
      subject: sample.subject,
      title: sample.title,
      dueDate: sample.dueDate,
      priority: sample.priority,
    });
    const result = await thunk(dispatch, getState, undefined);
    expect(result.type).toBe('assignments/createAssignment/fulfilled');
    expect(result.payload).toEqual(sample);

    (assignmentApi.createAssignment as jest.Mock).mockRejectedValueOnce(new Error('Create Failed'));
    const failThunk = createAssignmentThunk({
      subject: sample.subject,
      title: sample.title,
      dueDate: sample.dueDate,
      priority: sample.priority,
    });
    const failResult = await failThunk(dispatch, getState, undefined);
    expect(failResult.type).toBe('assignments/createAssignment/rejected');
  });

  test('updateAssignmentThunk thành công và thất bại', async () => {
    (assignmentApi.updateAssignment as jest.Mock).mockResolvedValueOnce(sample);
    const thunk = updateAssignmentThunk({ id: 'thunk-1', input: { title: 'Updated' } });
    const result = await thunk(dispatch, getState, undefined);
    expect(result.type).toBe('assignments/updateAssignment/fulfilled');

    (assignmentApi.updateAssignment as jest.Mock).mockRejectedValueOnce(new Error('Update Failed'));
    const failThunk = updateAssignmentThunk({ id: 'thunk-1', input: { title: 'Updated' } });
    const failResult = await failThunk(dispatch, getState, undefined);
    expect(failResult.type).toBe('assignments/updateAssignment/rejected');
  });

  test('toggleAssignmentThunk và deleteAssignmentThunk thành công và thất bại', async () => {
    (assignmentApi.toggleAssignment as jest.Mock).mockResolvedValueOnce({ ...sample, completed: true });
    const toggleThunk = toggleAssignmentThunk('thunk-1');
    const toggleResult = await toggleThunk(dispatch, getState, undefined);
    expect(toggleResult.type).toBe('assignments/toggleAssignment/fulfilled');

    (assignmentApi.deleteAssignment as jest.Mock).mockResolvedValueOnce('thunk-1');
    const delThunk = deleteAssignmentThunk('thunk-1');
    const delResult = await delThunk(dispatch, getState, undefined);
    expect(delResult.type).toBe('assignments/deleteAssignment/fulfilled');
  });

  test('resetSeedThunk thành công và thất bại', async () => {
    (assignmentApi.resetSeed as jest.Mock).mockResolvedValueOnce([sample]);
    const thunk = resetSeedThunk();
    const result = await thunk(dispatch, getState, undefined);
    expect(result.type).toBe('assignments/resetSeed/fulfilled');

    (assignmentApi.resetSeed as jest.Mock).mockRejectedValueOnce(new Error('Reset Failed'));
    const failThunk = resetSeedThunk();
    const failResult = await failThunk(dispatch, getState, undefined);
    expect(failResult.type).toBe('assignments/resetSeed/rejected');
  });
});
