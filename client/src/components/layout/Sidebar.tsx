import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  AlertTriangle,
  PlusCircle,
  Settings,
  CheckCircle2,
  BookOpen,
  X,
  GraduationCap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AssignmentFilter, StatsSummary } from '../../features/assignments/types';

interface SidebarProps {
  currentFilter: AssignmentFilter;
  onSelectFilter: (filter: AssignmentFilter) => void;
  onOpenAddModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  stats: StatsSummary;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentFilter,
  onSelectFilter,
  onOpenAddModal,
  isOpenMobile,
  onCloseMobile,
  stats,
}) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const navItems = [
    {
      label: 'Tổng quan (Overview)',
      filter: 'all' as AssignmentFilter,
      icon: LayoutDashboard,
      count: stats.total,
    },
    {
      label: 'Chưa hoàn thành',
      filter: 'pending' as AssignmentFilter,
      icon: CalendarDays,
      count: stats.pending,
    },
    {
      label: 'Quá hạn',
      filter: 'overdue' as AssignmentFilter,
      icon: AlertTriangle,
      count: stats.overdue,
    },
    {
      label: 'Đã hoàn thành',
      filter: 'completed' as AssignmentFilter,
      icon: CheckCircle2,
      count: stats.completed,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-[14.5px] text-[#0F172A] tracking-tight block leading-tight">
                  Deadline Tracker
                </span>
                <span className="text-[10.5px] text-[#64748B] font-medium block">
                  Student Productivity SaaS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="p-3.5">
            <button
              onClick={() => {
                onOpenAddModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all hover:shadow-md hover:shadow-brand-500/25 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm bài tập mới</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              Điều hướng chính
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentFilter === item.filter;

              let activeStyle = 'bg-brand-50 text-brand-700 font-bold shadow-xs';
              let activeIcon = 'text-brand-600';
              let activeBadge = 'bg-brand-200/60 text-brand-800';

              if (item.filter === 'overdue') {
                activeStyle = 'bg-rose-50 text-rose-700 font-bold shadow-xs';
                activeIcon = 'text-rose-600';
                activeBadge = 'bg-rose-200 text-rose-800';
              } else if (item.filter === 'completed') {
                activeStyle = 'bg-emerald-50 text-emerald-700 font-bold shadow-xs';
                activeIcon = 'text-emerald-600';
                activeBadge = 'bg-emerald-200 text-emerald-800';
              } else if (item.filter === 'pending') {
                activeStyle = 'bg-blue-50 text-blue-700 font-bold shadow-xs';
                activeIcon = 'text-blue-600';
                activeBadge = 'bg-blue-200 text-blue-800';
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onSelectFilter(item.filter);
                    onCloseMobile();
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150',
                    isActive
                      ? activeStyle
                      : item.filter === 'overdue' && item.count > 0
                      ? 'text-rose-700 hover:bg-rose-50/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        isActive
                          ? activeIcon
                          : item.filter === 'overdue' && item.count > 0
                          ? 'text-rose-500'
                          : 'text-slate-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                      isActive
                        ? activeBadge
                        : item.filter === 'overdue' && item.count > 0
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Progress Widget & Settings */}
        <div className="p-3.5 space-y-3 border-t border-slate-100">
          {/* Mini Progress Card */}
          <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A] text-[11px]">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                <span>Tiến độ học kỳ</span>
              </div>
              <span className="font-bold text-brand-700 text-[11px]">{completionRate}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <div className="text-[10.5px] text-slate-500 mt-1.5 flex justify-between">
              <span>Đã hoàn thành</span>
              <strong className="text-slate-700">{stats.completed}/{stats.total} bài</strong>
            </div>
          </div>

          <button
            onClick={() => alert('Student Deadline Tracker Pro • LTWNC 2026')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Cài đặt & Trợ giúp</span>
          </button>
        </div>
      </aside>
    </>
  );
};
