import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Calendar, Target, Award, MoreVertical, PlusCircle, Settings, LogOut, ChevronLeft, X, Edit2, Bell, Shield, Trophy, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialTasks, initialHabits, categories } from './data';
import { Task, Habit, Priority } from './types';
import { cn } from './lib/utils';
import { TaskCard } from './components/TaskCard';
import { HabitCard } from './components/HabitCard';
import { BottomNav } from './components/BottomNav';
import { scheduleLocalNotification, cancelLocalNotification } from './lib/notifications';

interface UserProfile {
  name: string;
  email: string;
  points: number;
  level: number;
  avatar: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<UserProfile>({
    name: 'محمد الرواد',
    email: 'm.alrowad@example.com',
    points: 450,
    level: 4,
    avatar: 'https://picsum.photos/seed/user123/400/400'
  });

  // UI States
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // New Task States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('متوسطة');
  const [newTaskCategory, setNewTaskCategory] = useState('شخصي');
  const [newTaskReminder, setNewTaskReminder] = useState('');

  // New Habit States
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🌟');
  const [newHabitReminder, setNewHabitReminder] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('enjaz_tasks');
    const savedHabits = localStorage.getItem('enjaz_habits');
    const savedUser = localStorage.getItem('enjaz_user');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else setTasks(initialTasks);

    if (savedHabits) setHabits(JSON.parse(savedHabits));
    else setHabits(initialHabits);

    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('enjaz_tasks', JSON.stringify(tasks));
    if (habits.length > 0) localStorage.setItem('enjaz_habits', JSON.stringify(habits));
    localStorage.setItem('enjaz_user', JSON.stringify(user));
  }, [tasks, habits, user]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
       if (t.id === id) {
          if (!t.isCompleted && t.reminderTime) cancelLocalNotification(t.id);
          return { ...t, isCompleted: !t.isCompleted };
       }
       return t;
    }));
  };

  const deleteTask = (id: string) => {
    cancelLocalNotification(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      isCompleted: false,
      category: newTaskCategory,
      priority: newTaskPriority,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      reminderTime: newTaskReminder || undefined
    };

    if (newTaskReminder) {
      scheduleLocalNotification(newTask.id, newTask.title, 'لا تنسى مهمتك!', newTaskReminder);
    }

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskReminder('');
    setShowAddTask(false);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toLocaleDateString('en-CA');
    const todayDayIndex = new Date().getDay();

    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = h.lastCompletedDate === today;
        let newCompletedDays = [...h.completedDays];
        
        if (isDone) {
          newCompletedDays = newCompletedDays.filter(d => d !== todayDayIndex);
        } else {
          if (!newCompletedDays.includes(todayDayIndex)) {
             newCompletedDays.push(todayDayIndex);
          }
        }

        return {
           ...h,
           lastCompletedDate: isDone ? undefined : today,
           streak: isDone ? Math.max(0, h.streak - 1) : h.streak + 1,
           completedDays: newCompletedDays
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    cancelLocalNotification(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addNewHabit = () => {
    if (!newHabitTitle.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle,
      icon: newHabitIcon,
      streak: 0,
      completedDays: [],
      color: 'text-primary',
      reminderTime: newHabitReminder || undefined
    };

    if (newHabitReminder) {
      scheduleLocalNotification(newHabit.id, newHabit.title, 'حان وقت العادة اليومية!', newHabitReminder);
    }

    setHabits(prev => [newHabit, ...prev]);
    setNewHabitTitle('');
    setNewHabitReminder('');
    setShowAddHabit(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesCategory = selectedCategory === 'الكل' || t.category === selectedCategory;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tasks, selectedCategory, searchQuery]);

  const completedTasksCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const progressPercent = Math.round((completedTasksCount / (tasks.length || 1)) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate pb-28 text-right font-sans" dir="rtl">
      {/* Search Bar / Header */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 bg-slate/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-indigo-500/10 flex items-center justify-center border-2 border-white overflow-hidden active:scale-90 transition-transform"
          >
            <img src={user.avatar} alt="Avatar" referrerPolicy="no-referrer" />
          </button>
          <div>
            <h1 className="text-xl font-black text-zinc-900 leading-none mb-1">حمداً لله على سلامتك!</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">اليوم هو السبت، 18 أبريل</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSearch(true)}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 active:scale-95 transition-all"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-600 active:scale-95 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 flex flex-col gap-6">
        {activeTab === 'dashboard' && (
          <>
            {/* Motivation Quote */}
            <div className="bg-white/50 border border-indigo-100 p-4 rounded-3xl">
              <p className="text-sm font-medium italic text-indigo-900/70 leading-relaxed text-center">
                "النجاح هو مجموع الجهود الصغيرة التي تتكرر يوماً بعد يوم."
              </p>
            </div>

            {/* Progress Card */}
            <section onClick={() => setActiveTab('tasks')} className="cursor-pointer group">
              <div className="bg-primary p-6 rounded-[32px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden transition-transform group-hover:scale-[1.02]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest">إحصائيات اليوم</p>
                    <Target size={16} className="opacity-60" />
                  </div>
                  <h2 className="text-2xl font-black mb-6">لقد أنجزت {progressPercent}%<br />من خطتك اليومية!</h2>
                  
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="bg-white h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold opacity-80">
                    <span>{completedTasksCount} مهام مكتملة</span>
                    <span>{tasks.length} مهام جارية</span>
                  </div>
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl opacity-50" />
              </div>
            </section>

            {/* Quick Actions/Stats */}
            <section className="grid grid-cols-2 gap-3">
              <div onClick={() => setActiveTab('tasks')} className="cursor-pointer bg-white p-5 rounded-[28px] border border-slate flex flex-col gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Target size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">المهام</p>
                  <p className="text-lg font-black">{tasks.length} مفتوحة</p>
                </div>
              </div>
              <div onClick={() => setActiveTab('habits')} className="cursor-pointer bg-white p-5 rounded-[28px] border border-slate flex flex-col gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">العادات</p>
                  <p className="text-lg font-black">{habits.length} نشطة</p>
                </div>
              </div>
            </section>

            {/* Up Next Section */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-lg tracking-tight">مهامك القادمة</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-xs font-bold text-primary flex items-center gap-1">عرض الكل <ChevronLeft size={14} /></button>
              </div>
              <div className="flex flex-col gap-3">
                {tasks.filter(t => !t.isCompleted).slice(0, 2).map(task => (
                  <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
                {tasks.filter(t => !t.isCompleted).length === 0 && (
                  <div className="bg-white/50 border border-dashed border-slate p-6 rounded-3xl text-center text-zinc-400 text-xs font-medium">
                    رائع! لا توجد مهام متبقية حالياً.
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'tasks' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">إدارة المهام</h2>
              <div className="flex gap-2">
                 <button onClick={() => setShowSearch(true)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-slate shadow-sm active:bg-slate transition-colors"><Search size={18} /></button>
                 <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-slate shadow-sm active:bg-slate transition-colors"><Calendar size={18} /></button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear">
              <button 
                onClick={() => setSelectedCategory('الكل')}
                className={cn(
                  "px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg whitespace-nowrap",
                  selectedCategory === 'الكل' ? "bg-zinc-900 text-white shadow-zinc-900/20" : "bg-white text-zinc-500 border border-slate"
                )}
              >
                الكل
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border",
                    selectedCategory === cat.name ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 border-zinc-900" : "bg-white text-zinc-500 border-slate"
                  )}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl opacity-20">📂</div>
                    <p className="text-zinc-400 font-bold">لا توجد مهام في هذا القسم</p>
                  </motion.div>
                ) : (
                  filteredTasks.map(task => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                      <TaskCard task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) }
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setShowAddTask(true)}
              className="fixed bottom-24 left-6 right-6 bg-zinc-900 text-white py-4 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-zinc-900/40 active:scale-95 transition-all z-20"
            >
              <PlusCircle size={24} /> إضافة مهمة جديدة
            </button>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">العادات اليومية</h2>
              <button 
                onClick={() => setShowAddHabit(true)}
                className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
              >
                <Plus size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} onDelete={deleteHabit} />
              ))}
              {habits.length === 0 && (
                <div className="text-center py-10 text-zinc-400">لا توجد عادات مسجلة حالياً</div>
              )}
            </div>

            <div className="mt-4 p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/10">
                 <Zap size={28} />
               </div>
               <div>
                 <h4 className="font-bold text-indigo-900 mb-1 leading-tight">استمر في التقدم!</h4>
                 <p className="text-[10px] text-indigo-600/80 font-medium leading-relaxed">أنت تبلي بلاءً حسناً اليوم لبناء عادات قوية! الاستمرار هو مفتاح النجاح.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6">
             {/* Profile Main Card */}
             <div className="bg-white p-8 rounded-[44px] border border-slate flex flex-col items-center gap-6 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="relative">
                  <div className="w-28 h-28 rounded-[36px] bg-slate border-4 border-white overflow-hidden shadow-2xl shadow-indigo-500/20">
                     <img src={user.avatar} alt="Avatar" referrerPolicy="no-referrer" />
                  </div>
                  <button onClick={() => setShowSettings(true)} className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 text-white border-4 border-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Edit2 size={16} />
                  </button>
                </div>
                <div>
                   <h2 className="text-2xl font-black mb-1">{user.name}</h2>
                   <div className="flex items-center gap-2 justify-center">
                     <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider">مستوى {user.level}</span>
                     <span className="text-xs text-zinc-300 font-bold">•</span>
                     <span className="text-xs text-zinc-400 font-bold">{user.email}</span>
                   </div>
                </div>
                <div className="flex gap-4 w-full pt-4 border-t border-slate">
                   <div className="flex-1">
                      <p className="text-[10px] text-zinc-400 font-bold mb-1 uppercase tracking-widest">المهمات</p>
                      <p className="text-2xl font-black text-indigo-600">{completedTasksCount}</p>
                   </div>
                   <div className="w-px h-8 bg-slate self-center" />
                   <div className="flex-1">
                      <p className="text-[10px] text-zinc-400 font-bold mb-1 uppercase tracking-widest">النقاط</p>
                      <p className="text-2xl font-black text-orange-500">{user.points}</p>
                   </div>
                </div>
             </div>

             {/* Functional Menu */}
             <div className="flex flex-col gap-3">
               {[
                 { label: 'إحصائيات التقدم', icon: Trophy, sub: 'بطل العادات، مراقب المهام', action: () => setActiveTab('dashboard') },
                 { label: 'الأمان والخصوصية', icon: Shield, sub: 'كلمة المرور، البيانات المحلية', action: () => setShowSettings(true) },
                 { label: 'طرق الدفع', icon: CreditCard, sub: 'الاشتراك المميز (قريباً)', action: () => {} },
                 { label: 'الإشعارات', icon: Bell, sub: 'تذكير المهام والعادات', action: () => setShowSettings(true) },
                 { label: 'تسجيل الخروج', icon: LogOut, sub: 'سيتم مسح البيانات المحلية', danger: true, action: handleLogout },
               ].map((item, idx) => {
                 const Icon = item.icon;
                 return (
                   <div 
                    key={idx} 
                    onClick={item.action}
                    className="bg-white p-5 rounded-[28px] border border-slate flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate/30 transition-all active:scale-98"
                   >
                     <div className="flex items-center gap-4">
                       <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center", 
                          item.danger ? "bg-red-50 text-red-500" : "bg-slate text-zinc-500"
                        )}>
                         <Icon size={22} strokeWidth={2.5} />
                       </div>
                       <div>
                         <h3 className={cn("font-bold text-sm", item.danger && "text-red-500")}>{item.label}</h3>
                         <p className="text-[10px] text-zinc-400 font-medium">{item.sub}</p>
                       </div>
                     </div>
                     <ChevronRight size={18} className="text-zinc-300" />
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </main>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate/95 backdrop-blur-xl p-6 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="ابحث عن مهامك..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-3xl py-4 px-6 pr-12 text-sm font-bold shadow-2xl shadow-indigo-500/5 focus:ring-0 border-none"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              </div>
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-500 shadow-sm"><X size={20} /></button>
            </div>
            
            <div className="flex flex-col gap-4">
               <p className="text-[10px] font-black text-zinc-400 px-2 uppercase tracking-widest">النتائج</p>
               {searchQuery.length > 0 ? (
                 filteredTasks.length > 0 ? (
                   filteredTasks.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />)
                 ) : (
                   <p className="text-center py-10 text-zinc-400 text-sm">لا توجد نتائج مطابقة</p>
                 )
               ) : (
                 <p className="text-center py-10 text-zinc-400 text-sm italic">ابدأ الكتابة للبحث...</p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-[44px] p-8 pb-10 shadow-2xl relative">
              <div className="w-12 h-1 bg-slate rounded-full mx-auto mb-6 opacity-50" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">إعدادات الحساب</h3>
                <button onClick={() => setShowSettings(false)} className="w-10 h-10 rounded-full bg-slate flex items-center justify-center text-zinc-400"><X size={20} /></button>
              </div>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1">الاسم المستعار</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => setUser(p => ({...p, name: e.target.value}))}
                    className="w-full bg-slate border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    onChange={(e) => setUser(p => ({...p, email: e.target.value}))}
                    className="w-full bg-slate border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Target className="text-primary" />
                     <span className="text-xs font-bold text-indigo-900 leading-none">الإشعارات اليومية</span>
                   </div>
                   <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
                   </div>
                </div>
                <button onClick={() => setShowSettings(false)} className="w-full bg-zinc-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-zinc-900/20 active:scale-95 transition-all">حفظ التغييرات</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center p-0"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddTask(false)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white w-full rounded-t-[40px] p-8 pb-12 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة مهمة جديدة</h3>
                <button onClick={() => setShowAddTask(false)} className="w-10 h-10 rounded-full bg-slate flex items-center justify-center text-zinc-400"><X size={20} /></button>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">عنوان المهمة</label>
                  <input 
                    type="text" 
                    placeholder="ماذا تود أن تنجز اليوم؟"
                    className="w-full bg-slate border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">الأولوية</label>
                    <div className="flex gap-2">
                      {(['عالية', 'متوسطة', 'منخفضة'] as Priority[]).map(p => (
                        <button
                          key={p}
                          onClick={() => setNewTaskPriority(p)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2",
                            newTaskPriority === p ? "bg-primary text-white border-primary" : "bg-white border-slate text-zinc-400"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">تنبيه (اختياري)</label>
                     <input 
                       type="time" 
                       value={newTaskReminder}
                       onChange={(e) => setNewTaskReminder(e.target.value)}
                       className="w-full bg-slate border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all text-center"
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">القسم</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewTaskCategory(cat.name)}
                        className={cn(
                          "py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border-2",
                          newTaskCategory === cat.name ? "bg-slate border-primary text-primary" : "bg-white border-slate text-zinc-400"
                        )}
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={addNewTask}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  حفظ المهمة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddHabit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center p-0"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddHabit(false)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white w-full rounded-t-[40px] p-8 pb-12 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة عادة للروتين</h3>
                <button onClick={() => setShowAddHabit(false)} className="w-10 h-10 rounded-full bg-slate flex items-center justify-center text-zinc-400"><X size={20} /></button>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">اسم العادة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: القراءة لمدة 20 دقيقة"
                    className="w-full bg-slate border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">أيقونة (إيموجي)</label>
                    <input 
                       type="text" 
                       value={newHabitIcon}
                       onChange={(e) => setNewHabitIcon(e.target.value)}
                       className="w-full bg-slate border-none rounded-2xl py-3 px-4 text-center text-xl focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-400 mb-2 mr-1 uppercase tracking-wider">تذكير يومي (اختياري)</label>
                     <input 
                       type="time" 
                       value={newHabitReminder}
                       onChange={(e) => setNewHabitReminder(e.target.value)}
                       className="w-full bg-slate border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all text-center"
                     />
                  </div>
                </div>

                <button 
                  onClick={addNewHabit}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  بدء العادة الجديدة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

