import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Clock, Sparkles, Phone, MessageSquare } from 'lucide-react';
import { SpecialOrder } from '../types';
import { storeService } from '../services/storeService';

interface SpecialOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecialOrderModal: React.FC<SpecialOrderModalProps> = ({ isOpen, onClose }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [neededBy, setNeededBy] = useState('اليوم');
  const [customDate, setCustomDate] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const finalNeededBy = neededBy === 'تاريخ محدد' ? `تاريخ محدد: ${customDate}` : neededBy;

    const newSpecialOrder: SpecialOrder = {
      id: 'sp-' + Date.now(),
      productName: productName.trim(),
      quantity,
      neededBy: finalNeededBy,
      notes: notes.trim(),
      phone: phone.trim(),
      status: 'بانتظار الرد',
      createdAt: new Date().toISOString()
    };

    await storeService.saveSpecialOrder(newSpecialOrder);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e1a0b] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                طلب منتج غير متوفر (طلب خاص)
              </h2>
              <p className="text-[11px] text-zinc-400">خدمة التوفير الحصرية من WAKNOVA</p>
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
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">تم استلام طلبك بنجاح!</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                سيبحث فريق الوكالة الحديثة عن المنتج لدى الوكلاء والموردين المعتمدين وسنرد عليك عبر الواتساب أو الهاتف خلال ساعات لإبلاغك بإمكانية التوفير والسعر المقدر.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs py-2.5 px-6 rounded-full transition"
                >
                  حسناً، فهمت
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="text-[11px] text-zinc-300 font-bold mb-1 block">
                  اسم المنتج أو القطعة المطلوبة بالتفصيل *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: شاحن أنكر 65W أو قلم S-Pen لسامسونج S24 Ultra أو كابل أصلي..."
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-300 font-bold mb-1 block">الكمية المطلوبة *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 font-bold mb-1 block">رقم هاتفك (واتساب) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="77xxxxxxx"
                    className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 font-bold mb-1 block">الوقت المطلوب للاستلام *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['اليوم', 'هذا الأسبوع', 'تاريخ محدد'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNeededBy(option)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        neededBy === option
                          ? 'bg-[#1c1809] border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#121212] border-[#222] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {neededBy === 'تاريخ محدد' && (
                  <input
                    type="date"
                    required
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="mt-2 w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-2.5 outline-none font-mono"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 font-bold mb-1 block">
                  ملاحظات ومواصفات إضافية (الموديل، اللون، الإصدار)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل تساعدنا في إيجاد المنتج بدقة..."
                  rows={3}
                  className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب المنتج للمدير'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
