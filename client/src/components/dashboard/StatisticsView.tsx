import React, { useMemo } from 'react';
import { Assignment } from '../../features/assignments/types';
import { isOverdue } from '../../lib/deadline';
import { X, CheckCircle2, AlertTriangle, Clock, BookOpen, BarChart3, Award } from 'lucide-react';

interface StatisticsViewProps {
  assignments: Assignment[];
  onClose?: () => void;
}

interface SubjectStat {
  subject: string;
  total: number;
  completed: number;
  overdue: number;
  pending: number;
  rate: number;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ assignments, onClose }) => {
  // Aggregate statistics by subject and priority
  const { subjectStats, priorityStats, totalStats } = useMemo(() => {
    let completed = 0;
    let overdue = 0;
    let pending = 0;

    const subjectMap: Record<string, { total: number; completed: number; overdue: number; pending: number }> = {};
    const priorityMap = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
    };

    for (const item of assignments) {
      if (item.completed) {
        completed += 1;
      } else if (isOverdue(item)) {
        overdue += 1;
      } else {
        pending += 1;
      }

      // Subject breakdown
      if (!subjectMap[item.subject]) {
        subjectMap[item.subject] = { total: 0, completed: 0, overdue: 0, pending: 0 };
      }
      subjectMap[item.subject].total += 1;
      if (item.completed) {
        subjectMap[item.subject].completed += 1;
      } else if (isOverdue(item)) {
        subjectMap[item.subject].overdue += 1;
      } else {
        subjectMap[item.subject].pending += 1;
      }

      // Priority breakdown
      if (priorityMap[item.priority]) {
        priorityMap[item.priority].total += 1;
        if (item.completed) {
          priorityMap[item.priority].completed += 1;
        }
      }
    }

    const subList: SubjectStat[] = Object.entries(subjectMap)
      .map(([subject, stat]) => ({
        subject,
        ...stat,
        rate: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      subjectStats: subList,
      priorityStats: priorityMap,
      totalStats: {
        total: assignments.length,
        completed,
        overdue,
        pending,
        rate: assignments.length > 0 ? Math.round((completed / assignments.length) * 100) : 0,
      },
    };
  }, [assignments]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Báo cáo & Thống kê học tập
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tổng hợp tiến độ bài tập theo môn học và mức độ ưu tiên
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Đóng bảng thống kê"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng bài tập</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {totalStats.total.toLocaleString()}
          </div>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl p-3.5">
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {totalStats.completed.toLocaleString()} ({totalStats.rate}%)
          </div>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/60 rounded-xl p-3.5">
          <div className="text-xs text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Quá hạn</span>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
            {totalStats.overdue.toLocaleString()}
          </div>
        </div>

        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 rounded-xl p-3.5">
          <div className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Đang thực hiện</span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
            {totalStats.pending.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Priority Progress Bars */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Tiến độ theo mức độ ưu tiên</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['high', 'medium', 'low'] as const).map((p) => {
            const data = priorityStats[p];
            const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            const labels = { high: 'Ưu tiên Cao', medium: 'Ưu tiên Trung bình', low: 'Ưu tiên Thấp' };
            const colors = {
              high: 'bg-rose-500',
              medium: 'bg-amber-500',
              low: 'bg-slate-500',
            };

            return (
              <div key={p} className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>{labels[p]}</span>
                  <span>{data.completed}/{data.total} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${colors[p]} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Breakdown Table */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Thống kê chi tiết theo từng môn học</span>
        </h3>

        <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Môn học</th>
                <th className="py-2.5 px-3 text-center">Tổng</th>
                <th className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400">Đã xong</th>
                <th className="py-2.5 px-3 text-center text-rose-600 dark:text-rose-400">Quá hạn</th>
                <th className="py-2.5 px-3 text-center text-blue-600 dark:text-blue-400">Đang chờ</th>
                <th className="py-2.5 px-3 text-right">Tiến độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Chưa có dữ liệu môn học
                  </td>
                </tr>
              ) : (
                subjectStats.map((item) => (
                  <tr key={item.subject} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.subject}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {item.total}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.completed}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-rose-600 dark:text-rose-400">
                      {item.overdue}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                      {item.pending}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-brand-600 dark:text-brand-400">{item.rate}%</span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-600 h-1.5 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
