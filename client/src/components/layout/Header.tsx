import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, CheckCircle, Clock, Moon, Sun } from 'lucide-react';
import { Assignment } from '../../features/assignments/types';
import { getDeadlineStatus } from '../../lib/deadline';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  urgentAssignments: Assignment[];
  onOpenStats?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  urgentAssignments,
  onOpenStats,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-base font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
          Deadline Tracker
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Statistics button (if passed) */}
        {onOpenStats && (
          <button
            onClick={onOpenStats}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            📊 Thống kê
          </button>
        )}

        {/* Theme Toggle Button (Light/Dark) */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          title={theme === 'dark' ? 'Giao diện sáng (Light)' : 'Giao diện tối (Dark)'}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Thông báo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {urgentAssignments.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A] dark:text-slate-100">Deadline cần lưu ý</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">
                  {urgentAssignments.length} bài
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {urgentAssignments.length === 0 ? (
                  <div className="py-6 px-4 text-center">
                    <CheckCircle className="w-7 h-7 text-emerald-500 mx-auto mb-1 opacity-90" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Không có deadline gấp</p>
                  </div>
                ) : (
                  urgentAssignments.map((asg) => {
                    const status = getDeadlineStatus(asg.dueDate, asg.completed);
                    return (
                      <div key={asg.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-brand-700 dark:text-brand-400 text-[11px]">{asg.subject}</span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${status.badgeClass}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#0F172A] dark:text-slate-200 line-clamp-1">{asg.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(asg.dueDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            SV
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:block">Sinh viên</span>
        </div>
      </div>
    </header>
  );
};
