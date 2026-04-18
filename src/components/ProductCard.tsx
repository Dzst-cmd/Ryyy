import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-zinc-50 rounded-[24px] p-4 flex flex-col justify-between border border-zinc-200 group cursor-pointer hover:bg-white transition-all transform hover:-translate-y-1"
      onClick={() => onViewDetails(product)}
    >
      <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-3 border border-zinc-100 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <h3 className="font-bold text-xs text-zinc-800 mb-1 leading-tight">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-primary font-bold text-xs">{formatPrice(product.price)}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-8 h-8 bg-white border border-zinc-200 rounded-lg shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform hover:bg-primary hover:text-white"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
