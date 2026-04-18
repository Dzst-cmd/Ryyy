import { useState, useMemo } from 'react';
import { Search, Bell, SlidersHorizontal, ArrowRight, X, Plus, Minus, Trash2, Heart, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from './data';
import { Product, CartItem, StoreCategory } from './types';
import { formatPrice, cn } from './lib/utils';
import { ProductCard } from './components/ProductCard';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('الكل');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: StoreCategory[] = ['الكل', 'إلكترونيات', 'أزياء', 'منزل', 'جمال'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      const matchesSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-white pb-24 text-right" dir="rtl">
      {/* Search Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col gap-4 z-40">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-primary">الرواد</span>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 active:scale-95 transition-all">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 active:scale-95 transition-all">
              <Bell size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="w-full bg-zinc-100/80 rounded-2xl py-3 px-4 text-xs text-zinc-400 flex justify-between items-center cursor-pointer border border-zinc-200">
            <span>ابحث عن منتجك المفضل...</span>
            <Search size={16} />
          </div>
        </div>
      </header>

      <main className="px-6">
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {/* Bento Hero Card */}
            <section className="col-span-2">
              <div className="relative h-40 rounded-[28px] overflow-hidden bg-gradient-to-br from-primary to-accent p-6 flex flex-col justify-between shadow-lg shadow-primary/20">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">تنزيلات الشتاء</h2>
                  <p className="text-[10px] text-white/80 font-medium">خصم يصل إلى ٥٠٪ على الملابس</p>
                </div>
                <button className="self-end bg-white text-primary px-4 py-2 rounded-full text-[10px] font-black active:scale-95 transition-all">
                  تسوق الآن
                </button>
              </div>
            </section>

            {/* Bento Categories */}
            {categories.slice(1, 4).map((cat, idx) => (
              <div 
                key={cat} 
                className={cn(
                  "rounded-[24px] p-4 flex flex-col justify-center items-center gap-2 border border-zinc-200 transition-all cursor-pointer",
                  idx === 0 ? "bg-zinc-50" : "bg-white",
                  idx === 2 ? "col-span-2 h-20 flex-row justify-between px-8" : "h-32"
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg border border-zinc-100">
                  {cat === 'إلكترونيات' ? '🎧' : cat === 'أزياء' ? '👕' : '🏠'}
                </div>
                <span className="font-bold text-xs">{cat}</span>
              </div>
            ))}

            {/* Bento Products */}
            <div className="col-span-2 flex items-center justify-between mt-4 mb-2 px-1">
              <h3 className="font-bold text-sm text-zinc-800">منتجات مختارة</h3>
              <span className="text-[10px] text-primary font-bold">مشاهدة الكل</span>
            </div>
            
            {filteredProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={addToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="pt-4 grid grid-cols-2 gap-3">
             <h2 className="col-span-2 font-black text-xl mb-2 text-primary">الأقسام</h2>
             {categories.slice(1).map((cat, idx) => (
                <div 
                  key={cat} 
                  onClick={() => { setSelectedCategory(cat); setActiveTab('home'); }}
                  className={cn(
                    "rounded-[24px] p-6 border border-zinc-200 flex flex-col gap-4 transition-all active:scale-95",
                    idx % 3 === 0 ? "col-span-2 bg-zinc-900 text-white border-none" : "bg-white"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/10">
                    {cat === 'إلكترونيات' ? '💻' : cat === 'أزياء' ? '👔' : cat === 'منزل' ? '🛋️' : '✨'}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-none mb-1">{cat}</h3>
                    <p className={cn("text-[10px] opacity-60", idx % 3 === 0 ? "text-blue-200" : "text-zinc-400")}>استكشف أحدث منتجات {cat}</p>
                  </div>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="pt-4 flex flex-col gap-4">
            <h2 className="font-black text-xl text-primary mb-2">سلة المشتريات</h2>
            {cart.length === 0 ? (
              <div className="bg-zinc-50 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 text-center border border-zinc-200 border-dashed">
                <ShoppingBag size={48} className="text-zinc-300" />
                <p className="text-zinc-500 font-bold text-sm">سلتك لا تزال فارغة</p>
                <button onClick={() => setActiveTab('home')} className="bg-primary text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20">ابدأ التسوق</button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-[24px] p-4 border border-zinc-200 flex gap-4 transition-all">
                    <div className="w-20 h-20 rounded-2xl bg-zinc-50 overflow-hidden border border-zinc-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xs leading-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-primary font-black text-xs">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center active:bg-zinc-100"><Minus size={10} /></button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-primary text-white shadow-sm flex items-center justify-center active:bg-blue-700"><Plus size={10} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-zinc-900 rounded-[32px] p-6 text-white mt-4">
                   <div className="flex justify-between mb-2 opacity-60 text-xs">
                     <span>المجموع الفرعي</span>
                     <span>{formatPrice(cartTotal)}</span>
                   </div>
                   <div className="flex justify-between mb-4 opacity-60 text-xs">
                     <span>التوصيل</span>
                     <span className="text-blue-400">مجاني</span>
                   </div>
                   <div className="h-px bg-white/10 mb-4" />
                   <div className="flex justify-between mb-6">
                     <span className="font-bold">الإجمالي</span>
                     <span className="font-black text-xl">{formatPrice(cartTotal)}</span>
                   </div>
                   <button className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">إتمام الطلب</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="pt-4 flex flex-col gap-3">
             <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-200 flex flex-col items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white shadow-lg">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-lg">محمد الرواد</h3>
                  <p className="text-[10px] text-zinc-400 font-medium">alrowad@example.com</p>
                </div>
             </div>
             {[
               { icon: ShoppingBag, label: 'مشترياتي', color: 'bg-blue-50 text-blue-500' },
               { icon: Heart, label: 'قائمة الرغبات', color: 'bg-red-50 text-red-500' },
               { icon: Bell, label: 'الإشعارات', color: 'bg-orange-50 text-orange-500' },
               { icon: User, label: 'إعدادات الحساب', color: 'bg-zinc-100 text-zinc-500' },
             ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-4 border border-zinc-200 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-zinc-300 transform rotate-180" />
                </div>
             ))}
             <button className="w-full py-4 mt-4 font-bold text-sm text-red-500 bg-red-50 rounded-[24px]">تسجيل الخروج</button>
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-3xl overflow-hidden h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="relative aspect-video sm:aspect-square">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <span className="bg-white px-3 py-1 rounded-full text-zinc-900 text-xs font-bold shadow-lg">New</span>
                  <span className="bg-accent px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">Trending</span>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-primary leading-tight mb-2">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-2">
                       <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} className={cn(i <= Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-200")} />
                          ))}
                       </div>
                       <span className="text-xs text-zinc-400 font-bold">{selectedProduct.rating} ({selectedProduct.reviewsCount} تقييم)</span>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-accent">{formatPrice(selectedProduct.price)}</p>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4 mb-6 border border-zinc-100">
                  <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">الوصف</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {selectedProduct.description} يوفر لك هذا المنتج أعلى معايير الجودة والراحة، مصمم خصيصاً ليتوافق مع أسلوب حياتك العصري.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="w-14 h-14 rounded-2xl border border-zinc-200 flex items-center justify-center text-zinc-400 active:text-red-500 active:border-red-100 transition-colors">
                    <Heart size={24} />
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-zinc-200 active:scale-95 transition-all"
                  >
                    أضف إلى السلة
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItemsCount={cart.reduce((s, i) => s + i.quantity, 0)} 
      />
    </div>
  );
}

function ShoppingBag(props: any) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

