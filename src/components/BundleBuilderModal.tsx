import React, { useState } from 'react';
import { X, Gift, Check, Sparkles, ShoppingBag, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddBundleToCart: (bundleItem: any) => void;
}

export const BundleBuilderModal: React.FC<BundleBuilderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddBundleToCart
}) => {
  // Available pool of items by category
  const chargers = products.filter(p => p.category === 'شواحن').slice(0, 4);
  const cables = products.filter(p => p.category === 'كابلات').slice(0, 4);
  const batteries = products.filter(p => p.category === 'بطاريات سفري' || p.category === 'بطاريات').slice(0, 4);
  const audios = products.filter(p => p.category === 'سماعات').slice(0, 4);

  const [selectedCharger, setSelectedCharger] = useState<Product | null>(chargers[0] || null);
  const [selectedCable, setSelectedCable] = useState<Product | null>(cables[0] || null);
  const [selectedBattery, setSelectedBattery] = useState<Product | null>(batteries[0] || null);
  const [selectedAudio, setSelectedAudio] = useState<Product | null>(audios[0] || null);
  const [includeGiftBox, setIncludeGiftBox] = useState(true);

  if (!isOpen) return null;

  // Pricing Math
  const items = [selectedCharger, selectedCable, selectedBattery, selectedAudio].filter(Boolean) as Product[];
  const rawTotal = items.reduce((sum, it) => sum + it.price, 0);
  const discountRate = items.length >= 3 ? 0.15 : (items.length >= 2 ? 0.10 : 0);
  const discountAmount = Math.round(rawTotal * discountRate);
  const bundleTotal = rawTotal - discountAmount;

  const handleFinishBundle = () => {
    if (items.length === 0) return;
    const bundleProduct = {
      product: {
        id: 'bundle-' + Date.now(),
        name: `بكج WAKNOVA الملكي المخصص (${items.length} قطع فاخرة)`,
        brand: 'WAKNOVA Luxury',
        category: 'بكجات متكاملة',
        price: bundleTotal,
        cost: Math.round(bundleTotal * 0.7),
        quantity: 1,
        images: [items[0]?.images[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'],
        description: `حزمة إلكترونيات ملكية مخصصة تشمل: ${items.map(it => it.name).join(' + ')}${includeGiftBox ? ' مع تغليف علبة الهدايا الجلدية الفاخرة' : ''}.`,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      quantity: 1
    };

    onAddBundleToCart(bundleProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#13110a] via-[#0d0d0d] to-black border border-[#4a390e] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262010] flex items-center justify-between bg-black/60 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#886616] p-0.5 shadow-lg shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">صانع البكجات الفاخر الموفر (Bundle Builder)</h2>
                <span className="text-[10px] bg-[#D4AF37] text-black px-2 py-0.5 rounded font-black">
                  وفر 15% فوراً
                </span>
              </div>
              <p className="text-xs text-zinc-400">اختر ملحقاتك المفضلة وسنجمعها لك في بكج ملكي بخصم حصري وتغليف مجاني</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 relative z-10">
          
          {/* Step 1: Fast Charger */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[11px] font-black flex items-center justify-center">1</span>
                <span>اختر رأس الشاحن السريع:</span>
              </span>
              <span className="text-[11px] text-[#D4AF37] font-bold">شواحن GaN معتمدة</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {chargers.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => setSelectedCharger(ch)}
                  className={`p-3 rounded-2xl transition border cursor-pointer flex flex-col justify-between ${
                    selectedCharger?.id === ch.id
                      ? 'bg-[#1c1809] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15'
                      : 'bg-[#12110a] border-[#262010] hover:border-zinc-700'
                  }`}
                >
                  <img src={ch.images[0]} alt={ch.name} className="w-16 h-16 object-contain mx-auto bg-black/40 rounded-xl p-1 mb-2" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{ch.name}</h4>
                    <span className="text-[11px] font-mono text-[#D4AF37] font-black mt-1 block">
                      {ch.price.toLocaleString('en-US')} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Cable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[11px] font-black flex items-center justify-center">2</span>
                <span>اختر كابل الشحن فائق المتانة:</span>
              </span>
              <span className="text-[11px] text-[#D4AF37] font-bold">كابلات قماشية مصفحة</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {cables.map(cb => (
                <div
                  key={cb.id}
                  onClick={() => setSelectedCable(cb)}
                  className={`p-3 rounded-2xl transition border cursor-pointer flex flex-col justify-between ${
                    selectedCable?.id === cb.id
                      ? 'bg-[#1c1809] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15'
                      : 'bg-[#12110a] border-[#262010] hover:border-zinc-700'
                  }`}
                >
                  <img src={cb.images[0]} alt={cb.name} className="w-16 h-16 object-contain mx-auto bg-black/40 rounded-xl p-1 mb-2" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{cb.name}</h4>
                    <span className="text-[11px] font-mono text-[#D4AF37] font-black mt-1 block">
                      {cb.price.toLocaleString('en-US')} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Power Bank */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[11px] font-black flex items-center justify-center">3</span>
                <span>اختر البطارية السفري للرحلات والسفر:</span>
              </span>
              <span className="text-[11px] text-[#D4AF37] font-bold">سعات عملاقة مضمونة</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {batteries.map(bt => (
                <div
                  key={bt.id}
                  onClick={() => setSelectedBattery(bt)}
                  className={`p-3 rounded-2xl transition border cursor-pointer flex flex-col justify-between ${
                    selectedBattery?.id === bt.id
                      ? 'bg-[#1c1809] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15'
                      : 'bg-[#12110a] border-[#262010] hover:border-zinc-700'
                  }`}
                >
                  <img src={bt.images[0]} alt={bt.name} className="w-16 h-16 object-contain mx-auto bg-black/40 rounded-xl p-1 mb-2" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{bt.name}</h4>
                    <span className="text-[11px] font-mono text-[#D4AF37] font-black mt-1 block">
                      {bt.price.toLocaleString('en-US')} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Audio / Earbuds */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[11px] font-black flex items-center justify-center">4</span>
                <span>اختر السماعة اللاسلكية الأصلية:</span>
              </span>
              <span className="text-[11px] text-[#D4AF37] font-bold">صوت نقي Hi-Fi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {audios.map(au => (
                <div
                  key={au.id}
                  onClick={() => setSelectedAudio(au)}
                  className={`p-3 rounded-2xl transition border cursor-pointer flex flex-col justify-between ${
                    selectedAudio?.id === au.id
                      ? 'bg-[#1c1809] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15'
                      : 'bg-[#12110a] border-[#262010] hover:border-zinc-700'
                  }`}
                >
                  <img src={au.images[0]} alt={au.name} className="w-16 h-16 object-contain mx-auto bg-black/40 rounded-xl p-1 mb-2" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{au.name}</h4>
                    <span className="text-[11px] font-mono text-[#D4AF37] font-black mt-1 block">
                      {au.price.toLocaleString('en-US')} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Gift Packaging Option */}
          <div className="p-4 rounded-2xl bg-[#14120a] border border-[#33280c] flex items-center justify-between cursor-pointer" onClick={() => setIncludeGiftBox(!includeGiftBox)}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#26200c] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">تغليف في علبة هدايا جلدية ملكية خاصة</h4>
                <p className="text-[11px] text-zinc-400">تغليف باللون الأسود الملكي والشعار الذهبي مجاناً مع هذا البكج</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${includeGiftBox ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold' : 'border-zinc-600'}`}>
              {includeGiftBox && '✓'}
            </div>
          </div>

        </div>

        {/* Footer Summary & Add to Cart */}
        <div className="p-4 sm:p-5 bg-black/90 border-t border-[#262010] flex flex-wrap items-center justify-between gap-4 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 line-through block font-mono">
                السعر الإفرادي: {rawTotal.toLocaleString('en-US')} ريال
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#D4AF37] font-mono">
                  {bundleTotal.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-zinc-400">ريال يمني</span>
                {discountAmount > 0 && (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    وفرت {discountAmount.toLocaleString('en-US')} ريال (خصم {Math.round(discountRate * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishBundle}
              className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black text-xs px-6 py-3 rounded-xl transition shadow-xl shadow-[#D4AF37]/30 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>إضافة البكج الكامل إلى السلة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
