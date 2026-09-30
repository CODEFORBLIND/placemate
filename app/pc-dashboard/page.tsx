"use client";

import React, { useState } from 'react';
import Sidebar, { ViewState } from '@/components/sidebar';
import Topbar from '@/components/topbar';
import SettingsContent from '@/components/SettingsContent';

import PCMemberContent from '@/components/PCMemberContent';
import AIAssistantContent from '@/components/AIAssistantContent';
import StudentDashboardContent from '@/components/StudentDashboardContent';
import ApprovalQueueContent from '@/components/ApprovalQueueContent';
// Add the new import:
import ApplicationsContent from '@/components/ApplicationsContent';

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState<ViewState>('applications');

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#E6E9EF] font-sans overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar activeView={activeView} />
        <div className="flex-1 overflow-auto">
          {activeView === 'dashboard' && <div className="p-8"><StudentDashboardContent /></div>}
          {activeView === 'pc-member' && <div className="p-8"><PCMemberContent /></div>}
          {activeView === 'ai-assistant' && <div className="p-8"><AIAssistantContent /></div>}
          
          {/* Note: No padding wrappers for these two because they handle their own p-6/p-8 spacing */}
          {activeView === 'approval-queue' && <ApprovalQueueContent />}
          {activeView === 'applications' && <ApplicationsContent />}
          {activeView === 'settings' && <SettingsContent />}
        </div>
      </main>
    </div>
  );
}