"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] relative overflow-hidden font-sans">
      
      {/* Subtle radial gradient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22D3EE] opacity-[0.07] blur-[100px] rounded-full pointer-events-none"></div>

      <Card className="relative z-10 w-full max-w-[400px] bg-[#131720] border-[#232935] shadow-2xl text-center">
        
        <CardHeader className="flex flex-col items-center space-y-6 pt-8 pb-4">
          {/* Logo & Branding */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-[#6366F1] rounded-md flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <span className="text-[#E6E9EF] text-xl font-semibold tracking-wide">Placemate</span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-[#E6E9EF] text-2xl font-semibold">
              You're signed out
            </CardTitle>
            <CardDescription className="text-[#8B93A7] text-sm leading-relaxed px-2">
              Thanks for using Placemate. You can safely close this window or log back in to your account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <Button 
            type="button"
            onClick={() => window.location.href = '/login'} 
            className="w-full bg-[#6366F1] hover:bg-indigo-500 text-white"
          >
            Sign in again
          </Button>
        </CardContent>

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