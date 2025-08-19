import type { BirthData } from "@/lib/types";
import BirthChartDisplay from "./birth-chart-display";
import ChatInterface from "./chat-interface";
import { Button } from "../ui/button";
import { LogOut, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

type DashboardProps = {
  birthData: BirthData;
  onReset: () => void;
};

export default function Dashboard({ birthData, onReset }: DashboardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <div className="relative flex h-screen w-full flex-col lg:flex-row bg-background">
      <header className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open sidebar">
              <PanelLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
             <aside className="w-full h-full overflow-y-auto p-4 lg:p-6">
                <BirthChartDisplay onLinkClick={() => setIsSheetOpen(false)} />
             </aside>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" onClick={onReset} aria-label="Sign out and reset">
          <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      </header>
      <aside className="hidden lg:block w-full lg:w-1/3 xl:w-1/4 lg:h-screen lg:overflow-y-auto p-4 lg:p-6 border-b lg:border-b-0 lg:border-r">
        <BirthChartDisplay />
      </aside>
      <main className="flex-1 flex flex-col h-full">
        <ChatInterface birthData={birthData} />
      </main>
    </div>
  );
}
