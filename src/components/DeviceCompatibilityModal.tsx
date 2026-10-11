import React, { useState } from 'react';
import { X, Cpu, Zap, CheckCircle2, ShoppingBag, Sparkles, AlertCircle, ChevronRight, Filter } from 'lucide-react';
import { Product } from '../types';

interface DeviceCompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onApplyDeviceFilter: (brandKeywords: string) => void;
}

interface PhoneProfile {
  id: string;
  brand: string;
  model: string;
  maxWatts: number;
  chargingTech: string;
  port: string;
  wireless: boolean;
  notes: string;
}

const supportedPhones: PhoneProfile[] = [
  {
    id: 'ip16pm',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max / 16 Pro',
    maxWatts: 35,
    chargingTech: 'USB-PD 3.0 & PPS / MagSafe 25W',
    port: 'USB-C',
    wireless: true,
    notes: 'يدعم شحن سريع حتى 35W عبر شواحن GaN مع كابل تايب-سي 60W أو أعلى.'
  },
  {
    id: 'ip15pm',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max / 15',
    maxWatts: 27,
    chargingTech: 'USB-PD 3.0 / MagSafe 15W',
    port: 'USB-C',
    wireless: true,
    notes: 'منفذ Type-C عالمي، شاحن Temax 45W GaN مثالي لمنحك أقصى سرعة بدون سخونة.'
  },
  {
    id: 'ip14pm',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max / 13 / 12 / 11',
    maxWatts: 27,
    chargingTech: 'USB-PD 2.0 / MagSafe',
    port: 'Lightning',
    wireless: true,
    notes: 'يحتاج كابل Type-C إلى Lightning أصلي مع رأس شاحن 20W أو 35W.'
  },
  {
    id: 's25u',
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra / S24 Ultra',
    maxWatts: 45,
    chargingTech: 'Super Fast Charging 2.0 (PPS 45W)',
    port: 'USB-C',
    wireless: true,
    notes: 'يتطلب شاحن يدعم معيار PPS وبروتوكول 45W وكابل 5A لتحقيق الشحن فائق السرعة 2.0.'
  },
  {
    id: 's24base',
    brand: 'Samsung',
    model: 'Galaxy S24 / S23 / S22 / A55',
    maxWatts: 25,
    chargingTech: 'Super Fast Charging (25W)',
    port: 'USB-C',
    wireless: true,
    notes: 'متوافق تماماً مع شاحن Temax 30W وشواحن السيارة الذكية.'
  },
  {
    id: 'redminote',
    brand: 'Xiaomi / Redmi',
    model: 'Redmi Note 13 Pro / 12 Pro / Poco',
    maxWatts: 67,
    chargingTech: 'Mi Turbo Charge 67W / 33W',
    port: 'USB-C',
    wireless: false,
    notes: 'ينصح بشواحن GaN فائقة القدرة (65W فأعلى) وكابلات 6A لنقل التيار العالي بأمان.'
  },
  {
    id: 'huawei',
    brand: 'Huawei / Honor',
    model: 'Honor Magic / Huawei P60 / Nova',
    maxWatts: 66,
    chargingTech: 'SuperCharge 66W / 40W',
    port: 'USB-C',
    wireless: true,
    notes: 'يدعم الشحن الذكي، وينصح باستخدام بطاريات سفري تدعم QC 4.0 و PD 65W.'
  }
];

export const DeviceCompatibilityModal: React.FC<DeviceCompatibilityModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onApplyDeviceFilter
}) => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedPhone, setSelectedPhone] = useState<PhoneProfile>(supportedPhones[0]);

  if (!isOpen) return null;

  const brands = ['Apple', 'Samsung', 'Xiaomi / Redmi', 'Huawei / Honor'];

  // Filter matched products from catalog based on phone port and specs
  const matchedProducts = products.filter(p => {
    const text = (p.name + ' ' + p.description + ' ' + p.category).toLowerCase();
    if (selectedPhone.port === 'Lightning') {
      if (text.includes('lightning') || text.includes('آيفون') || text.includes('iphone')) return true;
    } else {
      if (text.includes('type-c') || text.includes('تايب سي') || text.includes('gan') || text.includes('سفري') || text.includes('سماعات')) return true;
    }
    return p.category === 'شواحن' || p.category === 'كابلات' || p.category === 'بطاريات سفري';
  }).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#12100a] via-[#0d0d0d] to-black border border-[#4a390e] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262010] flex items-center justify-between bg-black/50 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#886616] p-0.5 shadow-lg shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">محرك التوافق الذكي للهواتف (AI Engine)</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-bold font-mono">
                  MATCH v2.4
                </span>
              </div>
              <p className="text-xs text-zinc-400">اختر هاتفك وسنحدد لك أسرع شاحن وأفضل كابل وبطارية متوافقة 100%</p>
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
          
          {/* Brand Selector */}
          <div>
            <span className="text-[11px] text-zinc-400 font-bold block mb-2">1. اختر ماركة هاتفك:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const first = supportedPhones.find(p => p.brand === brand);
                    if (first) setSelectedPhone(first);
                  }}
                  className={`p-3 rounded-xl text-xs font-bold transition border text-center ${
                    selectedBrand === brand
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 font-black'
                      : 'bg-[#14120a] text-zinc-400 border-[#262010] hover:text-white hover:bg-[#1a170d]'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <span className="text-[11px] text-zinc-400 font-bold block mb-2">2. اختر الموديل:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {supportedPhones
                .filter(p => p.brand === selectedBrand)
                .map(phone => (
                  <button
                    key={phone.id}
                    onClick={() => setSelectedPhone(phone)}
                    className={`p-3.5 rounded-2xl text-xs transition border text-right flex items-center justify-between ${
                      selectedPhone.id === phone.id
                        ? 'bg-[#1c1809] border-[#D4AF37] text-white'
                        : 'bg-[#14120a] border-[#262010] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{phone.model}</h4>
                      <span className="text-[11px] text-[#D4AF37] font-mono mt-0.5 block">
                        أقصى سرعة شحن: {phone.maxWatts}W ({phone.port})
                      </span>
                    </div>
                    {selectedPhone.id === phone.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* AI Specification Match Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1b170a] via-[#121008] to-black border border-[#52410e] space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30260e] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-black text-white text-sm">
                  مواصفات التوافق الرسمية لـ {selectedPhone.model}
                </h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                متوافق 100% مع معايير WAKNOVA
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-black/50 p-2.5 rounded-xl border border-[#262010]">
                <span className="text-[10px] text-zinc-500 block">أقصى قدرة شحن</span>
                <span className="font-mono font-black text-sm text-[#D4AF37]">{selectedPhone.maxWatts}W Watts</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-[#262010]">
                <span className="text-[10px] text-zinc-500 block">منفذ الشحن</span>
                <span className="font-mono font-bold text-sm text-white">{selectedPhone.port}</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-[#262010]">
                <span className="text-[10px] text-zinc-500 block">الشحن اللاسلكي</span>
                <span className="font-bold text-sm text-white">{selectedPhone.wireless ? 'يدعم (Qi/MagSafe)' : 'لا يدعم'}</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-[#262010]">
                <span className="text-[10px] text-zinc-500 block">بروتوكول الشحن</span>
                <span className="font-mono font-bold text-xs text-amber-300 truncate block">{selectedPhone.chargingTech}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-[#241d0c]">
              <strong className="text-[#D4AF37]">توصية المهندس الفني:</strong> {selectedPhone.notes}
            </p>
          </div>

          {/* Matched Store Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>المنتجات المعتمدة المتوافقة تماماً من كتالوج المتجر:</span>
              </h4>
              <button
                onClick={() => {
                  onApplyDeviceFilter(selectedPhone.brand);
                  onClose();
                }}
                className="text-[#D4AF37] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>تصفية المتجر لجهازي ({selectedPhone.model})</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {matchedProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-[#12110a] border border-[#28210f] hover:border-[#D4AF37] transition flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-14 h-14 object-contain bg-black rounded-xl p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#D4AF37] font-bold block">{prod.brand}</span>
                    <h5 className="font-bold text-xs text-white truncate group-hover:text-[#D4AF37] transition">
                      {prod.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono font-black text-xs text-white">
                        {prod.price.toLocaleString('en-US')} ريال
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">متوافق ✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/70 border-t border-[#262010] flex items-center justify-between text-xs">
          <span className="text-zinc-500">WAKNOVA Smart Compatibility Architecture</span>
          <button
            onClick={() => {
              onApplyDeviceFilter(selectedPhone.brand);
              onClose();
            }}
            className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>عرض منتجات جهازي فقط في المتجر</span>
          </button>
        </div>

      </div>
    </div>
  );
};
