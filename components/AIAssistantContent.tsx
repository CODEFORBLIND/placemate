import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, GraduationCap, XCircle, CheckCircle2, 
  RefreshCw, Upload, ExternalLink, Sparkles 
} from "lucide-react";

export default function AIAssistantContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* CARD 1: ATS SCORE */}
      <Card className="bg-[#131720] border-[#232935] shadow-none flex flex-col">
        <CardHeader className="pb-4 pt-6 px-8">
          <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center mb-4">
            <FileText className="h-4 w-4 text-[#22D3EE]" />
          </div>
          <CardTitle className="text-lg font-semibold text-[#E6E9EF]">Resume / ATS Score</CardTitle>
          <p className="text-[#22D3EE] text-xs font-medium">ATS Agent</p>
        </CardHeader>
        <CardContent className="px-8 pb-8 flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#232935" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#22D3EE" strokeWidth="8" strokeDasharray="264" strokeDashoffset="39.6" className="transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-semibold text-[#E6E9EF] font-mono tracking-tighter">85%</span>
                <p className="text-[10px] text-[#8B93A7] uppercase tracking-wider mt-1">ATS Score</p>
              </div>
            </div>
            <p className="text-xs text-[#8B93A7] mt-4">Last analyzed: Nov 08, 2025</p>
          </div>
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#E6E9EF]">Missing keywords: React, TypeScript</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#E6E9EF]">Add measurable impact to project bullets</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#22D3EE] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#8B93A7]">Contact info and links are complete</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#22D3EE] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#8B93A7]">Consistent formatting and section headers</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#22D3EE] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#8B93A7]">Resume length within one page</span>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-[#232935] bg-transparent hover:bg-[#1B212C] text-[#E6E9EF]">
              <RefreshCw className="mr-2 h-4 w-4 text-[#8B93A7]" /> Re-analyze
            </Button>
            <Button variant="outline" className="border-[#232935] bg-transparent hover:bg-[#1B212C] text-[#E6E9EF]">
              <Upload className="mr-2 h-4 w-4 text-[#8B93A7]" /> Upload New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: TUTOR UPSKILL */}
      <Card className="bg-[#131720] border-[#232935] shadow-none flex flex-col">
        <CardHeader className="pb-4 pt-6 px-8">
          <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center mb-4">
            <GraduationCap className="h-4 w-4 text-[#22D3EE]" />
          </div>
          <CardTitle className="text-lg font-semibold text-[#E6E9EF]">Practice / Upskill</CardTitle>
          <p className="text-[#22D3EE] text-xs font-medium">Tutor Agent</p>
        </CardHeader>
        <CardContent className="px-8 pb-8 flex-1 flex flex-col">
          <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-lg p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#22D3EE]" />
              <span className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">Agent Summary</span>
            </div>
            <p className="text-sm text-[#E6E9EF] leading-relaxed">
              You show strong fundamentals in JavaScript and UI development, with consistent project delivery. To reach top-tier roles, focus on deepening your system design intuition and practicing medium-level data structure problems under timed conditions.
            </p>
          </div>
          <h3 className="text-sm font-medium text-[#E6E9EF] mb-4">Recommended resources</h3>
          <div className="space-y-1 mb-8">
            <div className="flex items-center justify-between border border-[#232935] rounded-md p-4 bg-[#0B0E14]/50 hover:bg-[#1B212C]/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#E6E9EF] font-medium group-hover:text-[#22D3EE] transition-colors">System Design Fundamentals</span>
                <Badge variant="secondary" className="bg-[#131720] text-[#8B93A7] border-[#232935] text-[10px] font-normal px-2 py-0">Course</Badge>
              </div>
              <ExternalLink className="h-4 w-4 text-[#8B93A7] group-hover:text-[#22D3EE] transition-colors" />
            </div>
            <div className="flex items-center justify-between border border-[#232935] rounded-md p-4 bg-[#0B0E14]/50 hover:bg-[#1B212C]/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#E6E9EF] font-medium group-hover:text-[#22D3EE] transition-colors">Advanced React Patterns</span>
                <Badge variant="secondary" className="bg-[#131720] text-[#8B93A7] border-[#232935] text-[10px] font-normal px-2 py-0">Article</Badge>
              </div>
              <ExternalLink className="h-4 w-4 text-[#8B93A7] group-hover:text-[#22D3EE] transition-colors" />
            </div>
          </div>
          <div className="mt-auto pt-4">
            <Button className="w-full bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B0E14] font-semibold h-11">
              <Sparkles className="mr-2 h-4 w-4" /> Start AI Practice Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}