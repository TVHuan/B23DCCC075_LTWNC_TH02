import React from 'react';
import { Search, Plus, RotateCcw, X, LayoutGrid, List, Flame } from 'lucide-react';
import { AssignmentFilter, Priority, StatsSummary } from '../../features/assignments/types';
import { cn } from '../../lib/utils';

interface DeadlineFiltersProps {
  currentFilter: AssignmentFilter;
  onSelectFilter: (filter: AssignmentFilter) => void;
  stats: StatsSummary;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  isGroupedView: boolean;
  onToggleGroupedView: () => void;
  onOpenAddModal: () => void;
  onResetSeed: () => void;
  onGenerate10k?: () => void;
  onOpenStats?: () => void;
}

export const DeadlineFilters: React.FC<DeadlineFiltersProps> = ({
  currentFilter,
  onSelectFilter,
  stats,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  isGroupedView,
  onToggleGroupedView,
  onOpenAddModal,
  onResetSeed,
  onGenerate10k,
  onOpenStats,
}) => {
  const tabs: { key: AssignmentFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Tất cả', count: stats.total },
    { key: 'pending', label: 'Chưa hoàn thành', count: stats.pending },
    { key: 'overdue', label: 'Quá hạn', count: stats.overdue },
    { key: 'completed', label: 'Đã hoàn thành', count: stats.completed },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* Top row: Section Header & Action Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
          Danh sách bài tập
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Stress test button (10,000 assignments) */}
          {onGenerate10k && (
            <button
              onClick={onGenerate10k}
              title="Chế độ Stress Test: Sinh 10.000 bài tập mẫu để kiểm tra hiệu năng Virtualization"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-100 text-amber-100" />
              <span>Tạo 10.000 bài tập</span>
            </button>
          )}

          {/* Statistics Button */}
          {onOpenStats && (
            <button
              onClick={onOpenStats}
              title="Mở bảng thống kê chi tiết"
              className="hidden sm:flex items-center gap-1 py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
            >
              <span>📊 Thống kê</span>
            </button>
          )}

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={() => onToggleGroupedView()}
              title="Gom nhóm theo hạn"
              className={cn(
                'p-1.5 rounded-lg text-xs font-semibold transition-all',
                isGroupedView
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleGroupedView()}
              title="Danh sách phẳng"
              className={cn(
                'p-1.5 rounded-lg text-xs font-semibold transition-all',
                !isGroupedView
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset seed button */}
          <button
            onClick={onResetSeed}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Add Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all hover:shadow-md hover:shadow-brand-500/25 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.key;

            let activeClass = 'bg-brand-600 text-white shadow-xs';
            let inactiveClass = 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent';
            let badgeActiveClass = 'bg-white/25 text-white';
            let badgeInactiveClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

            if (tab.key === 'overdue') {
              activeClass = 'bg-rose-600 text-white shadow-sm shadow-rose-500/25 ring-1 ring-rose-600';
              inactiveClass = 'text-rose-700 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/40 font-medium';
              badgeInactiveClass = 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold';
            } else if (tab.key === 'completed') {
              activeClass = 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-600';
              inactiveClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200/70 dark:border-emerald-900/40 font-medium';
              badgeInactiveClass = 'bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold';
            } else if (tab.key === 'pending') {
              activeClass = 'bg-blue-600 text-white shadow-sm shadow-blue-500/25';
            }

            return (
              <button
                key={tab.key}
                onClick={() => onSelectFilter(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                  isActive ? activeClass : inactiveClass
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors',
                    isActive ? badgeActiveClass : badgeInactiveClass
                  )}
                >
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Priority */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm bài tập..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
            className="py-1.5 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Vừa</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>
    </div>
  );
};
