
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/icons/google-logo";
import { ArrowUp, Bell, ChevronLeft, ChevronRight, Compass, MessageCircle, PieChart, Shield, Sparkles, User, UserCircle } from "lucide-react";

const exploreData = {
    "Planets": { items: ["Sun", "Moon", "Mercury", "Venus", "Mars"], content: "The planets represent different facets of your personality and life." },
    "Signs": { items: ["Aries", "Taurus", "Gemini", "Cancer", "Leo"], content: "The zodiac signs color the expression of the planets." },
    "Houses": { items: ["1st House", "2nd House", "3rd House", "4th House", "5th House"], content: "The houses represent the different areas of your life." },
};
const contentData = { "Mars": "Mars represents your drive, ambition, and passion.", "Aries": "Aries is a cardinal fire sign known for its pioneering and courageous spirit." };

const Page = ({ id, active, children, className = '' }: { id: string, active: boolean, children: React.ReactNode, className?: string }) => (
    <main id={`page-${id}`} className={`page ${active ? 'active' : ''} ${className}`}>
        {children}
    </main>
);

const NavItem = ({ page, label, icon: Icon, currentPage, navigate }) => (
    <button className={`nav-item text-center text-gray-400 ${currentPage === page ? 'active' : ''}`} onClick={() => navigate(page, null, true)}>
        <Icon />
        <p className="text-xs mt-1">{label}</p>
    </button>
);

export default function Home() {
    const [pageHistory, setPageHistory] = useState(['login']);
    const [mainAppVisible, setMainAppVisible] = useState(false);
    const [subPagesVisible, setSubPagesVisible] = useState(false);
    const [exploreContext, setExploreContext] = useState(null);
    const [exploreContentContext, setExploreContentContext] = useState(null);

    const currentPage = pageHistory[pageHistory.length - 1];

    useEffect(() => {
      // Hide onboarding pages after calculation
      if (mainAppVisible) {
        const onboardingFlowPages = ['login', 'onboarding', 'calculating'];
        onboardingFlowPages.forEach(id => {
          const el = document.getElementById(`page-${id}`);
          if (el) el.style.display = 'none';
        });
      }
    }, [mainAppVisible]);


    const navigateTo = (pageId, context = null, isTabSwitch = false) => {
        const isSubPage = pageId.includes('explore-') || pageId.includes('profile-');

        if (isSubPage) {
            setMainAppVisible(false);
            setSubPagesVisible(true);
            if (pageId.includes('explore-details')) setExploreContext(context);
            if (pageId.includes('explore-content')) setExploreContentContext(context);
        } else {
            setMainAppVisible(true);
            setSubPagesVisible(false);
        }

        setPageHistory(prev => isTabSwitch ? [pageId] : [...prev, pageId]);
    };

    const goBack = () => {
        if (pageHistory.length <= 1) return;
        
        setPageHistory(prev => {
            const newHistory = [...prev];
            newHistory.pop();
            const previousPageId = newHistory[newHistory.length - 1];
            const isSubPage = previousPageId.includes('explore-') || previousPageId.includes('profile-');
            
            if (isSubPage) {
                setMainAppVisible(false);
                setSubPagesVisible(true);
            } else {
                setMainAppVisible(true);
                setSubPagesVisible(false);
            }
            return newHistory;
        });
    };

    const handleGenerateChart = () => {
        navigateTo('calculating');
        setTimeout(() => {
            setPageHistory([]); // Reset history
            navigateTo('today');
        }, 3000);
    }
    
    return (
        <div className="max-w-sm mx-auto bg-[#0c0a1e] shadow-2xl h-screen relative overflow-hidden">
            <Page id="login" active={currentPage === 'login'} className="celestial-bg flex flex-col justify-between p-6">
                <div className="text-center pt-16 fade-in">
                    <svg className="w-20 h-20 mx-auto text-purple-300 pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5L7 10L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 5L17 10L19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <h1 className="text-4xl font-bold mt-4 text-white">Astra AI</h1>
                    <p className="text-lg text-purple-200 mt-2">Discover what the stars say about you.</p>
                </div>
                <div className="pb-8 fade-in" style={{animationDelay: '0.3s'}}>
                    <p className="text-xs text-gray-400 text-center mb-4">By continuing, you agree to our Terms of Service.</p>
                    <Button id="loginBtn" onClick={() => navigateTo('onboarding')} className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 h-auto text-base">
                        <GoogleLogo className="mr-3"/>
                        Sign in with Google
                    </Button>
                </div>
            </Page>

            <Page id="onboarding" active={currentPage === 'onboarding'} className="celestial-bg flex flex-col justify-center p-6">
                 <div className="text-center fade-in">
                    <h2 className="text-3xl font-bold">Welcome, Alex!</h2>
                    <p className="text-purple-200 mt-2">Let's unlock your cosmic blueprint.</p>
                </div>
                <div className="mt-10 space-y-6">
                    <div className="fade-in" style={{animationDelay: '0.2s'}}>
                        <label htmlFor="dob" className="block text-sm font-medium text-purple-200">Date of Birth</label>
                        <input type="text" id="dob" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} placeholder="Select Date" className="mt-1 block w-full bg-transparent border-0 border-b-2 border-purple-400 focus:ring-0 focus:border-white transition-colors py-2 placeholder-gray-400"/>
                    </div>
                    <div className="fade-in" style={{animationDelay: '0.4s'}}>
                        <label htmlFor="tob" className="block text-sm font-medium text-purple-200">Time of Birth</label>
                        <input type="text" id="tob" onFocus={(e) => e.target.type='time'} onBlur={(e) => e.target.type='text'} placeholder="Select Time" className="mt-1 block w-full bg-transparent border-0 border-b-2 border-purple-400 focus:ring-0 focus:border-white transition-colors py-2 placeholder-gray-400"/>
                    </div>
                    <div className="fade-in" style={{animationDelay: '0.6s'}}>
                        <label htmlFor="pob" className="block text-sm font-medium text-purple-200">Place of Birth</label>
                        <input type="text" id="pob" placeholder="e.g., San Francisco, CA" className="mt-1 block w-full bg-transparent border-0 border-b-2 border-purple-400 focus:ring-0 focus:border-white transition-colors py-2 placeholder-gray-400"/>
                    </div>
                </div>
                <div className="mt-12 fade-in" style={{animationDelay: '0.8s'}}>
                    <Button onClick={handleGenerateChart} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 h-auto text-base">Generate My Chart</Button>
                </div>
            </Page>

            <Page id="calculating" active={currentPage === 'calculating'} className="celestial-bg flex flex-col justify-center items-center p-6">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"></circle>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" className="calculating-ring" transform="rotate(-90 50 50)"></circle>
                    <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="10" className="fade-in" style={{animationDelay: '0.5s'}}>Astra AI</text>
                </svg>
                <p className="text-purple-200 mt-6 fade-in" style={{animationDelay: '0.8s'}}>Aligning the cosmos...</p>
            </Page>

            {/* ===== Main App Container ===== */}
            <div id="main-app" className={`h-full w-full ${mainAppVisible ? '' : 'invisible'}`}>
                <Page id="today" active={currentPage === 'today'} className="main-content celestial-bg p-6 pt-16">
                    <h1 className="text-3xl font-bold text-white">Good Evening, Alex</h1>
                    <p className="text-purple-200">Here is your cosmic forecast for today.</p>
                    <div className="mt-8 space-y-6">
                        <div className="glass-card p-5 rounded-xl fade-in">
                            <h2 className="font-semibold text-purple-200">Your Daily Affirmation</h2>
                            <p className="text-xl mt-2 text-white">"I embrace change with courage and trust in my journey."</p>
                        </div>
                        <div className="glass-card p-5 rounded-xl fade-in" style={{animationDelay: '0.2s'}}>
                            <h2 className="font-semibold text-purple-200">Key Transits</h2>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center"><span className="text-2xl mr-4">🌙</span><div><p className="font-medium text-white">Moon enters Virgo</p><p className="text-sm text-gray-400">Focus on details and organization.</p></div></div>
                                <div className="flex items-center"><span className="text-2xl mr-4">☿️</span><div><p className="font-medium text-white">Mercury conjunct Jupiter</p><p className="text-sm text-gray-400">A day for big ideas and expansive communication.</p></div></div>
                            </div>
                        </div>
                        <div className="glass-card p-5 rounded-xl fade-in" style={{animationDelay: '0.4s'}}>
                            <h2 className="font-semibold text-purple-200">How are you feeling?</h2>
                            <div className="flex justify-around mt-4">
                                <button className="text-3xl p-2 rounded-full hover:bg-purple-900 transition-colors">😊</button>
                                <button className="text-3xl p-2 rounded-full hover:bg-purple-900 transition-colors">🤔</button>
                                <button className="text-3xl p-2 rounded-full hover:bg-purple-900 transition-colors">😌</button>
                                <button className="text-3xl p-2 rounded-full hover:bg-purple-900 transition-colors">🚀</button>
                            </div>
                        </div>
                    </div>
                </Page>
                <Page id="chat" active={currentPage === 'chat'} className="main-content celestial-bg flex flex-col p-4">
                    <div className="flex-grow overflow-y-auto space-y-6 pt-16 pb-4">
                        <div className="flex justify-start chat-bubble">
                            <div className="bg-gray-700 rounded-2xl rounded-bl-none p-3 max-w-xs shadow-lg"><p className="text-white">Welcome back, Alex! What's on your mind today?</p></div>
                        </div>
                        <div className="flex justify-end chat-bubble" style={{animationDelay: '0.5s'}}>
                            <div className="bg-purple-600 rounded-2xl rounded-br-none p-3 max-w-xs shadow-lg"><p className="text-white">I've been feeling a bit stuck in my career lately.</p></div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 py-2">
                        <div className="flex items-center glass-card rounded-full p-2">
                            <input type="text" placeholder="Ask anything..." className="flex-grow bg-transparent focus:ring-0 border-none text-white placeholder-gray-400 px-3"/>
                            <button className="bg-purple-600 rounded-full p-2.5 ml-2 transition-transform transform hover:scale-110"><ArrowUp className="w-5 h-5"/></button>
                        </div>
                    </div>
                </Page>
                <Page id="chart" active={currentPage === 'chart'} className="main-content celestial-bg p-6 pt-16">
                     <h1 className="text-3xl font-bold text-white">Your Natal Chart</h1>
                    <p className="text-purple-200">An in-depth look at your cosmic DNA.</p>
                    <div className="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center my-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"></circle>
                            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"></circle>
                            <g stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                                <line x1="100" y1="5" x2="100" y2="195"></line>
                                <line x1="5" y1="100" x2="195" y2="100"></line>
                                <line x1="37.5" y1="37.5" x2="162.5" y2="162.5"></line>
                                <line x1="37.5" y1="162.5" x2="162.5" y2="37.5"></line>
                            </g>
                            <text x="100" y="25" fontSize="12" fill="#FBBF24" textAnchor="middle">☀️</text>
                            <text x="175" y="105" fontSize="12" fill="#A78BFA" textAnchor="middle">🌙</text>
                            <text x="60" y="45" fontSize="12" fill="#F472B6" textAnchor="middle">♀</text>
                            <text x="150" y="160" fontSize="12" fill="#F87171" textAnchor="middle">♂</text>
                            <text x="25" y="95" fontSize="12" fill="#60A5FA" textAnchor="middle">☿</text>
                        </svg>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-semibold text-purple-200">Key Placements</h2>
                        <div className="glass-card p-4 rounded-xl flex justify-between items-center"><div><p className="font-bold">Sun in Aries</p><p className="text-sm text-gray-400">Your core identity & ego.</p></div><ChevronRight className="text-gray-400"/></div>
                        <div className="glass-card p-4 rounded-xl flex justify-between items-center"><div><p className="font-bold">Moon in Taurus</p><p className="text-sm text-gray-400">Your emotional nature.</p></div><ChevronRight className="text-gray-400"/></div>
                        <div className="glass-card p-4 rounded-xl flex justify-between items-center"><div><p className="font-bold">Leo Ascendant</p><p className="text-sm text-gray-400">How you appear to others.</p></div><ChevronRight className="text-gray-400"/></div>
                    </div>
                </Page>
                <Page id="explore" active={currentPage === 'explore'} className="main-content celestial-bg p-6 pt-16">
                     <h1 className="text-3xl font-bold text-white">Explore Astrology</h1>
                    <p className="text-purple-200">Deepen your cosmic knowledge.</p>
                    <div className="mt-8 space-y-4">
                        <div className="glass-card rounded-xl overflow-hidden cursor-pointer" onClick={() => navigateTo('explore-details', 'Planets')}>
                            <img src="https://placehold.co/600x300/1a163a/c4b5fd?text=Planets" alt="Planets" className="w-full h-32 object-cover" data-ai-hint="planets space" />
                            <div className="p-4"><h3 className="font-bold text-lg">Understanding the Planets</h3><p className="text-sm text-gray-400 mt-1">Learn about the role of each planet in your chart.</p></div>
                        </div>
                         <div className="glass-card rounded-xl overflow-hidden cursor-pointer" onClick={() => navigateTo('explore-details', 'Signs')}>
                            <img src="https://placehold.co/600x300/1a163a/c4b5fd?text=Signs" alt="Signs" className="w-full h-32 object-cover" data-ai-hint="zodiac signs" />
                            <div className="p-4"><h3 className="font-bold text-lg">The 12 Zodiac Signs</h3><p className="text-sm text-gray-400 mt-1">Discover the unique energy of each sign.</p></div>
                        </div>
                         <div className="glass-card rounded-xl overflow-hidden cursor-pointer" onClick={() => navigateTo('explore-details', 'Houses')}>
                            <img src="https://placehold.co/600x300/1a163a/c4b5fd?text=Houses" alt="Houses" className="w-full h-32 object-cover" data-ai-hint="astrology houses" />
                            <div className="p-4"><h3 className="font-bold text-lg">The 12 Houses</h3><p className="text-sm text-gray-400 mt-1">Explore the different areas of life in your chart.</p></div>
                        </div>
                    </div>
                </Page>
                <Page id="profile" active={currentPage === 'profile'} className="main-content celestial-bg p-6 pt-16">
                    <div className="flex items-center space-x-4">
                        <img src="https://placehold.co/100x100/c4b5fd/0c0a1e?text=A" alt="User Avatar" className="w-20 h-20 rounded-full border-2 border-purple-400" data-ai-hint="avatar placeholder" />
                        <div><h1 className="text-2xl font-bold">Alex Johnson</h1><p className="text-purple-200">alex.j@email.com</p></div>
                    </div>
                    <div className="mt-10 space-y-2">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</h2>
                        <button onClick={() => navigateTo('profile-account')} className="w-full flex items-center justify-between glass-card p-4 rounded-lg"><div className="flex items-center"><User className="mr-3 w-5 h-5 text-purple-300"/><span>Account Details</span></div><ChevronRight/></button>
                        <button onClick={() => navigateTo('profile-notifications')} className="w-full flex items-center justify-between glass-card p-4 rounded-lg"><div className="flex items-center"><Bell className="mr-3 w-5 h-5 text-purple-300"/><span>Notifications</span></div><ChevronRight/></button>
                        <button onClick={() => navigateTo('profile-privacy')} className="w-full flex items-center justify-between glass-card p-4 rounded-lg"><div className="flex items-center"><Shield className="mr-3 w-5 h-5 text-purple-300"/><span>Privacy & Security</span></div><ChevronRight/></button>
                        <button className="w-full flex items-center justify-between glass-card p-4 rounded-lg mt-6"><div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 w-5 h-5 text-red-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><span className="text-red-400">Log Out</span></div></button>
                    </div>
                </Page>
                
                {/* ===== Bottom Navigation Bar ===== */}
                <nav id="nav-bar" className="absolute bottom-0 left-0 right-0 h-20 glass-card rounded-t-2xl flex justify-around items-center">
                    <NavItem page="today" label="Today" icon={Sparkles} currentPage={currentPage} navigate={navigateTo} />
                    <NavItem page="chat" label="AI Chat" icon={MessageCircle} currentPage={currentPage} navigate={navigateTo} />
                    <NavItem page="chart" label="My Chart" icon={PieChart} currentPage={currentPage} navigate={navigateTo} />
                    <NavItem page="explore" label="Explore" icon={Compass} currentPage={currentPage} navigate={navigateTo} />
                    <NavItem page="profile" label="Profile" icon={UserCircle} currentPage={currentPage} navigate={navigateTo} />
                </nav>
            </div>
            
            {/* ===== Sub Pages ===== */}
            <div id="sub-pages" className={`h-full w-full ${subPagesVisible ? '' : 'invisible'}`}>
                 <Page id="profile-account" active={currentPage === 'profile-account'} className="celestial-bg p-6">
                    <button onClick={goBack} className="back-btn absolute top-6 left-6 flex items-center text-purple-300"><ChevronLeft className="w-5 h-5" /> Back</button>
                    <div className="pt-20"><h1 className="text-3xl font-bold">Account Details</h1><p className="text-purple-200 mt-4">Manage your account information.</p></div>
                </Page>
                 <Page id="profile-notifications" active={currentPage === 'profile-notifications'} className="celestial-bg p-6">
                    <button onClick={goBack} className="back-btn absolute top-6 left-6 flex items-center text-purple-300"><ChevronLeft className="w-5 h-5" /> Back</button>
                    <div className="pt-20"><h1 className="text-3xl font-bold">Notifications</h1><p className="text-purple-200 mt-4">Control how you receive updates.</p></div>
                </Page>
                <Page id="profile-privacy" active={currentPage === 'profile-privacy'} className="celestial-bg p-6">
                    <button onClick={goBack} className="back-btn absolute top-6 left-6 flex items-center text-purple-300"><ChevronLeft className="w-5 h-5" /> Back</button>
                    <div className="pt-20"><h1 className="text-3xl font-bold">Privacy & Security</h1><p className="text-purple-200 mt-4">Review your privacy settings.</p></div>
                </Page>
                <Page id="explore-details" active={currentPage === 'explore-details'} className="main-content celestial-bg p-6">
                    <button onClick={goBack} className="back-btn absolute top-6 left-6 flex items-center text-purple-300"><ChevronLeft className="w-5 h-5" /> Back</button>
                    <div className="pt-20">
                        <h1 id="explore-details-title" className="text-3xl font-bold">{exploreContext}</h1>
                        <div id="explore-details-content" className="mt-8 space-y-3">
                            {exploreContext && exploreData[exploreContext]?.items.map(item => (
                                <button key={item} onClick={() => navigateTo('explore-content', item)} className="w-full flex items-center justify-between glass-card p-4 rounded-lg">
                                    <span>{item}</span><ChevronRight/>
                                </button>
                            ))}
                        </div>
                    </div>
                </Page>
                 <Page id="explore-content" active={currentPage === 'explore-content'} className="main-content celestial-bg p-6">
                    <button onClick={goBack} className="back-btn absolute top-6 left-6 flex items-center text-purple-300"><ChevronLeft className="w-5 h-5" /> Back</button>
                    <div className="pt-20">
                        <h1 id="explore-content-title" className="text-3xl font-bold">{exploreContentContext}</h1>
                        <p id="explore-content-body" className="text-purple-200 mt-4">{exploreContentContext && (contentData[exploreContentContext] || "Detailed content coming soon...")}</p>
                    </div>
                </Page>
            </div>
        </div>
    );
}

    