import React, { useState, useEffect } from 'react';
import { X, Check, ArrowLeft, ShoppingBag, Sparkles, Bot } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsToCompare: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  productsToCompare,
  onRemoveFromCompare,
  onAddToCart
}) => {
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isLoadingVerdict, setIsLoadingVerdict] = useState(false);

  useEffect(() => {
    if (!isOpen || productsToCompare.length < 2) {
      setAiVerdict(null);
      return;
    }

    const fetchVerdict = async () => {
      try {
        setIsLoadingVerdict(true);
        const res = await fetch('/api/gemini/compare-verdict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: productsToCompare.map(p => ({
              name: p.name,
              brand: p.brand,
              price: p.price,
              description: p.description
            }))
          })
        });
        const data = await res.json();
        if (data.verdict) {
          setAiVerdict(data.verdict);
        }
      } catch (e) {
        console.error('Error fetching compare verdict:', e);
      } finally {
        setIsLoadingVerdict(false);
      }
    };

    fetchVerdict();
  }, [productsToCompare, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/60 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                مقارنة المنتجات الفاخرة جنباً إلى جنب
              </h2>
              <p className="text-[11px] text-zinc-400">قارن المواصفات والأسعار والمميزات لاختيار الأنسب لك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {productsToCompare.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              لم تختر أي منتجات للمقارنة بعد. اضغط على أيقونة "مقارنة" على بطاقات المنتجات لإضافتها هنا.
            </div>
          ) : (
            <>
              {/* AI Expert Comparison Verdict */}
              {(isLoadingVerdict || aiVerdict) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1a1608] via-[#121008] to-[#0d0d0d] border border-[#52410e] space-y-2 shadow-lg animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>حكم خبير WAKNOVA الذكي</span>
                        <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded font-mono">
                          Gemini AI
                        </span>
                      </span>
                    </div>
                    {isLoadingVerdict && (
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                        الخبير يحلل الفروقات...
                      </span>
                    )}
                  </div>
                  {aiVerdict && (
                    <p className="text-xs text-zinc-200 leading-relaxed pt-1">
                      {aiVerdict}
                    </p>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 bg-[#141414] text-zinc-400 w-36 border-b border-[#262626]">
                      المعايير
                    </th>
                    {productsToCompare.map((prod) => (
                      <th
                        key={prod.id}
                        className="p-4 bg-[#111] text-white border-b border-[#262626] min-w-[200px] text-center"
                      >
                        <div className="relative inline-block mb-2">
                          <button
                            onClick={() => onRemoveFromCompare(prod.id)}
                            className="absolute -top-2 -left-2 bg-red-950 text-red-400 border border-red-800 p-1 rounded-full hover:bg-red-900"
                            title="إزالة من المقارنة"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-20 h-20 object-contain mx-auto bg-[#181818] rounded-xl p-2 border border-[#222]"
                          />
                        </div>
                        <h4 className="font-bold text-xs line-clamp-2 text-white">{prod.name}</h4>
                        <div className="mt-2">
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-[11px] px-3 py-1.5 rounded-xl inline-flex items-center gap-1 shadow-md"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>شراء</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202020] text-zinc-300">
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">السعر الرسمي</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center font-mono font-bold text-white text-sm">
                        {p.price.toLocaleString('en-US')} ريال
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">الماركة التجارية</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center text-[#D4AF37] font-bold font-en">
                        {p.brand}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">التصنيف</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center">{p.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">حالة التوفر</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold">
                        {p.quantity > 0 ? (
                          <span className="text-emerald-400">متوفر ({p.quantity} قطعة)</span>
                        ) : (
                          <span className="text-red-400">نفد من المخزون</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">تقييم العملاء</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center text-amber-400 font-bold font-mono">
                        ★ {p.rating || 4.8} / 5.0
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">الضمان المعتمد</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300">
                        ضمان الوكالة الذهبي (استبدال وفحص)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-[#141414] font-bold text-zinc-400">المواصفات المختصرة</td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-3 text-right text-[11px] text-zinc-400 leading-relaxed max-w-xs">
                        {p.description}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
