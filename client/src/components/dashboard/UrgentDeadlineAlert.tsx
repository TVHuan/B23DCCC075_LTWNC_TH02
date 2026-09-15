import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Assignment } from '../../features/assignments/types';

interface UrgentDeadlineAlertProps {
  urgentAssignments: Assignment[];
  onFocusUrgent?: () => void;
}

export const UrgentDeadlineAlert: React.FC<UrgentDeadlineAlertProps> = ({
  urgentAssignments,
  onFocusUrgent,
}) => {
  const count = urgentAssignments.length;
  if (count === 0) return null;

  return (
    <div className="mb-5 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-amber-900 text-xs">
      <div className="flex items-center gap-2 font-medium">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Bạn có <strong className="font-bold">{count} bài tập</strong> cận kề hạn nộp hôm nay hoặc ngày mai.
        </span>
      </div>

      {onFocusUrgent && (
        <button
          onClick={onFocusUrgent}
          className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors shrink-0"
        >
          <span>Xem</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
