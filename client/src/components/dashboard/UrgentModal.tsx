import React from 'react';
import {
  X,
  Flame,
  CheckCircle2,
  Edit2,
  ArrowDownRight,
} from 'lucide-react';
import { Assignment, PRIORITY_CONFIG } from '../../features/assignments/types';
import { getDeadlineStatus } from '../../lib/deadline';

interface UrgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentAssignments: Assignment[];
  onToggleComplete: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onScrollToTimeline: () => void;
}

export const UrgentModal: React.FC<UrgentModalProps> = ({
  isOpen,
  onClose,
  urgentAssignments,
  onToggleComplete,
  onEdit,
  onScrollToTimeline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200/80 dark:border-amber-800/80 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Flame className="w-4 h-4 text-amber-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {urgentAssignments.length} bài tập cận kề hạn nộp
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Hạn chót hôm nay hoặc ngày mai — cần ưu tiên xử lý ngay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of urgent assignments */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {urgentAssignments.map((assignment) => {
            const status = getDeadlineStatus(assignment.dueDate, assignment.completed);

            return (
              <div
                key={assignment.id}
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700 rounded-xl p-3.5 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/20 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md inline-block">
                      {assignment.subject}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {assignment.title}
                    </h4>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${PRIORITY_CONFIG[assignment.priority].badgeClass} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[assignment.priority].dotClass}`} />
                    {PRIORITY_CONFIG[assignment.priority].label}
                  </span>
                </div>

                {assignment.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-white/70 dark:bg-slate-850 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                    {assignment.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${status.badgeClass}`}>
                      {status.days === 0 ? '🔥 Hạn hôm nay' : '⏰ Còn 1 ngày (Ngày mai)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onEdit(assignment);
                        onClose();
                      }}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200/70 dark:border-slate-700 transition-colors"
                      title="Chỉnh sửa bài tập"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onToggleComplete(assignment);
                        if (urgentAssignments.length <= 1) {
                          onClose();
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Xong</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onScrollToTimeline();
            }}
            className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-semibold"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Xem trên danh sách chính</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
