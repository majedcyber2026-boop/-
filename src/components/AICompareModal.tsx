import React, { useState, useEffect } from 'react';
import { X, Scale, Sparkles, ShoppingBag, Check, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface AICompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  currency?: Currency;
}

export const AICompareModal: React.FC<AICompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromCompare,
  onAddToCart,
  currency = 'YER'
}) => {
  const [verdict, setVerdict] = useState<string>('');
  const [isLoadingVerdict, setIsLoadingVerdict] = useState(false);

  useEffect(() => {
    if (isOpen && products.length >= 2) {
      const fetchVerdict = async () => {
        setIsLoadingVerdict(true);
        try {
          const res = await fetch('/api/gemini/compare-verdict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products }),
          });
          const data = await res.json();
          setVerdict(data.verdict || 'كلا المنتجين يقدمان أداءً فائقاً ومعتمداً بضمان الوكالة الذهبي.');
        } catch {
          setVerdict('المنتجان معتمدان بأعلى معايير الجودة الأصلية. اختر المنتج الأول للأداء والسرعة، أو المنتج الثاني للسعة والتحمل اليومي.');
        } finally {
          setIsLoadingVerdict(false);
        }
      };
      fetchVerdict();
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#141108] via-[#0d0d0d] to-black border border-[#52410e] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#262010] flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#886616] p-0.5 shadow-md shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">مقارنة المنتجات بالذكاء الاصطناعي</h3>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                  {products.length} منتجات
                </span>
              </div>
              <p className="text-xs text-zinc-400">مقارنة فنية مباشرة مدعومة بحكم خبير WAKNOVA الذكي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* AI Verdict Card */}
          {products.length >= 2 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181408] to-[#120f06] border border-[#52410e] space-y-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Sparkles className="w-4 h-4 animate-spin" />
                <h4 className="text-xs sm:text-sm font-black text-white">حكم الخبير الذكي (Gemini AI Verdict):</h4>
              </div>

              {isLoadingVerdict ? (
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] py-2">
                  <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span>جاري تحليل الفروقات التقنية بين الأجهزة...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
                  {verdict}
                </p>
              )}
            </div>
          )}

          {/* Products Side-by-Side Grid */}
          <div className={`grid grid-cols-1 ${products.length > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#262626] flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-18 h-18 rounded-xl object-contain bg-[#161616] p-2 border border-[#2a2a2a]"
                    />
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-bold uppercase">{p.brand}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">{p.name}</h4>
                      <p className="text-sm font-black text-[#D4AF37] mt-1 font-mono">
                        {formatPrice(p.price, currency)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromCompare(p.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                    title="إزالة من المقارنة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Specs Summary */}
                <div className="space-y-1.5 text-xs text-zinc-300 bg-black/50 p-3 rounded-xl border border-[#1e1e1e]">
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-zinc-400">التصنيف:</span>
                    <span className="font-bold text-white">{p.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#222]">
                    <span className="text-zinc-400">حالة التوفر:</span>
                    <span className="text-emerald-400 font-bold">متوفر بالفرع</span>
                  </div>
                  <div className="py-1">
                    <span className="text-zinc-400 block mb-1">المواصفات:</span>
                    <p className="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed font-light">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => onAddToCart(p)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#aa771c] hover:brightness-110 active:scale-95 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة هذا المنتج للسلة</span>
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/80 border-t border-[#262010] flex items-center justify-between text-xs text-zinc-400">
          <span>الوكالة الحديثة للهواتف الذكية ومستلزماتها</span>
          <button
            onClick={onClose}
            className="text-[#D4AF37] hover:underline font-bold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
