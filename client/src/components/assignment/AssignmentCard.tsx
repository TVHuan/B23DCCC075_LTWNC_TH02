import React, { useState, useRef, useEffect, memo } from 'react';
import {
  Calendar,
  MoreVertical,
  CheckCircle2,
  RotateCcw,
  Edit3,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp,
  Pin,
  PinOff,
} from 'lucide-react';
import { Assignment, PRIORITY_CONFIG } from '../../features/assignments/types';
import { AssignmentCardCompound } from '../../patterns/AssignmentCardCompound';
import { formatDateVN } from '../../lib/utils';

export interface AssignmentCardProps {
  assignment: Assignment;
  isPinned?: boolean;
  onToggle: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = memo(({
  assignment,
  isPinned = false,
  onToggle,
  onTogglePin,
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
      className={isPinned ? 'ring-2 ring-amber-400/80 dark:ring-amber-500/70 shadow-md' : ''}
    >
      <div className="flex items-start gap-3">
        {/* Interactive Checkbox */}
        <div className="pt-0.5">
          <AssignmentCardCompound.Checkbox />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header row: Subject Tag, Pin badge, Priority Pill */}
          <AssignmentCardCompound.Header>
            <div className="flex items-center gap-2 flex-wrap">
              <AssignmentCardCompound.Subject />
              {isPinned && (
                <span
                  title="Bài tập được ghim lên đầu"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10.5px] font-bold"
                >
                  <Pin className="w-3 h-3 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                  <span>Đã ghim</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${priorityMeta.badgeClass} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`}
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
                className="flex items-center gap-1 text-[11.5px] text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium py-0.5 transition-colors"
              >
                <FileText className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                <span>{showDescription ? 'Thu gọn mô tả' : 'Xem mô tả & yêu cầu'}</span>
                {showDescription ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showDescription && (
                <div className="mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                  {assignment.description}
                </div>
              )}
            </div>
          )}

          {/* Footer Metadata: Due Date & Countdown Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/90 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-[#64748B] dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Hạn: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formatDateVN(assignment.dueDate)}</strong></span>
            </div>

            <AssignmentCardCompound.Countdown />
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-1 relative shrink-0" ref={menuRef}>
          {/* Quick Pin Toggle Button */}
          {onTogglePin && (
            <button
              type="button"
              onClick={() => onTogglePin(assignment.id)}
              aria-label={isPinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập lên đầu'}
              title={isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
              className={`p-1 rounded-md transition-colors ${
                isPinned
                  ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/60'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          )}

          {/* Quick Action buttons visible on hover */}
          <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(assignment)}
              title="Chỉnh sửa bài tập"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(assignment)}
              title="Xóa bài tập"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More options (⋮) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Tùy chọn bài tập"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-dropdown py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {onTogglePin && (
                <button
                  onClick={() => {
                    onTogglePin(assignment.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-left font-medium"
                >
                  {isPinned ? (
                    <>
                      <PinOff className="w-3.5 h-3.5 text-amber-500" />
                      <span>Bỏ ghim</span>
                    </>
                  ) : (
                    <>
                      <Pin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ghim lên đầu</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  onToggle(assignment.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-left font-medium"
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
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-left font-medium"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Chỉnh sửa</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={() => {
                  onDelete(assignment);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left font-medium"
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
});

AssignmentCard.displayName = 'AssignmentCard';
