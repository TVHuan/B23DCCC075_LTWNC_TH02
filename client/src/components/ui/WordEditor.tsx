import React, { useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Heading2,
  FileText,
} from 'lucide-react';

interface WordEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập chi tiết yêu cầu bài tập, tài liệu tham khảo, tiêu chí nộp bài...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap or prepend text formatting
  const applyFormat = (prefix: string, suffix: string = '', isLinePrefix: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = '';
    let newCursorPos = start;

    if (isLinePrefix) {
      // Find beginning of current line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      replacement = prefix + selectedText;
      const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      onChange(newValue);
      newCursorPos = start + prefix.length;
    } else {
      replacement = `${prefix}${selectedText || 'văn bản'}${suffix}`;
      const newValue = value.substring(0, start) + replacement + value.substring(end);
      onChange(newValue);
      newCursorPos = selectedText ? end + prefix.length + suffix.length : start + prefix.length;
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
      {/* MS Word style Ribbon / Toolbar */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between gap-1 select-none">
        <div className="flex items-center gap-0.5">
          {/* Document label */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-2 pr-2 border-r border-slate-300">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Mô tả</span>
          </div>

          {/* Bold */}
          <button
            type="button"
            onClick={() => applyFormat('**', '**')}
            title="In đậm (Bold)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => applyFormat('*', '*')}
            title="In nghiêng (Italic)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => applyFormat('<u>', '</u>')}
            title="Gạch chân (Underline)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => applyFormat('~~', '~~')}
            title="Gạch ngang (Strikethrough)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          {/* Heading */}
          <button
            type="button"
            onClick={() => applyFormat('### ', '', true)}
            title="Tiêu đề mục (Heading)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => applyFormat('• ', '', true)}
            title="Danh sách gạch đầu dòng"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => applyFormat('1. ', '', true)}
            title="Danh sách đánh số"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Checkbox item */}
          <button
            type="button"
            onClick={() => applyFormat('☐ ', '', true)}
            title="Mục việc cần làm (Checklist)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          {/* Quote / Note */}
          <button
            type="button"
            onClick={() => applyFormat('> ', '', true)}
            title="Ghi chú / Trích dẫn (Quote)"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          {/* Code */}
          <button
            type="button"
            onClick={() => applyFormat('`', '`')}
            title="Đoạn mã code"
            className="p-1 rounded hover:bg-white text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status bar: Word count */}
        <div className="text-[10px] text-slate-400 font-mono">
          {wordCount} từ • {charCount} ký tự
        </div>
      </div>

      {/* Editor text area */}
      <textarea
        ref={textareaRef}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none resize-y min-h-[90px] font-sans leading-relaxed"
      />
    </div>
  );
};
