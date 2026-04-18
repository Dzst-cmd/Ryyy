import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemsCount: number;
}

export function BottomNav({ activeTab, setActiveTab, cartItemsCount }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'categories', icon: Grid, label: 'الأقسام' },
    { id: 'cart', icon: ShoppingBag, label: 'السلة', badge: cartItemsCount },
    { id: 'profile', icon: User, label: 'حسابي' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-2 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 relative transition-all duration-300",
              isActive ? "text-accent scale-110" : "text-zinc-400"
            )}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={cn("text-[10px] font-medium transition-all", isActive ? "opacity-100" : "opacity-70")}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
