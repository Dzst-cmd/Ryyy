import React from 'react';
import { LayoutDashboard, CheckSquare, Zap, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
    { id: 'tasks', icon: CheckSquare, label: 'المهام' },
    { id: 'habits', icon: Zap, label: 'العادات' },
    { id: 'profile', icon: User, label: 'الملف' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate px-6 py-3 flex justify-between items-center z-50 rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2 transition-all duration-300 relative",
              isActive ? "text-primary scale-110" : "text-zinc-400"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={cn("text-[10px] font-bold transition-all", isActive ? "opacity-100" : "opacity-70")}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
