
"use client";
import { LogOut, PanelLeft } from "lucide-react";
import { useState } from "react";
import type { BirthData } from "@/lib/types";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { Logo } from "../icons/logo";
import BirthChartDisplay from "./birth-chart-display";
import ChatInterface from "./chat-interface";

type DashboardProps = {
  birthData: BirthData;
  onReset: () => void;
};

export default function Dashboard({ birthData, onReset }: DashboardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <div className="relative flex h-screen w-full flex-col lg:flex-row bg-background">
      {/* Mobile Header */}
      <header className="flex lg:hidden items-center justify-between p-2 border-b z-10 bg-background/80 backdrop-blur-sm sticky top-0">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open sidebar">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 bg-card/90 backdrop-blur-lg">
              <aside className="w-full h-full overflow-y-auto p-4 lg:p-6">
                  <BirthChartDisplay onLinkClick={() => setIsSheetOpen(false)} />
              </aside>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 text-primary">
            <Logo className="h-6 w-6" />
            <span className="font-semibold text-lg">Cosmic Insights</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Sign out and reset">
            <LogOut className="h-5 w-5" />
          </Button>
      </header>

      {/* Desktop Header for Sign Out */}
      <header className="absolute top-4 right-4 z-20 hidden lg:flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onReset} aria-label="Sign out and reset">
          <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      </header>
      
      <aside className="hidden lg:block w-full lg:w-1/3 xl:w-1/4 lg:h-screen lg:overflow-y-auto p-4 lg:p-6 border-b lg:border-b-0 lg:border-r bg-card/50">
        <BirthChartDisplay />
      </aside>
      <main className="flex-1 flex flex-col h-[calc(100vh-57px)] lg:h-full">
        <ChatInterface birthData={birthData} />
      </main>
    </div>
  );
}

    