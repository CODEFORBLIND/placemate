import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Plus } from "lucide-react";
import type { ViewState } from './sidebar';

interface TopbarProps {
  activeView: ViewState;
}

export default function Topbar({ activeView }: TopbarProps) {
  return (
    <header className="h-[72px] flex-shrink-0 border-b border-[#232935] px-8 flex items-center justify-between bg-[#0B0E14]">
      <h1 className="text-xl font-semibold text-[#E6E9EF]">
        {activeView === 'dashboard' && 'Dashboard'}
        {activeView === 'pc-member' && 'PC Member Dashboard'}
        {activeView === 'ai-assistant' && 'AI Career Assistant'}
        {activeView === 'approval-queue' && 'Approval Queue'}
        {activeView === 'applications' && 'Applications'}
        {activeView === 'settings' && 'Settings'}
      </h1>
      
      <div className="flex items-center gap-4">
        {/* Hide search bar on pages that have their own table search */}
        {activeView !== 'approval-queue' && activeView !== 'applications' && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B93A7]" />
            <Input 
              placeholder="Search..." 
              className="w-full pl-9 bg-[#131720] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] h-10"
            />
          </div>
        )}
        
        {activeView === 'pc-member' && (
          <Button className="bg-[#6366F1] hover:bg-indigo-500 text-white h-10 px-4">
            <Plus className="mr-2 h-4 w-4" /> Add Job Posting
          </Button>
        )}

        <Button variant="outline" size="icon" className="h-10 w-10 border-[#232935] bg-[#131720] text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#1B212C]">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}