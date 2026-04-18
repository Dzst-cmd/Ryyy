export type Priority = 'منخفضة' | 'متوسطة' | 'عالية';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  category: string;
  priority: Priority;
  time?: string; // Time string for display
  reminderTime?: string; // Specific time for notifications e.g. "14:30"
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  streak: number;
  completedDays: number[]; // 0-6 represent Sunday-Saturday
  color: string;
  lastCompletedDate?: string; // YYYY-MM-DD to easily check if done today
  reminderTime?: string; // Notification reminder for this habit
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
