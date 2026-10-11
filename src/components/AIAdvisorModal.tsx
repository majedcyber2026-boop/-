import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  Smartphone, 
  BatteryCharging, 
  Headphones, 
  Flame,
  MessageCircle
} from 'lucide-react';
import { Product } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  currency?: Currency;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onOpenProduct,
  currency = 'YER'
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    verdictTitle: string;
    verdictAdvice: string;
    recommendedProductIds: string[];
    proTip?: string;
  } | null>(null);

  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const quickQuestions = [
    { label: 'شاحن GaN سريع وبنك طاقة لطوارئ الكهرباء ⚡', prompt: 'أريد أفضل شاحن سريع GaN عالي القدرة وبنك طاقة يعتمد عليه أثناء انقطاع الكهرباء في اليمن' },
    { label: 'أفضل هاتف تصوير وبطارية بميزانية متوازنة 📱', prompt: 'أبحث عن هاتف ذكي ممتاز للكاميرا والبطارية بسعر منافس' },
    { label: 'سماعة عزل صوت أصلية للمكالمات والاجتماعات 🎧', prompt: 'أريد سماعة بلوتوث أصلية بنقاء صوت وعزل للضوضاء وبطارية تدوم أيام' },
    { label: 'بكج حماية وشواحن لأحدث هواتف آيفون وسامسونج 🛡️', prompt: 'أريد شاحن معتمد 25W أو 45W مع كابل أصلي وحماية شاشة ضد الكسر' }
  ];

  const handleConsult = async (customPrompt?: string) => {
    const textToSearch = customPrompt || query;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSearch, products }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Advisor error:', e);
      // Fallback
      setResult({
        verdictTitle: 'توصية مستشار WAKNOVA التقني',
        verdictAdvice: 'تم اختيار المنتجات الأكثر كفاءة وأماناً لشبكة الكهرباء والبطاريات مع توافق بروتوكولات الشحن السريع PD & QC.',
        recommendedProductIds: products.slice(0, 2).map(p => p.id),
        proTip: 'المنتجات معتمدة بالضمان الذهبي 100% مع فحص واستبدال فوري.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedProducts = result?.recommendedProductIds
    ?.map(id => products.find(p => String(p.id) === String(id)))
    .filter(Boolean) as Product[] || [];

  const handleAddAndFeedback = (p: Product) => {
    onAddToCart(p);
    setAddedIds(prev => [...prev, p.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== p.id));
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#141108] via-[#0d0d0d] to-black border border-[#52410e] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-5 border-b border-[#262010] flex items-center justify-between relative z-10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#886616] p-0.5 shadow-lg shadow-[#D4AF37]/25">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">مستشار WAKNOVA الذكي</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-bold">
                  مدعوم بـ Gemini AI
                </span>
              </div>
              <p className="text-xs text-zinc-400">استشارة تقنية شخصية لاختيار أنسب الأجهزة والمستلزمات لميزانيتك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 relative z-10 overflow-y-auto max-h-[75vh]">
          
          {/* Quick Prompts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>استشارات سريعة جاهزة بنقرة واحدة:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q.prompt);
                    handleConsult(q.prompt);
                  }}
                  className="p-2.5 rounded-xl bg-[#14120a] hover:bg-[#1f1a0e] border border-[#2b220d] hover:border-[#D4AF37]/50 text-right text-xs text-zinc-300 hover:text-white transition flex items-center justify-between group"
                >
                  <span className="truncate">{q.label}</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37] group-hover:-translate-x-1 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">أو اكتب طلبك وميزانيتك الخاصة:</label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثال: معي 100 ألف ريال وأبحث عن شاحن سريع ما يسخن وبنك طاقة أصلي للسفر ولأجهزة الآيفون..."
                rows={2}
                className="w-full bg-black/80 border border-[#33280c] focus:border-[#D4AF37] rounded-2xl p-3.5 pr-4 pl-28 text-xs text-white placeholder-zinc-500 outline-none resize-none transition"
              />
              <button
                onClick={() => handleConsult()}
                disabled={isLoading || !query.trim()}
                className="absolute left-2.5 bottom-3.5 bg-gradient-to-r from-[#D4AF37] to-[#aa771c] hover:opacity-90 disabled:opacity-50 text-black font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md shadow-[#D4AF37]/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>تحليل...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>تحليل بالذكاء</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center space-y-3 bg-[#111009] border border-[#30250b] rounded-2xl animate-pulse">
              <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#D4AF37]">الذكاء الاصطناعي يحلل الكتالوج ويطابق المواصفات التقنية...</p>
              <p className="text-[11px] text-zinc-500">فحص قدرات الشحن، خامات التصنيع، ومعايير السلامة</p>
            </div>
          )}

          {/* AI Result Card */}
          {result && !isLoading && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#181408] to-[#100e05] border border-[#594511] shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <h3 className="text-sm font-black text-white">{result.verdictTitle}</h3>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed font-light">
                  {result.verdictAdvice}
                </p>

                {result.proTip && (
                  <div className="p-3 rounded-xl bg-black/60 border border-[#44350e] text-[11px] text-amber-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold">نصيحة الوكالة الذهبية:</strong>
                      <span className="text-zinc-300">{result.proTip}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Products Showcase */}
              {recommendedProducts.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>المنتجات الموصى بها رسمياً من المتجر:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedProducts.map(prod => {
                      const isAdded = addedIds.includes(prod.id);
                      return (
                        <div
                          key={prod.id}
                          className="p-3 rounded-2xl bg-black/70 border border-[#33280c] hover:border-[#D4AF37] transition flex flex-col justify-between gap-3 shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-16 h-16 rounded-xl object-contain bg-[#161616] p-1.5 border border-[#222]"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-[#D4AF37] font-bold block uppercase">{prod.brand}</span>
                              <h5 
                                onClick={() => onOpenProduct(prod)}
                                className="text-xs font-bold text-white hover:text-[#D4AF37] transition truncate cursor-pointer"
                              >
                                {prod.name}
                              </h5>
                              <p className="text-[11px] font-black text-[#D4AF37] mt-1 font-mono">
                                {formatPrice(prod.price, currency)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e1e]">
                            <button
                              onClick={() => handleAddAndFeedback(prod)}
                              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                isAdded
                                  ? 'bg-emerald-500 text-black font-black'
                                  : 'bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>تمت الإضافة!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>إضافة للسلة</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => onOpenProduct(prod)}
                              className="py-1.5 px-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-zinc-300 text-xs border border-[#333] transition"
                            >
                              المواصفات
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/80 border-t border-[#262010] flex items-center justify-between text-xs text-zinc-400">
          <a
            href="https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA%20أريد%20استشارة%20المدير%20مباشرة"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1.5 font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>طلب استشارة شخصية من المدير عبر واتساب</span>
          </a>
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
