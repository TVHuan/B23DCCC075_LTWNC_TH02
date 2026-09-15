import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Assignment } from '../../features/assignments/types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  assignment,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  if (!isOpen || !assignment) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-desc"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 id="alert-dialog-title" className="text-base font-bold text-[#0F172A] mb-1">
              Xóa bài tập?
            </h3>
            <p id="alert-dialog-desc" className="text-xs text-[#64748B] leading-relaxed">
              Bạn có chắc chắn muốn xóa bài tập{' '}
              <span className="font-semibold text-slate-800">"{assignment.title}"</span>? Hành động này không thể hoàn tác.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-60"
          >
            {deleting ? 'Đang xóa...' : 'Xóa bài tập'}
          </button>
        </div>
      </div>
    </div>
  );
};
