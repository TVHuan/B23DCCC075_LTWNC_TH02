import React from 'react';
import { ClipboardList, PlusCircle, Filter } from 'lucide-react';
import { Assignment } from '../../features/assignments/types';
import { AssignmentCard } from './AssignmentCard';
import { withLoadingAndError } from '../../patterns/withLoadingAndError';
import { groupAssignmentsByTimeline } from '../../lib/deadline';

interface RawAssignmentListProps {
  assignments: Assignment[];
  totalAssignmentsCount: number;
  isGroupedView?: boolean;
  onToggle: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onOpenAddModal: () => void;
}

const RawAssignmentList: React.FC<RawAssignmentListProps> = ({
  assignments,
  totalAssignmentsCount,
  isGroupedView = true,
  onToggle,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  // Empty state: No assignments at all
  if (totalAssignmentsCount === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center my-4 shadow-card">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm shadow-brand-500/10">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-1">
          Chưa có bài tập nào
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto mb-6">
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
  if (assignments.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 text-center my-4 shadow-card">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Filter className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#0F172A] mb-1">
          Không có bài tập phù hợp
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Hãy thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  // Smart Grouped View (Things 3 / Todoist style)
  if (isGroupedView) {
    const groups = groupAssignmentsByTimeline(assignments);

    return (
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} id={`group-${group.id}`} className="space-y-2.5 scroll-mt-20">
            {/* Timeline Group Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  {group.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${group.badgeClass}`}>
                  {group.assignments.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                {group.subtitle}
              </span>
            </div>

            {/* List of cards in this timeline group */}
            <div className="space-y-2.5">
              {group.assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Flat list view
  return (
    <div className="space-y-2.5">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export const AssignmentList = withLoadingAndError(RawAssignmentList);
