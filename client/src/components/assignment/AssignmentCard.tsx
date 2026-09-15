import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MoreVertical, CheckCircle2, RotateCcw, Edit3, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Assignment, PRIORITY_CONFIG } from '../../features/assignments/types';
import { AssignmentCardCompound } from '../../patterns/AssignmentCardCompound';
import { formatDateVN } from '../../lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const priorityMeta = PRIORITY_CONFIG[assignment.priority];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AssignmentCardCompound.Root
      assignment={assignment}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div className="flex items-start gap-3">
        {/* Interactive Checkbox */}
        <div className="pt-0.5">
          <AssignmentCardCompound.Checkbox />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header row: Subject Tag & Priority Pill */}
          <AssignmentCardCompound.Header>
            <div className="flex items-center gap-2">
              <AssignmentCardCompound.Subject />
            </div>

            <div className="flex items-center gap-1.5">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${priorityMeta.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dotClass}`} />
                {priorityMeta.label}
              </span>
            </div>
          </AssignmentCardCompound.Header>

          {/* Title */}
          <AssignmentCardCompound.Title className="mb-2" />

          {/* Expandable Description snippet if present */}
          {assignment.description && (
            <div className="mb-2.5">
              <button
                type="button"
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-1 text-[11.5px] text-slate-500 hover:text-brand-600 font-medium py-0.5 transition-colors"
              >
                <FileText className="w-3 h-3 text-brand-600" />
                <span>{showDescription ? 'Thu gọn mô tả' : 'Xem mô tả & yêu cầu'}</span>
                {showDescription ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showDescription && (
                <div className="mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                  {assignment.description}
                </div>
              )}
            </div>
          )}

          {/* Footer Metadata: Due Date & Countdown Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/90 text-xs">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Hạn: <strong className="font-semibold text-slate-700">{formatDateVN(assignment.dueDate)}</strong></span>
            </div>

            <AssignmentCardCompound.Countdown />
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-1 relative shrink-0" ref={menuRef}>
          {/* Quick Action buttons visible on hover */}
          <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(assignment)}
              title="Chỉnh sửa bài tập"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(assignment)}
              title="Xóa bài tập"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More options (⋮) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Tùy chọn bài tập"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200/90 rounded-xl shadow-dropdown py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  onToggle(assignment.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left font-medium"
              >
                {assignment.completed ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Chưa hoàn thành</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Hoàn thành</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onEdit(assignment);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left font-medium"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Chỉnh sửa</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  onDelete(assignment);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AssignmentCardCompound.Root>
  );
};
