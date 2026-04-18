import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const priorityColor = {
    'عالية': 'text-danger bg-danger/10',
    'متوسطة': 'text-warning bg-warning/10',
    'منخفضة': 'text-success bg-success/10',
  }[task.priority];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group p-4 bg-white rounded-2xl border border-slate flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-primary/20",
        task.isCompleted && "bg-slate/50 opacity-60"
      )}
    >
      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-6 h-6 rounded-full transition-all flex items-center justify-center shrink-0 border-2",
          task.isCompleted 
            ? "bg-success border-success text-white" 
            : "border-slate group-hover:border-primary"
        )}
      >
        {task.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-transparent" />}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-bold text-sm tracking-tight truncate mb-1",
          task.isCompleted && "line-through text-zinc-400"
        )}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", priorityColor)}>
            {task.priority}
          </span>
          {task.time && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
              <Clock size={10} />
              <span>{task.time}</span>
            </div>
          )}
        </div>
      </div>

      {onDelete && (
        <button 
          onClick={() => onDelete(task.id)}
          className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
        >
          🗑️
        </button>
      )}
    </motion.div>
  );
}
