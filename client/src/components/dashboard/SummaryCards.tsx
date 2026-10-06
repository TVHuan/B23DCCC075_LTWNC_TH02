import React from 'react';
import { BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatsSummary } from '../../features/assignments/types';

interface SummaryCardsProps {
  stats: StatsSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const total = stats.total || 1;

  const cards = [
    {
      title: 'Tất cả bài tập',
      count: stats.total,
      pct: '100%',
      icon: BookOpen,
      iconColor: 'text-brand-600 bg-brand-50 dark:bg-brand-950/70 dark:text-brand-400 border-brand-100 dark:border-brand-800',
    },
    {
      title: 'Chưa hoàn thành',
      count: stats.pending,
      pct: `${Math.round((stats.pending / total) * 100)}%`,
      icon: Clock,
      iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/70 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    },
    {
      title: 'Quá hạn',
      count: stats.overdue,
      pct: `${Math.round((stats.overdue / total) * 100)}%`,
      icon: AlertTriangle,
      iconColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/70 dark:text-rose-400 border-rose-100 dark:border-rose-800',
    },
    {
      title: 'Đã hoàn thành',
      count: stats.completed,
      pct: `${Math.round((stats.completed / total) * 100)}%`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
                {card.count.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {card.pct}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
