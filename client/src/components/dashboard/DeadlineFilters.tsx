import React from 'react';
import { Search, Plus, RotateCcw, X, LayoutGrid, List } from 'lucide-react';
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
          Danh sách bài tập
        </h2>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200/90 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={() => onToggleGroupedView()}
              title="Gom nhóm theo hạn"
              className={cn(
                'p-1.5 rounded-lg text-xs font-semibold transition-all',
                isGroupedView ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleGroupedView()}
              title="Danh sách phẳng"
              className={cn(
                'p-1.5 rounded-lg text-xs font-semibold transition-all',
                !isGroupedView ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset seed button */}
          <button
            onClick={onResetSeed}
            title="Khôi phục dữ liệu mẫu"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200/90 bg-white shadow-xs transition-colors"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2 rounded-xl border border-slate-200/90 shadow-card">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.key;
            
            // Custom styling for tabs based on type and active state
            let activeClass = 'bg-brand-600 text-white shadow-xs';
            let inactiveClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent';
            let badgeActiveClass = 'bg-white/25 text-white';
            let badgeInactiveClass = 'bg-slate-100 text-slate-600';

            if (tab.key === 'overdue') {
              activeClass = 'bg-rose-600 text-white shadow-sm shadow-rose-500/25 ring-1 ring-rose-600';
              inactiveClass = 'text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 font-medium';
              badgeInactiveClass = 'bg-rose-200 text-rose-800 font-bold';
            } else if (tab.key === 'completed') {
              activeClass = 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-600';
              inactiveClass = 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/70 font-medium';
              badgeInactiveClass = 'bg-emerald-200/80 text-emerald-800 font-bold';
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
                  {tab.count}
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
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
            className="py-1.5 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200/90 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 cursor-pointer"
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
