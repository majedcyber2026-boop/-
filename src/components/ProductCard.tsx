import React from 'react';
import { ShoppingBag, Heart, Star, Eye, Scale, Check, Zap } from 'lucide-react';
import { Product } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  onOpenDetails: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isComparing?: boolean;
  currency?: Currency;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onOpenDetails,
  onToggleCompare,
  isComparing = false,
  currency = 'YER'
}) => {
  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="group relative bg-[#0b0b0b] border border-[#1f1f1f] hover:border-[#D4AF37]/60 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 flex flex-col justify-between">
      
      {/* Top Floating Action Pill (Quiet & Uncluttered) */}
      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
        
        {/* Subtle Editorial Status */}
        <div className="pointer-events-auto">
          {product.isNew ? (
            <span className="text-[10px] font-black text-black bg-[#D4AF37] px-2 py-0.5 rounded-full shadow-sm font-mono tracking-wider">
              NEW
            </span>
          ) : product.onSale ? (
            <span className="text-[10px] font-black text-black bg-emerald-400 px-2 py-0.5 rounded-full shadow-sm font-mono tracking-wider">
              SALE
            </span>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                isComparing
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/30'
                  : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
              }`}
              title="مقارنة بالذكاء الاصطناعي"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
              isFavorite
                ? 'bg-red-500/20 text-red-500 border border-red-500/40'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
            }`}
            title="أضف للمفضلة"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image Showcase */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-square w-full bg-gradient-to-b from-[#141414] to-[#0e0e0e] overflow-hidden cursor-pointer p-5 flex items-center justify-center group-hover:bg-[#161616] transition-colors"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500 drop-shadow-xl"
          loading="lazy"
        />

        {/* Subtle Quick Specs Reveal */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>عرض المواصفات الكاملة</span>
          </span>
        </div>
      </div>

      {/* Product Details & Typography */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Metadata Row: Clean Unboxed Editorial (Zero-Pill Rule) */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <span className="text-[#D4AF37] font-black tracking-wider uppercase font-mono">
                {product.brand}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">{product.category}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-mono">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-zinc-300">{product.rating || 4.9}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-white font-bold text-xs sm:text-sm line-clamp-2 hover:text-[#D4AF37] cursor-pointer transition leading-snug"
          >
            {product.name}
          </h3>

          {/* Availability State */}
          <div className="pt-0.5 text-[11px]">
            {isOutOfStock ? (
              <span className="text-red-400/90 font-medium">غير متوفر حالياً</span>
            ) : (
              <span className="text-emerald-400/90 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>متوفر ({product.quantity} قطع بالفرع)</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Purchase Action Bar */}
        <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
              {formatPrice(product.price, currency)}
            </div>
            {product.oldPrice && (
              <div className="text-[10px] text-zinc-500 line-through font-mono">
                {formatPrice(product.oldPrice, currency)}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#b88c22] hover:brightness-110 active:scale-95 text-black shadow-md shadow-[#D4AF37]/20'
            }`}
            title="أضف إلى السلة"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-black" />
            <span>شراء</span>
          </button>
        </div>

      </div>

    </div>
  );
};
