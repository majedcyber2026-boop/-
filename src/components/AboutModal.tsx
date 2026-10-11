import React from 'react';
import { X, ShieldCheck, Award, Truck, Phone, Instagram, MapPin } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-en text-[#D4AF37] font-bold text-sm tracking-wider">WAKNOVA</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-sm sm:text-base font-bold text-white">من نحن - قصة الوكالة الحديثة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto leading-relaxed text-xs text-zinc-300">
          
          <div className="text-center space-y-3 py-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] p-0.5 mx-auto shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <span className="text-[#D4AF37] font-black text-2xl font-en">W</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white gold-gradient-text font-en tracking-widest">
                WAKNOVA
              </h1>
              <p className="text-sm font-bold text-white mt-1">الوكالة الحديثة للهواتف الذكية ومستلزماتها</p>
              <p className="text-xs text-[#D4AF37] mt-0.5">الجمهورية اليمنية</p>
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-2xl border border-[#262626] space-y-3">
            <h3 className="text-sm font-bold text-white border-r-2 border-[#D4AF37] pr-2">رؤيتنا ورسالتنا:</h3>
            <p>
              تأسست <strong className="text-white">الوكالة الحديثة للهواتف الذكية ومستلزماتها (WAKNOVA)</strong> في الجمهورية اليمنية لتكون الوجهة الفاخرة الأولى لكل من يبحث عن الأداء الحقيقي والجودة المضمونة في عالم الهواتف المحمولة وإكسسواراتها الأصلية.
            </p>
            <p>
              في ظل انتشار المنتجات المقلدة في الأسواق، رفعنا راية <strong className="text-[#D4AF37]">"الأصلية فقط مع الضمان الذهبي"</strong>. نوفر أرقى الشواحن التوربينية والبطاريات السفري العملاقة من Temax وRonin وKingTel وLens Shield مع خدمات استشارية وفنية مميزة لكل محافظات اليمن.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-[#141414] p-4 rounded-xl border border-[#222] space-y-1">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <div className="font-bold text-white">ضمان ذهبي معتمد</div>
              <p className="text-[11px] text-zinc-400">فحص واستبدال حقيقي دون أي تعقيد</p>
            </div>
            <div className="bg-[#141414] p-4 rounded-xl border border-[#222] space-y-1">
              <Truck className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <div className="font-bold text-white">تغطية شاملة لليمن</div>
              <p className="text-[11px] text-zinc-400">شحن موثوق لصنعاء وعدن وتعز وحضرموت</p>
            </div>
            <div className="bg-[#141414] p-4 rounded-xl border border-[#222] space-y-1">
              <Award className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <div className="font-bold text-white">خدمة الطلبات الخاصة</div>
              <p className="text-[11px] text-zinc-400">توفير أي منتج غير متوفر خلال أيام</p>
            </div>
          </div>

          {/* Official Contact Info Box */}
          <div className="p-4 rounded-2xl bg-[#171408] border border-[#3e320f] space-y-2">
            <h4 className="font-bold text-[#D4AF37] text-xs">معلومات التواصل الرسمية:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-200">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>اتصال وواتساب: <strong>780000751</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-en">إنستغرام: <strong>@6taaj</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200 sm:col-span-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>الجمهورية اليمنية - صنعاء / شحن فوري لكافة المحافظات</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
