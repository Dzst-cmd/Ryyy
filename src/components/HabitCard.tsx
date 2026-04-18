import React, { useMemo } from 'react';
import { Flame, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';
import { Habit } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface HabitCardProps {
  habit: Habit;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete }) => {
  const weekDays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  
  const todayDateStr = useMemo(() => {
    return new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  }, []);

  const isDoneToday = habit.lastCompletedDate === todayDateStr;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-white p-5 rounded-[24px] border border-slate shadow-sm flex flex-col gap-4 overflow-hidden relative transition-all"
    >
      {/* Delete button (visible on hover) */}
      <AnimatePresence>
        {onDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onDelete(habit.id)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 active:scale-95"
          >
            <Trash2 size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center w-full relative z-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggle && onToggle(habit.id)}
            disabled={!onToggle}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 transition-all active:scale-90",
              isDoneToday ? "bg-success border-success text-white shadow-lg shadow-success/20" : "bg-slate border-transparent active:border-primary",
              !onToggle && "cursor-default"
            )}
          >
            {isDoneToday ? <CheckCircle2 size={24} /> : habit.icon}
          </button>
          <div>
            <h3 className={cn("font-bold text-sm leading-tight transition-all", isDoneToday && "text-success")}>
              {habit.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] text-zinc-400 font-medium">سلسلة لـ {habit.streak} أيام</p>
               {habit.reminderTime && (
                 <span className="flex items-center gap-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold">
                   <Clock size={10} /> {habit.reminderTime}
                 </span>
               )}
            </div>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full transition-all",
          habit.streak > 0 ? "bg-warning/10 text-warning" : "bg-slate text-zinc-400"
        )}>
          <Flame size={14} className={habit.streak > 0 ? "fill-warning" : "fill-zinc-400"} />
          <span className="text-xs font-black">{habit.streak}</span>
        </div>
      </div>

      <div className="flex justify-between gap-1 mt-2">
        {weekDays.map((day, idx) => {
          const isCompleted = habit.completedDays.includes(idx);
          // Highlight today 
          const isToday = new Date().getDay() === idx;
          
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 relative z-10">
              <div className={cn(
                "w-full h-8 rounded-lg flex items-center justify-center transition-all",
                isCompleted 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : isToday ? "bg-primary/10 border border-primary/20 text-primary" : "bg-slate text-zinc-300"
              )}>
                {isCompleted && <span className="text-[10px] font-bold">✓</span>}
              </div>
              <span className={cn("text-[10px] font-bold", isToday ? "text-primary" : "text-zinc-400")}>{day}</span>
            </div>
          );
        })}
      </div>
      
      {/* Background Decor */}
      <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-10", habit.color?.replace('text-', 'bg-') || 'bg-primary')} />
    </motion.div>
  );
}
