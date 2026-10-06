import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { UrgentDeadlineAlert } from './components/dashboard/UrgentDeadlineAlert';
import { UrgentModal } from './components/dashboard/UrgentModal';
import { DeadlineFilters } from './components/dashboard/DeadlineFilters';
import { AssignmentList } from './components/assignment/AssignmentList';
import { AssignmentFormDialog } from './components/assignment/AssignmentFormDialog';
import { DeleteConfirmDialog } from './components/assignment/DeleteConfirmDialog';
import { useAssignments } from './hooks/useAssignments';
import { useDebounce } from './hooks/useDebounce';
import { Assignment, CreateAssignmentInput, isOverdue } from './features/assignments/types';
import { setBulkAssignments } from './features/assignments/assignmentsSlice';
import { useAppDispatch } from './store/hooks';
import { generateSampleAssignments } from './lib/mockGenerator';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Requirement B4: Code-splitting with React.lazy & Suspense for Statistics view
const StatisticsView = lazy(() => import('./components/dashboard/StatisticsView'));

export function App() {
  const dispatch = useAppDispatch();
  const {
    assignments,
    urgentAssignments,
    stats,
    loading,
    error,
    filter,
    selectedPriority,
    setFilter,
    setSelectedPriority,
    addAssignment,
    updateAssignment,
    toggleAssignment,
    deleteAssignment,
    resetSeed,
    refreshAssignments,
  } = useAssignments();

  // Local search query for immediate input feedback
  const [searchInput, setSearchInput] = useState('');
  // Requirement B2: useDebounce (300 ms) for search query to avoid heavy filtering per keystroke
  const debouncedSearch = useDebounce(searchInput, 300);

  const [formOpen, setFormOpen] = useState(false);
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [isGroupedView, setIsGroupedView] = useState(true);

  // Requirement B2: useMemo for filtering 10,000 assignments with debounced query
  const memoizedFilteredAssignments = useMemo(() => {
    const trimmed = debouncedSearch.trim().toLowerCase();

    return assignments.filter((item) => {
      // 1. Filter tab
      if (filter === 'completed' && !item.completed) return false;
      if (filter === 'pending' && (item.completed || isOverdue(item))) return false;
      if (filter === 'overdue' && (item.completed || !isOverdue(item))) return false;

      // 2. Priority check
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;

      // 3. Debounced Search query
      if (trimmed) {
        const matchesSubject = item.subject.toLowerCase().includes(trimmed);
        const matchesTitle = item.title.toLowerCase().includes(trimmed);
        if (!matchesSubject && !matchesTitle) return false;
      }

      return true;
    });
  }, [assignments, filter, selectedPriority, debouncedSearch]);

  // Requirement B1: Stress test generator - generates 10,000 sample assignments
  const handleGenerate10k = useCallback(() => {
    toast.promise(
      new Promise<number>((resolve) => {
        setTimeout(() => {
          const sample10k = generateSampleAssignments(10000);
          dispatch(setBulkAssignments(sample10k));
          resolve(sample10k.length);
        }, 50);
      }),
      {
        loading: 'Đang tạo 10.000 bài tập mẫu...',
        success: (count) => `Đã tạo ${count.toLocaleString()} bài tập! Chế độ ảo hóa (react-window) kích hoạt.`,
        error: 'Có lỗi khi tạo dữ liệu thử nghiệm.',
      }
    );
  }, [dispatch]);

  // Shortcut Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const inputEl = document.querySelector('input[placeholder*="Tìm kiếm"]') as HTMLInputElement;
        if (inputEl) {
          inputEl.focus();
          inputEl.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Requirement B1: useCallback for all child handlers passed to AssignmentCard
  const handleOpenAdd = useCallback(() => {
    setEditingAssignment(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormOpen(true);
  }, []);

  const handleDeletePrompt = useCallback((assignment: Assignment) => {
    setDeletingAssignment(assignment);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateAssignmentInput) => {
      if (editingAssignment) {
        return await updateAssignment(editingAssignment.id, data);
      } else {
        return await addAssignment(data);
      }
    },
    [editingAssignment, updateAssignment, addAssignment]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingAssignment) {
      await deleteAssignment(deletingAssignment.id);
    }
  }, [deletingAssignment, deleteAssignment]);

  const handleScrollToUrgent = useCallback(() => {
    setFilter('all');
    setSearchInput('');
    setSelectedPriority('all');
    setIsGroupedView(true);
    setTimeout(() => {
      const targetEl = document.getElementById('group-today') || document.getElementById('group-tomorrow');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('ring-2', 'ring-amber-400', 'rounded-xl', 'p-1', 'transition-all');
        setTimeout(() => {
          targetEl.classList.remove('ring-2', 'ring-amber-400', 'p-1');
        }, 2500);
      }
    }, 150);
  }, [setFilter, setSelectedPriority]);

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <DashboardLayout
      currentFilter={filter}
      onSelectFilter={setFilter}
      onOpenAddModal={handleOpenAdd}
      urgentAssignments={urgentAssignments}
      stats={stats}
      onOpenStats={() => setStatsOpen(true)}
    >
      {/* Clean Status & Progress Bar with Dark Mode */}
      <div className="mb-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-4 py-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Học kỳ 1 • Niên khóa 2026 - 2027</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">B23DCCC075</span>
        </div>

        {/* Inline Compact Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tiến độ: <strong className="text-slate-800 dark:text-slate-200 font-bold">{stats.completed.toLocaleString()}/{stats.total.toLocaleString()} bài</strong> ({completionPct}%)
          </div>
          <div className="w-28 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/80 dark:border-slate-700">
            <div
              className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Urgent Deadline Alert */}
      <UrgentDeadlineAlert
        urgentAssignments={urgentAssignments}
        onFocusUrgent={() => setUrgentModalOpen(true)}
      />

      {/* Filter Tabs, Search & Stress Test Button */}
      <DeadlineFilters
        currentFilter={filter}
        onSelectFilter={setFilter}
        stats={stats}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        isGroupedView={isGroupedView}
        onToggleGroupedView={() => setIsGroupedView(!isGroupedView)}
        onOpenAddModal={handleOpenAdd}
        onResetSeed={resetSeed}
        onGenerate10k={handleGenerate10k}
        onOpenStats={() => setStatsOpen(true)}
      />

      {/* Assignment List with react-window virtualization */}
      <AssignmentList
        loading={loading}
        error={error}
        onRetry={refreshAssignments}
        assignments={memoizedFilteredAssignments}
        totalAssignmentsCount={assignments.length}
        isGroupedView={isGroupedView && filter === 'all' && !searchInput && selectedPriority === 'all'}
        onToggle={toggleAssignment}
        onEdit={handleOpenEdit}
        onDelete={handleDeletePrompt}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Add / Edit Dialog */}
      <AssignmentFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAssignment}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingAssignment)}
        assignment={deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Dedicated Urgent Tasks Modal */}
      <UrgentModal
        isOpen={urgentModalOpen}
        onClose={() => setUrgentModalOpen(false)}
        urgentAssignments={urgentAssignments}
        onToggleComplete={(asg) => toggleAssignment(asg.id)}
        onEdit={handleOpenEdit}
        onScrollToTimeline={handleScrollToUrgent}
      />

      {/* Requirement B4: Lazy-loaded Statistics Modal with Suspense fallback */}
      {statsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Suspense
              fallback={
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Đang tải module Thống kê phân tích (Lazy Suspense)...
                  </p>
                </div>
              }
            >
              <StatisticsView
                assignments={assignments}
                onClose={() => setStatsOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
