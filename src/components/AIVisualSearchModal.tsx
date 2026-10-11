import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Search,
  Scan,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Layers,
  Eye
} from 'lucide-react';
import { Product } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface AIVisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currency?: Currency;
}

export const AIVisualSearchModal: React.FC<AIVisualSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
  currency = 'YER'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    identifiedItem: string;
    brand: string;
    category: string;
    description: string;
    matchedProductIds: string[];
    suggestedKeywords: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      analyzeImage(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Data: string, type: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          mimeType: type,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            price: p.price
          }))
        })
      });

      if (!res.ok) throw new Error('فشل فحص الصورة بالذكاء الاصطناعي');
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError('تعذر تحليل الصورة، يرجى تجربة صورة أوضح أو التقاط زاوية أخرى');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const matchedProducts = products.filter(p =>
    analysisResult?.matchedProductIds?.includes(p.id) ||
    (analysisResult?.brand && p.brand.toLowerCase().includes(analysisResult.brand.toLowerCase())) ||
    (analysisResult?.suggestedKeywords && analysisResult.suggestedKeywords.some(k => p.name.includes(k) || p.description.includes(k)))
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2a220b] to-[#120f05] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">عدسة WAKNOVA البصرية الذكية</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold border border-[#D4AF37]/30">
                  AI Visual Lens
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                صوّر أو ارفع صورة أي هاتف، شاحن، سماعة، أو ملحق لنتعرف عليه ونوفره لك فوراً
              </p>
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Upload / Capture Drop Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Image Box */}
            <div className="bg-[#121212] border-2 border-dashed border-[#333] hover:border-[#D4AF37]/60 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden transition group">
              {imagePreview ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded gadget"
                    className="max-h-48 object-contain rounded-xl shadow-lg border border-[#222]"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-[#D4AF37]">
                      <Sparkles className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-bold text-white">جاري الفحص البصري بذكاء Gemini...</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setAnalysisResult(null);
                    }}
                    className="mt-3 px-3 py-1 bg-[#1c1c1c] hover:bg-zinc-800 text-zinc-300 text-xs rounded-lg transition"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <div className="space-y-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-14 h-14 rounded-2xl bg-[#1c1809] border border-[#52410e] text-[#D4AF37] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">صوّر أو اختر صورة من جهازك</h3>
                    <p className="text-[11px] text-zinc-400 mt-1">يدعم صور الكاميرا المباشرة، PNG، JPG، WEBP</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-extrabold text-xs rounded-xl shadow-md transition"
                  >
                    فتح الكاميرا / رفع صورة
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Analysis Result Box */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Eye className="w-4 h-4" />
                  <span>نتائج الفحص والتعرف الذكي:</span>
                </h4>

                {isAnalyzing ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-zinc-400">جاري قراءة الأبعاد والماركة ومنافذ التوصيل...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-3 animate-fadeIn text-xs">
                    <div className="p-3 bg-[#18150c] border border-[#52410e] rounded-xl space-y-1">
                      <span className="text-[10px] text-zinc-400 block font-mono">IDENTIFIED DEVICE</span>
                      <h3 className="text-sm font-extrabold text-white">{analysisResult.identifiedItem}</h3>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded">
                          الماركة: {analysisResult.brand}
                        </span>
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded">
                          التصنيف: {analysisResult.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-300 leading-relaxed text-[11px] bg-[#161616] p-3 rounded-xl border border-[#222]">
                      {analysisResult.description}
                    </p>

                    {analysisResult.suggestedKeywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {analysisResult.suggestedKeywords.map((kw, idx) => (
                          <span key={idx} className="text-[10px] bg-[#1a1a1a] text-zinc-400 px-2 py-0.5 rounded-lg border border-[#333]">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-zinc-500 space-y-1">
                    <p>قم بالتقاط صورة أو رفعها لعرض التفاصيل الفنية فوراً.</p>
                    <p className="text-[11px] text-zinc-600">يمكنك تصوير كابل مقطوع، شاحن، أو علبة هاتف غير معروفة.</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

          </div>

          {/* Matched Products in WAKNOVA Catalog */}
          {matchedProducts.length > 0 && (
            <div className="pt-4 border-t border-[#202020] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>المنتجات المطابقة والبدائل الأصلية المتوفرة في المتجر:</span>
                </h4>
                <span className="text-xs text-zinc-400 font-mono">({matchedProducts.length} متطابق)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-[#121212] border border-[#262626] hover:border-[#D4AF37]/50 p-3 rounded-2xl flex flex-col justify-between space-y-2 transition group"
                  >
                    <div 
                      className="cursor-pointer space-y-2"
                      onClick={() => {
                        onClose();
                        onSelectProduct(prod);
                      }}
                    >
                      <div className="aspect-square bg-[#181818] rounded-xl p-2 flex items-center justify-center">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#D4AF37] font-semibold">{prod.brand}</span>
                        <h5 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h5>
                        <div className="text-xs font-mono font-black text-white mt-0.5">
                          {formatPrice(prod.price, currency)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(prod, 1);
                      }}
                      className="w-full py-1.5 bg-[#1c1809] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#52410e] text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>إضافة للسلة</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#080808] border-t border-[#1a1a1a] text-center text-[10px] text-zinc-500">
          محرك فحص بصري مدعوم بنماذج Gemini 3.8 Flash المتعددة الوسائط | WAKNOVA AI
        </div>

      </div>
    </div>
  );
};
