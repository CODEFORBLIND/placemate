import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Search, 
  Filter,
  Eye, 
  Check, 
  X,
  FileText
} from "lucide-react";

export default function ApplicationsContent() {
  const applications = [
    { id: 1, student: { name: "Aarav Sharma", roll: "21CS1042", initials: "AS", color: "bg-indigo-500" }, role: "Frontend Engineer", company: "Vercel", appliedOn: "Nov 10, 2025", score: 92, status: "Shortlisted" },
    { id: 2, student: { name: "Diya Patel", roll: "21EC2087", initials: "DP", color: "bg-cyan-500" }, role: "Machine Learning Engineer", company: "Nimbus AI", appliedOn: "Nov 11, 2025", score: 74, status: "Under Review" },
    { id: 3, student: { name: "Kabir Nair", roll: "21IT3311", initials: "KN", color: "bg-emerald-500" }, role: "Backend Developer", company: "Corewave", appliedOn: "Nov 11, 2025", score: 48, status: "Rejected" },
    { id: 4, student: { name: "Ishita Rao", roll: "21CS1188", initials: "IR", color: "bg-amber-500" }, role: "Frontend Engineer", company: "Vercel", appliedOn: "Nov 12, 2025", score: 88, status: "Under Review" },
    { id: 5, student: { name: "Ananya Iyer", roll: "21EC2109", initials: "AI", color: "bg-purple-500" }, role: "Data Analyst", company: "Quantel", appliedOn: "Nov 12, 2025", score: 81, status: "Pending" },
    { id: 6, student: { name: "Vivaan Gupta", roll: "21IT3402", initials: "VG", color: "bg-blue-500" }, role: "DevOps Engineer", company: "Stratus Cloud", appliedOn: "Nov 13, 2025", score: 63, status: "Pending" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string, dot: string }> = {
      "Shortlisted": { bg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", dot: "bg-emerald-400" },
      "Under Review": { bg: "bg-blue-400/10 text-blue-400 border-blue-400/20", dot: "bg-blue-400" },
      "Pending": { bg: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400" },
      "Rejected": { bg: "bg-rose-400/10 text-rose-400 border-rose-400/20", dot: "bg-rose-400" },
    };
    const style = styles[status] || styles["Pending"];
    return (
      <Badge variant="outline" className={`font-normal pl-1.5 pr-2.5 py-0.5 ${style.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`}></span>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-7xl mx-auto p-6 md:p-8">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#E6E9EF] mb-1">Applications</h2>
          <p className="text-sm text-[#8B93A7]">Manage and track student job applications across all active drives.</p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-[#131720] border border-[#232935] rounded-xl overflow-hidden shadow-sm flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#232935] flex items-center gap-4 bg-[#0B0E14]/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B93A7]" />
            <Input 
              placeholder="Search by student or role..." 
              className="w-full pl-9 bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] h-9 text-sm"
            />
          </div>
          <Button variant="outline" className="h-9 border-[#232935] bg-[#0B0E14] text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#1B212C]">
            <Filter className="h-4 w-4 mr-2" /> Filter Status
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-[#0B0E14]/50 hover:bg-[#0B0E14]/50">
            <TableRow className="border-[#232935] hover:bg-transparent">
              <TableHead className="text-[#8B93A7] font-medium h-11 w-[250px]">Applicant</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11 w-[250px]">Applied Role</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">Applied On</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">ATS Score</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11">Status</TableHead>
              <TableHead className="text-[#8B93A7] font-medium h-11 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="border-[#232935] hover:bg-[#1B212C]/50 transition-colors">
                
                {/* Applicant */}
                <TableCell className="font-medium text-[#E6E9EF] py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`${app.student.color} text-white text-xs font-medium`}>
                        {app.student.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{app.student.name}</span>
                      <span className="text-xs text-[#8B93A7] font-mono font-normal mt-0.5">{app.student.roll}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[#E6E9EF] text-sm">{app.role}</span>
                    <span className="text-[#8B93A7] text-xs mt-0.5">{app.company}</span>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="text-[#8B93A7] text-sm">
                  {app.appliedOn}
                </TableCell>

                {/* ATS Score */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${getScoreColor(app.score)}`} />
                    <span className={`font-mono font-medium ${getScoreColor(app.score)}`}>{app.score}%</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusBadge(app.status)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 border-[#232935] bg-transparent text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-[#1B212C]"
                      title="View Application"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      className="h-8 w-8 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      title="Shortlist"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      className="h-8 w-8 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}