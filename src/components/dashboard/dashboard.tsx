
"use client";
import { LogOut, PanelLeft, Compass, MessageCircle, PieChart, Sparkles, UserCircle } from "lucide-react";
import { useState } from "react";
import type { BirthData } from "@/lib/types";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { Logo } from "../icons/logo";
import BirthChartDisplay from "./birth-chart-display";
import ChatInterface from "./chat-interface";
import { cn } from "@/lib/utils";

type DashboardProps = {
  birthData: BirthData;
  onReset: () => void;
};

const NavItem = ({ page, label, icon: Icon, currentPage, navigate }) => (
    <button 
      className={cn(
        "nav-item flex items-center justify-start gap-3 rounded-md p-3 text-left w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        currentPage === page && "bg-accent text-accent-foreground font-semibold"
      )}
      onClick={() => navigate(page)}
    >
        <Icon className="h-5 w-5" />
        <span className="truncate">{label}</span>
    </button>
);

const MobileNavItem = ({ page, label, icon: Icon, currentPage, navigate }) => (
    <button className={cn("nav-item text-center text-muted-foreground flex-1", currentPage === page ? 'text-primary' : '')} onClick={() => navigate(page)}>
        <Icon className="mx-auto" />
        <p className="text-xs mt-1">{label}</p>
    </button>
);


export default function Dashboard({ birthData, onReset }: DashboardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('today');

  const navigate = (page: string) => {
    setCurrentPage(page);
    setIsSheetOpen(false); // Close sheet on navigation
  }

  const PageContent = () => {
    switch (currentPage) {
        case 'chat': return <ChatInterface birthData={birthData} />;
        // Add cases for other pages here when they are built
        // case 'chart': return <ChartPage />;
        // case 'explore': return <ExplorePage />;
        // case 'profile': return <ProfilePage />;
        case 'today':
        default:
            return (
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-foreground">Good Evening, Alex</h1>
                    <p className="text-muted-foreground">Here is your cosmic forecast for today.</p>
                    <div className="mt-8 space-y-6">
                        <div className="glass-card p-5 rounded-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                            <h2 className="font-semibold text-primary">Your Daily Affirmation</h2>
                            <p className="text-xl mt-2 text-foreground">"I embrace change with courage and trust in my journey."</p>
                        </div>
                        <div className="glass-card p-5 rounded-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
                            <h2 className="font-semibold text-primary">Key Transits</h2>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center"><span className="text-2xl mr-4">🌙</span><div><p className="font-medium text-foreground">Moon enters Virgo</p><p className="text-sm text-muted-foreground">Focus on details and organization.</p></div></div>
                                <div className="flex items-center"><span className="text-2xl mr-4">☿️</span><div><p className="font-medium text-foreground">Mercury conjunct Jupiter</p><p className="text-sm text-muted-foreground">A day for big ideas and expansive communication.</p></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
  }
  
  const DesktopNav = () => (
    <nav className="flex flex-col gap-2">
      <NavItem page="today" label="Today" icon={Sparkles} currentPage={currentPage} navigate={navigate} />
      <NavItem page="chat" label="AI Chat" icon={MessageCircle} currentPage={currentPage} navigate={navigate} />
      <NavItem page="chart" label="My Chart" icon={PieChart} currentPage={currentPage} navigate={navigate} />
      <NavItem page="explore" label="Explore" icon={Compass} currentPage={currentPage} navigate={navigate} />
      <NavItem page="profile" label="Profile" icon={UserCircle} currentPage={currentPage} navigate={navigate} />
    </nav>
  );

  return (
    <div className="relative flex h-screen w-full flex-col lg:flex-row bg-background celestial-bg">
      {/* Mobile Header */}
      <header className="flex lg:hidden items-center justify-between p-2 border-b z-10 bg-background/80 backdrop-blur-sm sticky top-0">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open sidebar">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 bg-card/90 backdrop-blur-lg">
              <aside className="w-full h-full overflow-y-auto p-4 lg:p-6 flex flex-col">
                  <div className="flex-1">
                    <BirthChartDisplay />
                  </div>
                  <div className="mt-auto">
                    <DesktopNav />
                  </div>
              </aside>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 text-primary">
            <Logo className="h-6 w-6" />
            <span className="font-semibold text-lg">Astra AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Sign out and reset">
            <LogOut className="h-5 w-5" />
          </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-full lg:w-[280px] xl:w-[320px] lg:h-screen lg:overflow-y-auto p-4 lg:p-6 border-b lg:border-b-0 lg:border-r bg-card/50 glass-card flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-8">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-2xl text-foreground">Astra AI</span>
          </div>
          <BirthChartDisplay />
        </div>
        <div className="mt-auto">
          <DesktopNav />
           <Button variant="ghost" onClick={onReset} className="w-full justify-start gap-3 text-muted-foreground mt-4">
              <LogOut className="h-5 w-5" />
              Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-57px)] lg:h-screen overflow-y-auto">
        <PageContent />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 glass-card bg-background/80 backdrop-blur-sm flex justify-around items-center border-t">
          <MobileNavItem page="today" label="Today" icon={Sparkles} currentPage={currentPage} navigate={navigate} />
          <MobileNavItem page="chat" label="AI Chat" icon={MessageCircle} currentPage={currentPage} navigate={navigate} />
          <MobileNavItem page="chart" label="My Chart" icon={PieChart} currentPage={currentPage} navigate={navigate} />
          <MobileNavItem page="explore" label="Explore" icon={Compass} currentPage={currentPage} navigate={navigate} />
          <MobileNavItem page="profile" label="Profile" icon={UserCircle} currentPage={currentPage} navigate={navigate} />
      </nav>
    </div>
  );
}
