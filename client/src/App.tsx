import { useState, useEffect } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { UrgentDeadlineAlert } from './components/dashboard/UrgentDeadlineAlert';
import { UrgentModal } from './components/dashboard/UrgentModal';
import { DeadlineFilters } from './components/dashboard/DeadlineFilters';
import { AssignmentList } from './components/assignment/AssignmentList';
import { AssignmentFormDialog } from './components/assignment/AssignmentFormDialog';
import { DeleteConfirmDialog } from './components/assignment/DeleteConfirmDialog';
import { useAssignments } from './hooks/useAssignments';
import { Assignment, CreateAssignmentInput } from './features/assignments/types';
import { Calendar } from 'lucide-react';

export function App() {
  const {
    assignments,
    filteredAssignments,
    urgentAssignments,
    stats,
    loading,
    error,
    filter,
    searchQuery,
    selectedPriority,
    setFilter,
    setSearchQuery,
    setSelectedPriority,
    addAssignment,
    updateAssignment,
    toggleAssignment,
    deleteAssignment,
    resetSeed,
    refreshAssignments,
  } = useAssignments();

  const [formOpen, setFormOpen] = useState(false);
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [isGroupedView, setIsGroupedView] = useState(true);

  // Shortcut Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateAssignmentInput) => {
    if (editingAssignment) {
      return await updateAssignment(editingAssignment.id, data);
    } else {
      return await addAssignment(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingAssignment) {
      await deleteAssignment(deletingAssignment.id);
    }
  };

  const handleScrollToUrgent = () => {
    setFilter('all');
    setSearchQuery('');
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
  };

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <DashboardLayout
      currentFilter={filter}
      onSelectFilter={setFilter}
      onOpenAddModal={handleOpenAdd}
      urgentAssignments={urgentAssignments}
      stats={stats}
    >
      {/* Clean Status & Progress Bar (No long text/titles) */}
      <div className="mb-5 bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>Thứ Ba, 15/09/2026</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">Học kỳ 1</span>
        </div>

        {/* Inline Compact Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Tiến độ: <strong className="text-slate-800 font-bold">{stats.completed}/{stats.total} bài</strong> ({completionPct}%)
          </div>
          <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Urgent Deadline Alert (1-line only when urgent tasks exist) */}
      <UrgentDeadlineAlert
        urgentAssignments={urgentAssignments}
        onFocusUrgent={() => setUrgentModalOpen(true)}
      />

      {/* Filter Tabs, Search & View Switcher */}
      <DeadlineFilters
        currentFilter={filter}
        onSelectFilter={setFilter}
        stats={stats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        isGroupedView={isGroupedView}
        onToggleGroupedView={() => setIsGroupedView(!isGroupedView)}
        onOpenAddModal={handleOpenAdd}
        onResetSeed={resetSeed}
      />

      {/* Assignment List */}
      <AssignmentList
        loading={loading}
        error={error}
        onRetry={refreshAssignments}
        assignments={filteredAssignments}
        totalAssignmentsCount={assignments.length}
        isGroupedView={isGroupedView && filter === 'all' && !searchQuery && selectedPriority === 'all'}
        onToggle={toggleAssignment}
        onEdit={handleOpenEdit}
        onDelete={setDeletingAssignment}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Add / Edit Dialog with Word-like Editor */}
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
    </DashboardLayout>
  );
}

export default App;
