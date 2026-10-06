import { createContext, useContext, ReactNode } from 'react';
import { Assignment } from '../features/assignments/types';
import { getDeadlineStatus, getSubjectTheme } from '../lib/deadline';
import { cn } from '../lib/utils';
import { Check, Flame, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface AssignmentCardContextValue {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextValue | null>(null);

function useAssignmentCardContext() {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('AssignmentCard subcomponents must be used within <AssignmentCardCompound.Root>');
  }
  return context;
}

// 1. Root Component
interface RootProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  children: ReactNode;
  className?: string;
}

function Root({ assignment, onToggle, onEdit, onDelete, children, className }: RootProps) {
  const isCompleted = assignment.completed;
  const theme = getSubjectTheme(assignment.subject);

  return (
    <AssignmentCardContext.Provider value={{ assignment, onToggle, onEdit, onDelete }}>
      <div
        className={cn(
          'group relative bg-white dark:bg-slate-900 border rounded-xl transition-all duration-200 overflow-hidden',
          'hover:shadow-card-hover hover:border-slate-300/90 dark:hover:border-slate-700',
          isCompleted
            ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 opacity-75'
            : 'border-slate-200/80 dark:border-slate-800 shadow-card',
          className
        )}
      >
        {/* Left vertical subject accent bar */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-[3.5px] transition-opacity',
            isCompleted ? 'bg-slate-300 dark:bg-slate-700' : theme.accent
          )}
        />

        <div className="pl-4 pr-3.5 sm:pr-4 py-3.5 sm:py-4">
          {children}
        </div>
      </div>
    </AssignmentCardContext.Provider>
  );
}

// 2. Checkbox Component
interface CheckboxProps {
  className?: string;
}

function Checkbox({ className }: CheckboxProps) {
  const { assignment, onToggle } = useAssignmentCardContext();

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={assignment.completed}
      aria-label={`Đánh dấu hoàn thành: ${assignment.title}`}
      onClick={() => onToggle(assignment.id)}
      className={cn(
        'w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 shrink-0',
        assignment.completed
          ? 'bg-emerald-500 border-emerald-500 text-white animate-check-pop shadow-xs'
          : 'border-slate-300 dark:border-slate-600 hover:border-brand-600 bg-white dark:bg-slate-800 hover:bg-brand-50/50 text-transparent',
        className
      )}
    >
      <Check className={cn('w-3.5 h-3.5 stroke-[3]', assignment.completed ? 'block' : 'opacity-0 hover:opacity-20 text-slate-400')} />
    </button>
  );
}

// 3. Header
interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2 mb-1.5', className)}>
      {children}
    </div>
  );
}

// 4. Subject Badge
function Subject({ className }: { className?: string }) {
  const { assignment } = useAssignmentCardContext();
  const theme = getSubjectTheme(assignment.subject);

  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md border transition-colors',
        assignment.completed
          ? 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          : `${theme.text} ${theme.bg} ${theme.border} dark:bg-slate-800/90 dark:text-indigo-300 dark:border-indigo-900/60`,
        className
      )}
    >
      {assignment.subject}
    </span>
  );
}

// 5. Title
function Title({ className }: { className?: string }) {
  const { assignment } = useAssignmentCardContext();
  return (
    <h3
      className={cn(
        'text-[14.5px] sm:text-[15.5px] font-semibold text-[#0F172A] dark:text-slate-100 leading-snug transition-all',
        assignment.completed && 'assignment-completed-title dark:text-slate-500 line-through',
        className
      )}
    >
      {assignment.title}
    </h3>
  );
}

// 6. Countdown Status Pill with contextual icon
function Countdown({ className }: { className?: string }) {
  const { assignment } = useAssignmentCardContext();
  const deadline = getDeadlineStatus(assignment.dueDate, assignment.completed);

  const renderIcon = () => {
    switch (deadline.iconType) {
      case 'check':
        return <Check className="w-3 h-3 text-emerald-600 mr-1" />;
      case 'flame':
        return <Flame className="w-3 h-3 text-amber-600 mr-1 animate-bounce" />;
      case 'alert':
        return <AlertTriangle className="w-3 h-3 text-rose-600 mr-1" />;
      case 'clock':
        return <Clock className="w-3 h-3 text-amber-600 mr-1" />;
      default:
        return <Calendar className="w-3 h-3 text-slate-500 mr-1" />;
    }
  };

  return (
    <div className={cn('flex items-center text-xs', className)}>
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-md border text-[11.5px] font-medium transition-colors',
          deadline.badgeClass
        )}
      >
        {renderIcon()}
        {deadline.label}
      </span>
    </div>
  );
}

export const AssignmentCardCompound = {
  Root,
  Checkbox,
  Header,
  Subject,
  Title,
  Countdown,
};
