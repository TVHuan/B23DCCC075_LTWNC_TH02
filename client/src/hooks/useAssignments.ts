import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectAllAssignments,
  selectCurrentFilter,
  selectError,
  selectFilteredAssignments,
  selectLoading,
  selectSearchQuery,
  selectSelectedPriority,
  selectStats,
  selectUrgentAssignments,
} from '../features/assignments/assignmentsSelectors';
import {
  setFilter,
  setSearchQuery,
  setSelectedPriority,
} from '../features/assignments/assignmentsSlice';
import {
  createAssignmentThunk,
  deleteAssignmentThunk,
  fetchAssignmentsThunk,
  resetSeedThunk,
  toggleAssignmentThunk,
  updateAssignmentThunk,
} from '../features/assignments/assignmentsThunks';
import type {
  AssignmentFilter,
  CreateAssignmentInput,
  Priority,
  UpdateAssignmentInput,
} from '../features/assignments/types';

/**
 * Advanced Custom Hook encapsulating all business logic, selectors,
 * API dispatchers, and rich Toast notifications with Undo functionality.
 */
export function useAssignments() {
  const dispatch = useAppDispatch();

  const assignments = useAppSelector(selectAllAssignments);
  const filteredAssignments = useAppSelector(selectFilteredAssignments);
  const urgentAssignments = useAppSelector(selectUrgentAssignments);
  const stats = useAppSelector(selectStats);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const filter = useAppSelector(selectCurrentFilter);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedPriority = useAppSelector(selectSelectedPriority);

  // Initial load
  useEffect(() => {
    dispatch(fetchAssignmentsThunk());
  }, [dispatch]);

  const handleSetFilter = useCallback(
    (newFilter: AssignmentFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch]
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleSetSelectedPriority = useCallback(
    (priority: Priority | 'all') => {
      dispatch(setSelectedPriority(priority));
    },
    [dispatch]
  );

  const addAssignment = useCallback(
    async (input: CreateAssignmentInput) => {
      try {
        const action = await dispatch(createAssignmentThunk(input));
        if (createAssignmentThunk.fulfilled.match(action)) {
          toast.success('Đã thêm bài tập thành công!', {
            description: `Môn: ${action.payload.subject} — "${action.payload.title}"`,
          });
          return action.payload;
        } else {
          toast.error(action.payload || 'Không thể thêm bài tập.');
          return null;
        }
      } catch (err) {
        toast.error('Đã xảy ra lỗi khi thêm bài tập.');
        return null;
      }
    },
    [dispatch]
  );

  const updateAssignment = useCallback(
    async (id: string, input: UpdateAssignmentInput) => {
      try {
        const action = await dispatch(updateAssignmentThunk({ id, input }));
        if (updateAssignmentThunk.fulfilled.match(action)) {
          toast.success('Đã cập nhật bài tập.', {
            description: `"${action.payload.title}" đã được lưu.`,
          });
          return action.payload;
        } else {
          toast.error(action.payload || 'Không thể cập nhật bài tập.');
          return null;
        }
      } catch (err) {
        toast.error('Lỗi khi cập nhật bài tập.');
        return null;
      }
    },
    [dispatch]
  );

  const toggleAssignment = useCallback(
    async (id: string) => {
      try {
        const action = await dispatch(toggleAssignmentThunk(id));

        if (toggleAssignmentThunk.fulfilled.match(action)) {
          const updated = action.payload;
          if (updated.completed) {
            toast.success('Hoàn thành bài tập!', {
              description: `Bạn đã hoàn thành "${updated.title}".`,
              action: {
                label: 'Hoàn tác',
                onClick: () => {
                  dispatch(toggleAssignmentThunk(id));
                },
              },
            });
          } else {
            toast.info(`Đã đánh dấu "${updated.title}" là chưa hoàn thành.`);
          }
          return updated;
        } else {
          toast.error(action.payload || 'Không thể đổi trạng thái.');
          return null;
        }
      } catch (err) {
        toast.error('Lỗi khi đổi trạng thái.');
        return null;
      }
    },
    [dispatch]
  );

  const deleteAssignment = useCallback(
    async (id: string) => {
      const target = assignments.find((a) => a.id === id);
      const targetTitle = target ? target.title : 'bài tập';

      try {
        const action = await dispatch(deleteAssignmentThunk(id));
        if (deleteAssignmentThunk.fulfilled.match(action)) {
          const toastOptions: { description: string; action?: { label: string; onClick: () => void } } = {
            description: `Đã gỡ "${targetTitle}" khỏi danh sách.`,
          };
          if (target) {
            toastOptions.action = {
              label: 'Khôi phục',
              onClick: () => {
                dispatch(
                  createAssignmentThunk({
                    subject: target.subject,
                    title: target.title,
                    dueDate: target.dueDate,
                    priority: target.priority,
                  })
                );
              },
            };
          }
          toast.success('Đã xóa bài tập.', toastOptions);
          return true;
        } else {
          toast.error(action.payload || 'Không thể xóa bài tập.');
          return false;
        }
      } catch (err) {
        toast.error('Lỗi khi xóa bài tập.');
        return false;
      }
    },
    [dispatch, assignments]
  );

  const resetSeed = useCallback(async () => {
    try {
      const action = await dispatch(resetSeedThunk());
      if (resetSeedThunk.fulfilled.match(action)) {
        toast.success('Đã khôi phục dữ liệu mẫu ban đầu!');
      } else {
        toast.error('Không thể khôi phục dữ liệu mẫu.');
      }
    } catch {
      toast.error('Lỗi khi khôi phục dữ liệu.');
    }
  }, [dispatch]);

  const refreshAssignments = useCallback(() => {
    dispatch(fetchAssignmentsThunk());
  }, [dispatch]);

  return {
    assignments,
    filteredAssignments,
    urgentAssignments,
    totalCount: stats.total,
    pendingCount: stats.pending,
    overdueCount: stats.overdue,
    completedCount: stats.completed,
    stats,
    loading,
    error,
    filter,
    searchQuery,
    selectedPriority,
    setFilter: handleSetFilter,
    setSearchQuery: handleSetSearchQuery,
    setSelectedPriority: handleSetSelectedPriority,
    addAssignment,
    updateAssignment,
    toggleAssignment,
    deleteAssignment,
    resetSeed,
    refreshAssignments,
  };
}
