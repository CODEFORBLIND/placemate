"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'request'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Request form state
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
  };

  const handleRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Requesting access for:', fullName, workEmail, department, reason);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] relative overflow-hidden font-sans">
      
      {/* Subtle radial gradient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22D3EE] opacity-[0.07] blur-[100px] rounded-full pointer-events-none"></div>

      <Card className="relative z-10 w-full max-w-[400px] bg-[#131720] border-[#232935] shadow-2xl">
        
        {view === 'login' ? (
          // ========================
          // LOGIN VIEW
          // ========================
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="flex flex-col items-center space-y-4 pt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6366F1] rounded-md flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <CardTitle className="text-[#E6E9EF] text-xl font-semibold tracking-wide">Placemate</CardTitle>
              </div>
              <CardDescription className="text-[#8B93A7] text-sm text-center leading-relaxed">
                Campus placements, run by AI agents that actually read resumes.
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input 
                  type="text" 
                  placeholder="Username or Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1]"
                  required
                />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1]"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#6366F1] hover:bg-indigo-500 text-white mt-2"
                >
                  Sign in
                </Button>
              </form>

              <div className="w-full flex items-center justify-center gap-3 my-6">
                <div className="h-px bg-[#232935] flex-grow"></div>
                <span className="text-[#8B93A7] text-xs uppercase tracking-wider">or</span>
                <div className="h-px bg-[#232935] flex-grow"></div>
              </div>

              <Button 
                type="button"
                variant="outline"
                onClick={() => setView('request')}
                className="w-full border-[#232935] bg-transparent text-[#E6E9EF] hover:bg-[#1B212C] hover:text-[#E6E9EF]"
              >
                Request PC Admin / Member Account
              </Button>
            </CardContent>
          </div>
        ) : (
          // ========================
          // REQUEST ACCOUNT VIEW
          // ========================
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pt-6 space-y-4">
              <Button 
                variant="ghost"
                onClick={() => setView('login')}
                className="w-fit mx-auto text-[#8B93A7] hover:text-[#E6E9EF] hover:bg-transparent -mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Login
              </Button>
              <div className="space-y-1.5 text-center sm:text-left">
                <CardTitle className="text-[#E6E9EF] text-xl font-semibold">Request PC Account</CardTitle>
                <CardDescription className="text-[#8B93A7]">
                  Tell us who you are and we'll route your request to the Placement Cell.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pb-8">
              <form onSubmit={handleRequest} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF]">Full Name</Label>
                  <Input 
                    type="text" 
                    placeholder="Jane Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF]">Work Email</Label>
                  <Input 
                    type="email" 
                    placeholder="jane@university.edu" 
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF]">Department</Label>
                  <Input 
                    type="text" 
                    placeholder="Computer Science" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#E6E9EF]">Reason for access</Label>
                  <Textarea 
                    placeholder="Briefly describe why you need PC access..." 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="bg-[#0B0E14] border-[#232935] text-[#E6E9EF] placeholder:text-[#8B93A7] focus-visible:ring-[#6366F1] resize-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#6366F1] hover:bg-indigo-500 text-white mt-2"
                >
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </div>
        )}
      </Card>

      {/* Footer Links */}
      <div className="flex items-center gap-4 mt-8 text-xs text-[#8B93A7]">
        <a href="#" className="hover:text-[#E6E9EF] transition-colors">About Placemate</a>
        <span className="w-px h-3 bg-[#232935]"></span>
        <a href="#" className="hover:text-[#E6E9EF] transition-colors">Contact</a>
      </div>

    </div>
  );
}