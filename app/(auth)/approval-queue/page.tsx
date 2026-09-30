import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Check, 
  X, 
  Eye, 
  FileText, 
  Clock 
} from "lucide-react";

export default function ApprovalQueueContent() {
  // Mock data for students awaiting approval
  const pendingRequests = [
    { id: 1, name: "Aarav Sharma", email: "aarav.sharma@university.edu", initials: "AS", color: "bg-indigo-500", course: "B.Tech CSE", roll: "21CS1042", submitted: "Nov 08, 2025", resume: "Aarav_Resume.pdf" },
    { id: 2, name: "Saanvi Reddy", email: "saanvi.reddy@university.edu", initials: "SR", color: "bg-rose-500", course: "MCA", roll: "22MC0501", submitted: "Nov 09, 2025", resume: "S_Reddy_CV.pdf" },
    { id: 3, name: "Kabir Nair", email: "kabir.nair@university.edu", initials: "KN", color: "bg-emerald-500", course: "B.Tech IT", roll: "21IT3311", submitted: "Nov 09, 2025", resume: "Kabir_Nair_Resume_v2.pdf" },
    { id: 4, name: "Rohan Mehta", email: "rohan.m@university.edu", initials: "RM", color: "bg-pink-500", course: "MCA", roll: "22MC0455", submitted: "Nov 10, 2025", resume: "Rohan_Tech_Resume.pdf" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-7xl mx-auto">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-lg font-semibold text-[#E6E9EF]">Approval Queue</h2>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 px-2 py-0">
              {pendingRequests.length} Pending
            </Badge>
          </div>
          <p className="text-sm text-[#8B93A7]">Review and approve new student profiles before they access the platform.</p>
        </div>
      </div>

      {/* QUEUE TABLE CARD */}
      <div className="bg-[#131720] border border-[#232935] rounded-xl overflow-hidden shadow-sm flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#232935] flex items-center justify-between bg-[#0B0E14]/30">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B93A7]" />
            <Input 
              placeholder="Search pending requests..." 
              className="w-full pl-9 bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] h-9 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-[#0B0E14]/50 hover:bg-[#0B0E14]/50">
            <TableRow className="border-[#232935] hover:bg-transparent">
              <TableHead className="text-[#8B93A7] font-medium h-11 w-[300px]">Student Profile</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">Course & Roll</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">Submitted On</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">Resume</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((student) => (
                <TableRow key={student.id} className="border-[#232935] hover:bg-[#1B212C]/50 transition-colors">
                  
                  {/* Student Details */}
                  <TableCell className="font-medium text-[#E6E9EF] py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={`${student.color} text-white text-xs font-medium`}>
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{student.name}</span>
                        <span className="text-xs text-[#8B93A7] font-normal">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Course & Roll */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[#E6E9EF] text-sm">{student.course}</span>
                      <span className="text-[#8B93A7] text-xs font-mono mt-0.5">{student.roll}</span>
                    </div>
                  </TableCell>

                  {/* Submitted Date */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[#8B93A7] text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {student.submitted}
                    </div>
                  </TableCell>

                  {/* Resume Link */}
                  <TableCell>
                    <Button variant="ghost" className="h-8 px-2 text-[#22D3EE] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 flex items-center gap-2 font-normal text-xs">
                      <FileText className="h-3.5 w-3.5" />
                      {student.resume}
                    </Button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 border-[#232935] bg-transparent text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#1B212C]"
                        title="Review full profile"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Review
                      </Button>
                      <Button 
                        size="sm"
                        className="h-8 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5"
                        title="Approve request"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        className="h-8 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 px-2.5"
                        title="Reject request"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow className="border-[#232935] hover:bg-transparent">
                <TableCell colSpan={5} className="h-32 text-center text-[#8B93A7]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Check className="h-8 w-8 text-[#232935]" />
                    <p>Nothing pending — you're all caught up!</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}