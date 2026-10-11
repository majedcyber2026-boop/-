import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Shield, Zap, Flame, Award, Headphones, BatteryCharging, Cable, Bot, Gift, ShieldCheck, Smartphone } from 'lucide-react';
import { Currency } from '../utils/currency';

interface HeroBannerProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  activeFilter: 'all' | 'new' | 'bestseller' | 'sale';
  onSelectFilter: (filter: 'all' | 'new' | 'bestseller' | 'sale') => void;
  onOpenSpecialOrder: () => void;
  onOpenInstallApp?: () => void;
  onOpenDeviceCompatibility?: () => void;
  onOpenBundleBuilder?: () => void;
  onOpenWarranty?: () => void;
  onOpenAdvisor?: () => void;
  currency?: Currency;
}

const slides = [
  {
    badge: "الوكالة الحديثة للهواتف الذكية ومستلزماتها",
    title: "قمة الفخامة التكنولوجية بين يديك",
    subtitle: "أحدث شواحن GaN فائقة السرعة، بنوك طاقة عملاقة حتى 30000mAh، وسماعات Hi-Fi نقية من أشهر الماركات العالمية المعتمدة في اليمن.",
    cta: "استكشف التشكيلة",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1400&q=80",
    tag: "WAKNOVA EXCLUSIVE"
  },
  {
    badge: "شواحن وبطاريات TEMAX & RONIN المعتمدة",
    title: "سرعة شحن استثنائية وحماية مضاعفة",
    subtitle: "شواحن جدارية وسيارة متطورة بقدرات تصل إلى 65W تدعم بروتوكولات Power Delivery و Quick Charge لأجهزة الآيفون وسامسونج بدون حرارة.",
    cta: "عروض الشواحن الفائقة",
    image: "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=1400&q=80",
    tag: "HIGH PERFORMANCE"
  },
  {
    badge: "خدمة حصرية لعملائنا في كافة المحافظات",
    title: "تبحث عن قطعة نادرة؟ نوفرها لك خصيصاً",
    subtitle: "شواحن أصلية نادرة، كابلات شحن خاصة، بطاريات طوارئ للابتوبات، أو شاشات وقطع صيانة معتمدة تصلك خلال أيام وبأفضل سعر.",
    cta: "اطلب منتج خاص الآن",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1400&q=80",
    tag: "VIP BESPOKE"
  }
];

const categories = [
  { id: "all", name: "جميع المعروضات", icon: Sparkles },
  { id: "هواتف", name: "هواتف ذكية", icon: Smartphone },
  { id: "شواحن", name: "شواحن GaN", icon: Zap },
  { id: "سماعات", name: "سماعات وصوتيات", icon: Headphones },
  { id: "بطاريات", name: "بنوك طاقة", icon: BatteryCharging },
  { id: "كابلات", name: "كابلات شحن", icon: Cable },
  { id: "حماية شاشة", name: "حماية الشاشة", icon: Shield },
  { id: "إكسسوارات", name: "ملحقات فاخرة", icon: Award }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeCategory,
  onSelectCategory,
  activeFilter,
  onSelectFilter,
  onOpenSpecialOrder,
  onOpenDeviceCompatibility,
  onOpenBundleBuilder,
  onOpenWarranty,
  onOpenAdvisor,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-black pb-4">
      
      {/* Hero Cinema Showcase Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        <div className="relative rounded-3xl overflow-hidden border border-[#2b240f] bg-gradient-to-r from-black via-[#110e07] to-black min-h-[380px] md:min-h-[440px] flex items-center shadow-2xl">
          
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#AA771C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity overflow-hidden">
            <img
              src={slide.image}
              alt="WAKNOVA Showcase"
              className="w-full h-full object-cover scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 p-6 md:p-14 max-w-2xl space-y-4">
            
            {/* Unboxed Brand Kicker (Anti-Pill Rule) */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {slide.title}
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (currentSlide === 2) {
                    onOpenSpecialOrder();
                  } else {
                    const el = document.getElementById('products-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#f7e499] to-[#aa771c] hover:brightness-110 active:scale-95 text-black font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition duration-200 cursor-pointer"
              >
                <span>{slide.cta}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {onOpenAdvisor && (
                <button
                  onClick={onOpenAdvisor}
                  className="bg-[#141209] hover:bg-[#1f1a0e] text-[#D4AF37] hover:text-white border border-[#52410e] hover:border-[#D4AF37] text-xs sm:text-sm px-5 py-3 rounded-full transition flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                  <span>استشر الذكاء الاصطناعي</span>
                </button>
              )}
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-5 left-8 z-10 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* The WAKNOVA Innovation Suite: Clean, Orderly, Prestigious */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Card 1: AI Advisor */}
          <div
            onClick={onOpenAdvisor}
            className="p-4 rounded-2xl bg-[#0f0e09] border border-[#2b240f] hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c180b] border border-[#52410e] flex items-center justify-center text-[#D4AF37] group-hover:scale-108 transition-transform shrink-0">
              <Bot className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#D4AF37] font-bold block uppercase tracking-wider font-mono">AI CONCIERGE</span>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition truncate">
                مستشار الشراء الذكي
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">توصية مخصصة لميزانيتك</p>
            </div>
          </div>

          {/* Card 2: AI Compatibility Engine */}
          <div
            onClick={onOpenDeviceCompatibility}
            className="p-4 rounded-2xl bg-[#0f0e09] border border-[#2b240f] hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c180b] border border-[#52410e] flex items-center justify-center text-[#D4AF37] group-hover:scale-108 transition-transform shrink-0">
              <Zap className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider font-mono">FAST CHARGE</span>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition truncate">
                فاحص التوافق الفوري
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">مطابقة الشاحن وهاتفك 100%</p>
            </div>
          </div>

          {/* Card 3: VIP Bundle Builder */}
          <div
            onClick={onOpenBundleBuilder}
            className="p-4 rounded-2xl bg-[#0f0e09] border border-[#2b240f] hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c180b] border border-[#52410e] flex items-center justify-center text-[#D4AF37] group-hover:scale-108 transition-transform shrink-0">
              <Gift className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider font-mono">SAVE 15%</span>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition truncate">
                صانع البكج الملكي
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">تجميع الأجهزة مع علبة هدايا</p>
            </div>
          </div>

          {/* Card 4: Warranty & IMEI Verifier */}
          <div
            onClick={onOpenWarranty}
            className="p-4 rounded-2xl bg-[#0f0e09] border border-[#2b240f] hover:border-[#D4AF37] transition-all cursor-pointer group shadow-sm flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c180b] border border-[#52410e] flex items-center justify-center text-[#D4AF37] group-hover:scale-108 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#D4AF37] font-bold block uppercase tracking-wider font-mono">VERIFIED</span>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition truncate">
                فاحص الضمان والسيريال
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">تحقق من أصالة القطع</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Categories Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = (activeCategory === cat.name) || (cat.id === 'all' && activeCategory === 'all');
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 font-black'
                    : 'bg-[#101010] text-zinc-300 border-[#222] hover:border-[#444] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Sub-Filter Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex items-center justify-between border-b border-[#202020] pb-3">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <button
            onClick={() => onSelectFilter('all')}
            className={`pb-2 font-bold border-b-2 transition cursor-pointer ${
              activeFilter === 'all'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            جميع المعروضات
          </button>
          <button
            onClick={() => onSelectFilter('new')}
            className={`pb-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeFilter === 'new'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>وصل حديثًا</span>
          </button>
          <button
            onClick={() => onSelectFilter('bestseller')}
            className={`pb-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeFilter === 'bestseller'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>الأكثر طلبًا</span>
          </button>
          <button
            onClick={() => onSelectFilter('sale')}
            className={`pb-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeFilter === 'sale'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>عروض حصرية</span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 hidden sm:inline font-mono">
          WAKNOVA · ORIGINAL ONLY
        </span>
      </div>

    </div>
  );
};
