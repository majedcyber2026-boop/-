import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Gift,
  HelpCircle
} from 'lucide-react';
import { Product, UserProfile } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface TradeInCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentUser?: UserProfile | null;
  currency?: Currency;
  onSelectProductToBuy?: (product: Product) => void;
}

const TRADE_IN_MODELS = [
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 12 Pro Max',
  'iPhone 12',
  'iPhone 11',
  'Samsung Galaxy S23 Ultra',
  'Samsung Galaxy S22 Ultra',
  'Samsung Galaxy S21 Ultra',
  'Samsung Galaxy Z Fold 5 / 4',
  'طراز آخر'
];

export const TradeInCalculatorModal: React.FC<TradeInCalculatorModalProps> = ({
  isOpen,
  onClose,
  products,
  currentUser,
  currency = 'YER',
  onSelectProductToBuy
}) => {
  const [model, setModel] = useState(TRADE_IN_MODELS[0]);
  const [customModel, setCustomModel] = useState('');
  const [storage, setStorage] = useState('256GB');
  const [condition, setCondition] = useState('A (ممتاز بدون خدوش واضحة)');
  const [batteryHealth, setBatteryHealth] = useState(86);
  const [isCalculating, setIsCalculating] = useState(false);
  const [tradeInResult, setTradeInResult] = useState<{
    estimatedTradeInValueYer: number;
    conditionGrade: string;
    breakdown: string;
    bonusRewardPoints: number;
    vipUpgradeMessage: string;
  } | null>(null);

  // Selected Target Product for Upgrade
  const [targetProductId, setTargetProductId] = useState<string>(products[0]?.id || '');
  const [upgradeSubmitted, setUpgradeSubmitted] = useState(false);

  if (!isOpen) return null;

  const effectiveModel = model === 'طراز آخر' ? customModel.trim() || 'هاتف ذكي' : model;
  const targetProduct = products.find(p => p.id === targetProductId) || products[0];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTradeInResult(null);

    try {
      const res = await fetch('/api/gemini/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceModel: effectiveModel,
          storage,
          condition,
          batteryHealth
        })
      });

      const data = await res.json();
      setTradeInResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const tradeInValue = tradeInResult?.estimatedTradeInValueYer || 0;
  const upgradeDifference = targetProduct ? Math.max(0, targetProduct.price - tradeInValue) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2a220b] to-[#120f05] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">برنامج استبدال وترقية الأجهزة</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold border border-[#D4AF37]/30">
                  WAKNOVA Trade-In
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                استبدل هاتفك الحالي بأحدث هاتف رائد مع خصم قيمته السوقية فوراً
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
          
          {upgradeSubmitted ? (
            /* Confirmation View */
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#D4AF37] font-bold">تم حجز طلب الترقية والاستبدال بنجاح</span>
                <h3 className="text-xl font-black text-white">
                  الترقية إلى: <span className="text-[#D4AF37]">{targetProduct?.name}</span>
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  تفضل بزيارة معرض الوكالة مع جهازك الحالي لإتمام الفحص السريع واستلام هاتفك الجديد ونقل كافة بياناتك مجاناً.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setTradeInResult(null);
                    setUpgradeSubmitted(false);
                  }}
                  className="px-5 py-2.5 bg-[#181818] hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl"
                >
                  تقييم جهاز آخر
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg"
                >
                  تم
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Device Input Form */}
              <form onSubmit={handleCalculate} className="space-y-4 bg-[#121212] border border-[#222] p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>بيانات جهازك الحالي المراد استبداله:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">طراز الجهاز</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] text-xs text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                    >
                      {TRADE_IN_MODELS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {model === 'طراز آخر' && (
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="اكتب طراز هاتفك بدقة..."
                        className="w-full mt-2 bg-[#181818] border border-[#333] text-xs text-white rounded-xl p-2 outline-none"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">سعة الذاكرة</label>
                    <select
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] text-xs text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                    >
                      {['64GB', '128GB', '256GB', '512GB', '1TB'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">حالة الهيكل والشاشة</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] text-xs text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                    >
                      <option value="A+ (كالجديد بدون أي خدش)">A+ (كالجديد تماماً مع الكرتون)</option>
                      <option value="A (ممتاز بدون خدوش واضحة)">A (ممتاز جداً - نظيف)</option>
                      <option value="B (خدوش طفيفة بالهيكل)">B (خدوش سطحية طفيفة)</option>
                      <option value="C (كسر زجاج خارجي أو بطارية ضعيفة)">C (يحتاج صيانة طفيفة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">صحة البطارية: {batteryHealth}%</label>
                    <input
                      type="range"
                      min={60}
                      max={100}
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(Number(e.target.value))}
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#aa771c] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>جاري احتساب القيمة السوقية العادلة...</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>احسب قيمة الاستبدال الفورية لجهازي</span>
                    </>
                  )}
                </button>
              </form>

              {/* VALUATION RESULT & UPGRADE BUILDER */}
              {tradeInResult && (
                <div className="bg-[#121212] border border-[#52410e] rounded-2xl p-5 space-y-5 animate-fadeIn">
                  
                  {/* Valuation Pill */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#202020] gap-3">
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-mono block">TRADE-IN VALUATION</span>
                      <h3 className="text-base font-black text-white">
                        القيمة التقديرية لجهازك: <span className="font-mono text-[#D4AF37] text-lg">{formatPrice(tradeInResult.estimatedTradeInValueYer, currency)}</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{tradeInResult.breakdown}</p>
                    </div>

                    <div className="text-left bg-[#18150c] p-2.5 rounded-xl border border-[#52410e] flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[11px] text-white font-bold">
                        +{tradeInResult.bonusRewardPoints} نقطة ولاء ترحيبية
                      </span>
                    </div>
                  </div>

                  {/* Target Product Upgrade Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span>اختر الهاتف الجديد الذي ترغب في الترقية إليه:</span>
                    </label>

                    <select
                      value={targetProductId}
                      onChange={(e) => setTargetProductId(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ({formatPrice(p.price, currency)})
                        </option>
                      ))}
                    </select>

                    {/* Net Calculation Summary */}
                    {targetProduct && (
                      <div className="p-4 bg-gradient-to-r from-[#17140a] via-[#121006] to-[#0a0a0a] border border-[#52410e] rounded-2xl space-y-2.5 text-xs">
                        <div className="flex justify-between text-zinc-300">
                          <span>سعر الجهاز الجديد ({targetProduct.name}):</span>
                          <span className="font-mono font-bold text-white">{formatPrice(targetProduct.price, currency)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                          <span>قيمة جهازك المستبدل (يُخصم فوراً):</span>
                          <span className="font-mono font-bold">- {formatPrice(tradeInValue, currency)}</span>
                        </div>
                        <div className="pt-2 border-t border-[#332b13] flex justify-between items-center text-sm">
                          <span className="font-black text-white">فارق الترقية الصافي المطلوب سداده:</span>
                          <span className="text-lg font-black text-[#D4AF37] font-mono">
                            {formatPrice(upgradeDifference, currency)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Submit */}
                    <button
                      type="button"
                      onClick={() => setUpgradeSubmitted(true)}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>تأكيد حجز الترقية وزيارة المعرض لنقل البيانات</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#080808] border-t border-[#1a1a1a] text-center text-[10px] text-zinc-500">
          برنامج WAKNOVA Trade-In المعتمد · أعلى سعر استبدال تشجيعي مع نقل مجاني لكافة البيانات
        </div>

      </div>
    </div>
  );
};
