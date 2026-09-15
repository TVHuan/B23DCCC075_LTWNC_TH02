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
      iconColor: 'text-brand-600 bg-brand-50 border-brand-100',
    },
    {
      title: 'Chưa hoàn thành',
      count: stats.pending,
      pct: `${Math.round((stats.pending / total) * 100)}%`,
      icon: Clock,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Quá hạn',
      count: stats.overdue,
      pct: `${Math.round((stats.overdue / total) * 100)}%`,
      icon: AlertTriangle,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Đã hoàn thành',
      count: stats.completed,
      pct: `${Math.round((stats.completed / total) * 100)}%`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shadow-card hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight">
                {card.count}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                {card.pct}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
