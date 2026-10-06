import React, { useMemo } from 'react';
import { ClipboardList, PlusCircle, Filter, Zap } from 'lucide-react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Assignment } from '../../features/assignments/types';
import { AssignmentCard } from './AssignmentCard';
import { withLoadingAndError } from '../../patterns/withLoadingAndError';
import { groupAssignmentsByTimeline } from '../../lib/deadline';
import { usePinStore } from '../../store/usePinStore';

interface RawAssignmentListProps {
  assignments: Assignment[];
  totalAssignmentsCount: number;
  isGroupedView?: boolean;
  onToggle: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onOpenAddModal: () => void;
}

export const RawAssignmentList: React.FC<RawAssignmentListProps> = ({
  assignments,
  totalAssignmentsCount,
  isGroupedView = true,
  onToggle,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const { isPinned, togglePin } = usePinStore();

  // Requirement A1: Pinned assignments ALWAYS appear at the top of the list
  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const aPin = isPinned(a.id);
      const bPin = isPinned(b.id);
      if (aPin && !bPin) return -1;
      if (!aPin && bPin) return 1;
      return 0;
    });
  }, [assignments, isPinned]);

  // Empty state: No assignments at all
  if (totalAssignmentsCount === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center my-4 shadow-card">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm shadow-brand-500/10">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-100 mb-1">
          Chưa có bài tập nào
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-sm mx-auto mb-6">
          Bắt đầu thêm bài tập đầu tiên để theo dõi deadline các môn học và không bao giờ bỏ lỡ hạn nộp!
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow-md hover:shadow-brand-500/20 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm bài tập mới</span>
        </button>
      </div>
    );
  }

  // Filtered empty state
  if (sortedAssignments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center my-4 shadow-card">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Filter className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-1">
          Không có bài tập phù hợp
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
          Hãy thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  // Requirement B3: Virtualization using react-window for 10,000 assignments
  // Automatically activate virtualization when items > 40 to maintain 60 FPS performance
  const shouldUseVirtualization = sortedAssignments.length > 40 || !isGroupedView;

  if (shouldUseVirtualization) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Chế độ hiển thị ảo hóa (Virtualization) — <strong>{sortedAssignments.length.toLocaleString()}</strong> bài tập</span>
          </span>
          <span className="text-[11px] text-slate-400">Tối ưu hiệu năng react-window 60 FPS</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-950/40">
          <FixedSizeList
            height={620}
            itemCount={sortedAssignments.length}
            itemSize={132}
            width="100%"
          >
            {({ index, style }: ListChildComponentProps) => {
              const item = sortedAssignments[index];
              return (
                <div style={{ ...style, paddingBottom: 10 }}>
                  <AssignmentCard
                    key={item.id}
                    assignment={item}
                    isPinned={isPinned(item.id)}
                    onToggle={onToggle}
                    onTogglePin={togglePin}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              );
            }}
          </FixedSizeList>
        </div>
      </div>
    );
  }

  // Regular Timeline Grouped View (when list <= 40 items)
  const pinnedItems = sortedAssignments.filter((a) => isPinned(a.id));
  const unpinnedItems = sortedAssignments.filter((a) => !isPinned(a.id));
  const groups = groupAssignmentsByTimeline(unpinnedItems);

  return (
    <div className="space-y-6">
      {/* Pinned section on top if any */}
      {pinnedItems.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-amber-300 dark:border-amber-700/80">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                <span>📌 Bài tập đã ghim</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {pinnedItems.length}
              </span>
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium hidden sm:block">
              Ưu tiên theo dõi hàng đầu
            </span>
          </div>

          <div className="space-y-2.5">
            {pinnedItems.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                isPinned={true}
                onToggle={onToggle}
                onTogglePin={togglePin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeline groups for remaining assignments */}
      {groups.map((group) => (
        <div key={group.id} id={`group-${group.id}`} className="space-y-2.5 scroll-mt-20">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200">
                {group.title}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${group.badgeClass}`}>
                {group.assignments.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
              {group.subtitle}
            </span>
          </div>

          <div className="space-y-2.5">
            {group.assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                isPinned={isPinned(assignment.id)}
                onToggle={onToggle}
                onTogglePin={togglePin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const AssignmentList = withLoadingAndError(RawAssignmentList);
export default AssignmentList;
