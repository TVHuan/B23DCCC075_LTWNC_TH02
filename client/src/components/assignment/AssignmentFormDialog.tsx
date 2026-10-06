import React, { useState, useEffect } from 'react';
import { X, AlertCircle, PlusCircle, Check } from 'lucide-react';
import { Assignment, CreateAssignmentInput, Priority } from '../../features/assignments/types';
import { WordEditor } from '../ui/WordEditor';
import { getSubjectTheme } from '../../lib/deadline';

interface AssignmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentInput) => Promise<any>;
  initialData?: Assignment | null;
}

const COMMON_SUBJECTS = [
  'Lập trình Web Nâng Cao',
  'Cơ sở dữ liệu',
  'Trí tuệ nhân tạo',
  'Phát triển ứng dụng di động',
  'An toàn thông tin',
  'Mạng máy tính',
  'Kiến trúc phần mềm',
  'Điện toán đám mây',
];

export const AssignmentFormDialog: React.FC<AssignmentFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      const datePart = initialData.dueDate.split('T')[0];
      setDueDate(datePart);
      setPriority(initialData.priority);
    } else {
      setSubject(COMMON_SUBJECTS[0]);
      setTitle('');
      setDescription('');
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDueDate(d.toISOString().split('T')[0]);
      setPriority('medium');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const setQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!subject.trim()) newErrors.subject = 'Vui lòng chọn hoặc nhập môn học';
    if (!title.trim()) newErrors.title = 'Vui lòng nhập tên bài tập';
    if (!dueDate) newErrors.dueDate = 'Vui lòng chọn hạn nộp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const isoDueDate = new Date(`${dueDate}T23:59:59Z`).toISOString();
      const success = await onSubmit({
        subject: subject.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: isoDueDate,
        priority,
      });

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-modal border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Simple & Clean */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-base font-bold text-[#0F172A] dark:text-slate-100">
              {isEdit ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with scroll */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Môn học */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Môn học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nhập môn học..."
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 transition-colors ${
                errors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
              }`}
            />

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 scrollbar-none">
              {COMMON_SUBJECTS.slice(0, 5).map((s) => {
                const theme = getSubjectTheme(s);
                const isSelected = subject === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border shrink-0 transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600'
                        : `${theme.bg} ${theme.text} ${theme.border} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:opacity-80`
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {errors.subject && (
              <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Tên bài tập */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tên bài tập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bài tập..."
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 transition-colors ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Mô tả dạng Word (Word-like Rich Textarea) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Mô tả & Yêu cầu chi tiết
            </label>
            <WordEditor
              value={description}
              onChange={setDescription}
              placeholder="Soạn thảo yêu cầu bài tập, ghi chú, tiêu chí nộp bài..."
            />
          </div>

          {/* Hạn nộp & Mức ưu tiên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Hạn nộp <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    className="text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    Hôm nay
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    className="text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    Ngày mai
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(7)}
                    className="text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    +7 ngày
                  </button>
                </div>
              </div>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 transition-colors ${
                  errors.dueDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.dueDate && (
                <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Độ ưu tiên
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    priority === 'low'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  Thấp
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    priority === 'medium'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100/60'
                  }`}
                >
                  Vừa
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    priority === 'high'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-rose-50/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100/60'
                  }`}
                >
                  Cao
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo bài tập'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
