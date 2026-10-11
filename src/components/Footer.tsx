import React from 'react';
import { Phone, MessageCircle, Instagram, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenSpecialOrder: () => void;
  onOpenTracking: () => void;
  onOpenMaintenance: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenContact,
  onOpenSpecialOrder,
  onOpenTracking,
  onOpenMaintenance,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-black border-t border-[#262626] text-zinc-300">
      {/* Value Proposition Grid */}
      <div className="border-b border-[#262626] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-right">
            
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">منتجات أصلية 100%</h4>
              <p className="text-xs text-zinc-400">شواحن وسماعات وبطاريات معتمدة من المصنع مباشرة مع الضمان الذهبي.</p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">توصيل لكافة محافظات اليمن</h4>
              <p className="text-xs text-zinc-400">توصيل فوري داخل صنعاء وشحن موثوق لعدن، تعز، إب، حضرموت وبقية المدن.</p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">خدمة الطلبات الخاصة</h4>
              <p className="text-xs text-zinc-400">نبحث عن القطع النادرة وغير المتوفرة ونوفرها خصيصاً لك بأفضل سعر.</p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">محافظ دفع يمنية متعددة</h4>
              <p className="text-xs text-zinc-400">دفع عند الاستلام، أو تحويل فوري عبر الكريمي، جيب، ون كاش، وجوالي.</p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Store Profile */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#AA771C] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
                  <span className="text-[#D4AF37] font-black text-lg font-en">W</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-black font-en gold-gradient-text tracking-widest">
                  WAKNOVA
                </span>
                <p className="text-[11px] text-zinc-400">الوكالة الحديثة للهواتف الذكية</p>
              </div>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              الاسم الرسمي: <span className="text-white font-semibold">الوكالة الحديثة للهواتف الذكية ومستلزماتها</span>.
              المتجر المتخصص في اليمن لأفخم الشواحن التوربينية والبطاريات السفري والسماعات الذكية وأحدث مستلزمات الجوال الأصلية.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>الجمهورية اليمنية - صنعاء / شحن لكافة المحافظات</span>
              </div>
              <a
                href="https://wa.me/967780000751"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#D4AF37] hover:underline"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>اتصال وواتساب: 780000751</span>
              </a>
              <a
                href="https://instagram.com/6taaj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#D4AF37]"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-en">إنستغرام: @6taaj</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-r-2 border-[#D4AF37] pr-2.5">
              روابط المتجر
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={onOpenSpecialOrder} className="hover:text-[#D4AF37] transition">
                  طلب منتج غير متوفر (خاص)
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-[#D4AF37] transition">
                  تتبع حالة طلبك برقم الهاتف
                </button>
              </li>
              <li>
                <button onClick={onOpenMaintenance} className="hover:text-[#D4AF37] transition">
                  مركز الصيانة واستلام الأجهزة
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-[#D4AF37] transition">
                  من نحن - قصة WAKNOVA
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-[#D4AF37] transition">
                  اتصل بنا ومعلومات الفروع
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Wallets Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-r-2 border-[#D4AF37] pr-2.5">
              طرق الدفع المعتمدة
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-zinc-200">الدفع عند الاستلام</span>
                <span className="text-[10px] text-emerald-400 font-medium">كاش</span>
              </li>
              <li className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-zinc-200">بنك الكريمي المميز</span>
                <span className="text-[10px] text-[#D4AF37] font-mono">3008945612</span>
              </li>
              <li className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-zinc-200">محفظة جيب Jeeb</span>
                <span className="text-[10px] text-[#D4AF37] font-mono">780000751</span>
              </li>
              <li className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-zinc-200">ون كاش وجوالي</span>
                <span className="text-[10px] text-[#D4AF37] font-mono">780000751</span>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="bg-gradient-to-b from-[#171408] to-black p-5 rounded-2xl border border-[#3e320f] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                خدمة العملاء على مدار الساعة
              </span>
              <h5 className="text-white font-bold text-base mb-2">
                هل تبحث عن استشارة فنية؟
              </h5>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                فريق الوكالة الحديثة مستعد للإجابة على كل استفسارات التوافق والشواحن وبطاريات السفر المناسبة لجهازك.
              </p>
            </div>

            <a
              href="https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA%20أود%20الاستفسار%20عن%20منتجاتكم"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#D4AF37]/20"
            >
              <MessageCircle className="w-4 h-4 fill-black text-black" />
              <span>محادثة واتساب فورية: 780000751</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenAbout} className="hover:text-zinc-400">سياسة الضمان والإرجاع</button>
            <span>•</span>
            <button onClick={onOpenAbout} className="hover:text-zinc-400">سياسة الخصوصية</button>
            <span>•</span>
            <button onClick={onOpenAdmin} className="text-[#D4AF37]/80 hover:text-[#D4AF37]">بوابة الإدارة</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
