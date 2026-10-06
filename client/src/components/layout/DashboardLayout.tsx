import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Assignment, AssignmentFilter, StatsSummary } from '../../features/assignments/types';

interface DashboardLayoutProps {
  currentFilter: AssignmentFilter;
  onSelectFilter: (filter: AssignmentFilter) => void;
  onOpenAddModal: () => void;
  urgentAssignments: Assignment[];
  stats: StatsSummary;
  children: ReactNode;
  onOpenStats?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentFilter,
  onSelectFilter,
  onOpenAddModal,
  urgentAssignments,
  stats,
  children,
  onOpenStats,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar */}
      <Sidebar
        currentFilter={currentFilter}
        onSelectFilter={onSelectFilter}
        onOpenAddModal={onOpenAddModal}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          urgentAssignments={urgentAssignments}
          onOpenStats={onOpenStats}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
