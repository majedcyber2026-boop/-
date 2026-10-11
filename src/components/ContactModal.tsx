import React from 'react';
import { X, Phone, MessageCircle, Instagram, MapPin, Clock, Send, Shield } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-en text-[#D4AF37] font-bold text-sm tracking-wider">WAKNOVA</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-sm sm:text-base font-bold text-white">اتصل بنا ومعلومات التواصل</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto text-xs text-zinc-300">
          
          <div className="bg-[#121212] p-5 rounded-2xl border border-[#262626] space-y-3">
            <h3 className="text-base font-bold text-white">معلومات المحل الرسمية:</h3>
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <span className="text-zinc-500">الاسم الرسمي:</span>
                <span className="font-bold text-white">الوكالة الحديثة للهواتف الذكية ومستلزماتها</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <span className="text-zinc-500">الاسم التجاري:</span>
                <span className="font-bold text-[#D4AF37] font-en text-sm tracking-wider">WAKNOVA</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <span className="text-zinc-500">الدولة:</span>
                <span className="font-bold text-white">الجمهورية اليمنية</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <span className="text-zinc-500">واتساب + اتصال:</span>
                <a href="tel:780000751" className="font-bold text-[#D4AF37] font-mono hover:underline" dir="ltr">
                  780000751
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">إنستغرام:</span>
                <a href="https://instagram.com/6taaj" target="_blank" rel="noopener noreferrer" className="font-bold text-white font-en hover:text-[#D4AF37]" dir="ltr">
                  @6taaj
                </a>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#171408] border border-[#3e320f] hover:border-[#D4AF37] transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs group-hover:text-[#D4AF37] transition">محادثة واتساب فورية</h4>
                <p className="text-[11px] text-zinc-400">780000751 - رد فوري على مدار اليوم</p>
              </div>
            </a>

            <a
              href="https://instagram.com/6taaj"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#121212] border border-[#262626] hover:border-zinc-500 transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs group-hover:text-amber-400 transition">تابعنا على إنستغرام</h4>
                <p className="text-[11px] text-zinc-400 font-en">@6taaj - أحدث الوصولات والعروض</p>
              </div>
            </a>
          </div>

          {/* Working Hours & Branches */}
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#262626] space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>أوقات العمل واستقبال الطلبات:</span>
            </h4>
            <p className="text-zinc-400">
              السبت - الخميس: من 9:00 صباحاً حتى 10:00 مساءً.<br />
              الجمعة: من 4:00 عصراً حتى 10:00 مساءً.<br />
              شحن الطلبات للمحافظات يومياً عبر المكاتب المعتمدة (الرويشان، البراق، النسر، الإعصار).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
