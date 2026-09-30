import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, Sparkles, UserCheck, 
  Briefcase, Settings, ClipboardCheck 
} from "lucide-react";

// Added 'settings' to the ViewState
export type ViewState = 'dashboard' | 'ai-assistant' | 'pc-member' | 'approval-queue' | 'applications' | 'settings';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-[260px] border-r border-[#232935] flex flex-col justify-between flex-shrink-0 bg-[#0B0E14] z-10">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 mb-8 mt-2">
          <div className="w-8 h-8 bg-[#6366F1] rounded-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[#E6E9EF] font-semibold tracking-wide text-lg leading-tight">PlaceHub</h2>
            <p className="text-[#8B93A7] text-[10px] uppercase tracking-wider">Career Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[#8B93A7] text-xs font-semibold px-2 mb-2 tracking-wider">WORKSPACE</p>
            
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('dashboard')}
              className={`w-full justify-start ${activeView === 'dashboard' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <LayoutDashboard className={`mr-3 h-4 w-4 ${activeView === 'dashboard' ? "text-[#6366F1]" : ""}`} /> 
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('ai-assistant')}
              className={`w-full justify-start ${activeView === 'ai-assistant' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <Sparkles className={`mr-3 h-4 w-4 ${activeView === 'ai-assistant' ? "text-[#22D3EE]" : ""}`} /> 
              AI Career Assistant
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('pc-member')}
              className={`w-full justify-start ${activeView === 'pc-member' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <UserCheck className={`mr-3 h-4 w-4 ${activeView === 'pc-member' ? "text-[#6366F1]" : ""}`} /> 
              PC Member
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setActiveView('approval-queue')}
              className={`w-full justify-start ${activeView === 'approval-queue' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <ClipboardCheck className={`mr-3 h-4 w-4 ${activeView === 'approval-queue' ? "text-[#FBBF24]" : ""}`} /> 
              Approval Queue
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-[#8B93A7] text-xs font-semibold px-2 mb-2 tracking-wider">GENERAL</p>
            
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('applications')}
              className={`w-full justify-start ${activeView === 'applications' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <Briefcase className={`mr-3 h-4 w-4 ${activeView === 'applications' ? "text-[#6366F1]" : ""}`} /> 
              Applications
            </Button>

            {/* Calendar has been removed, Settings is now dynamically linked */}
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('settings')}
              className={`w-full justify-start ${activeView === 'settings' ? "bg-[#131720] text-[#E6E9EF] hover:bg-[#1B212C]" : "text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#131720]"}`}
            >
              <Settings className={`mr-3 h-4 w-4 ${activeView === 'settings' ? "text-[#6366F1]" : ""}`} /> 
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#232935]">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-teal-500/20 text-teal-400 text-sm font-medium">AS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#E6E9EF]">Nikhil Thorat</span>
            <span className="text-xs text-[#8B93A7]">25112001</span>
          </div>
        </div>
      </div>
    </aside>
  );
}