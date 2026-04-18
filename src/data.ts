import { Task, Habit, Category } from './types';

export const categories: Category[] = [
  { id: '1', name: 'العمل', icon: '💼', color: 'bg-blue-500' },
  { id: '2', name: 'الصحة', icon: '🍎', color: 'bg-green-500' },
  { id: '3', name: 'شخصي', icon: '👤', color: 'bg-purple-500' },
  { id: '4', name: 'دراسة', icon: '📚', color: 'bg-orange-500' },
];

export const initialTasks: Task[] = [
  { id: 't1', title: 'تحضير عرض المشروع', isCompleted: false, category: 'العمل', priority: 'عالية', time: '09:00 ص' },
  { id: 't2', title: 'ممارسة رياضة المشي', isCompleted: true, category: 'الصحة', priority: 'متوسطة', time: '07:30 ص' },
  { id: 't3', title: 'قراءة فصل من كتاب', isCompleted: false, category: 'شخصي', priority: 'منخفضة', time: '10:00 م' },
  { id: 't4', title: 'مراجعة دروس البرمجة', isCompleted: false, category: 'دراسة', priority: 'عالية', time: '04:00 م' },
];

export const initialHabits: Habit[] = [
  { id: 'h1', title: 'شرب الماء', icon: '💧', streak: 5, completedDays: [1, 2, 3, 4, 5], color: 'text-blue-500' },
  { id: 'h2', title: 'التأمل', icon: '🧘', streak: 12, completedDays: [0, 1, 2, 3, 5, 6], color: 'text-purple-500' },
  { id: 'h3', title: 'النوم المبكر', icon: '🌙', streak: 3, completedDays: [4, 5, 6], color: 'text-indigo-500' },
];
