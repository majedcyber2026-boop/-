import React, { useState } from 'react';
import {
  X,
  Wrench,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Smartphone,
  Battery,
  Volume2,
  Droplets,
  Camera,
  ArrowRight,
  Phone
} from 'lucide-react';
import { MaintenanceRequest, UserProfile } from '../types';
import { storeService } from '../services/storeService';
import { Currency, formatPrice } from '../utils/currency';

interface HardwareDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  currency?: Currency;
  onBookingSuccess?: (ticketId: string) => void;
}

const COMMON_DEVICES = [
  'iPhone 16 Pro Max',
  'iPhone 15 Pro / Pro Max',
  'iPhone 14 / 14 Plus',
  'iPhone 13 / 13 Pro',
  'iPhone 12 / 12 Pro',
  'iPhone 11 / 11 Pro',
  'Samsung Galaxy S24 Ultra',
  'Samsung Galaxy S23 Ultra',
  'Samsung Galaxy S22 / S21',
  'Samsung Galaxy A55 / A54',
  'Xiaomi Redmi Note 13 / 12',
  'Honor 90 / Magic 6',
  'جهاز ذكي آخر'
];

const SYMPTOMS_LIST = [
  { id: 'screen_broken', label: 'كسر زجاج الشاشة الخارجي', icon: Smartphone, cat: 'شاشة' },
  { id: 'screen_lines', label: 'خطوط بيضاء أو خضراء بالشاشة', icon: Smartphone, cat: 'شاشة' },
  { id: 'touch_ghost', label: 'اللمس يعلق أو يضغط ذاتياً', icon: Smartphone, cat: 'شاشة' },
  { id: 'battery_drain', label: 'استنزاف شحن سريع ونفاد مفاجئ', icon: Battery, cat: 'بطارية' },
  { id: 'battery_hot', label: 'حرارة مرتفعة وانتفاخ بالجهاز', icon: Battery, cat: 'بطارية' },
  { id: 'no_charge', label: 'منفذ الشحن لا يستجيب للكيبل', icon: Battery, cat: 'شحن' },
  { id: 'water_damage', label: 'سقوط في ماء أو سوائل', icon: Droplets, cat: 'سوائل' },
  { id: 'mic_speaker', label: 'صوت المكالمات مكتوم أو المايك ضعيف', icon: Volume2, cat: 'صوت' },
  { id: 'cam_shake', label: 'اهتزاز الكاميرا أو تشويش التركيز', icon: Camera, cat: 'كاميرا' },
  { id: 'restart_loop', label: 'إعادة تشغيل مستمرة (Bootloop)', icon: Cpu, cat: 'لوحة أم' }
];

export const HardwareDiagnosticsModal: React.FC<HardwareDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currency = 'YER',
  onBookingSuccess
}) => {
  const [deviceModel, setDeviceModel] = useState(COMMON_DEVICES[0]);
  const [customDevice, setCustomDevice] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    diagnosticTitle: string;
    severity: string;
    rootCause: string;
    recommendedRepair: string;
    estimatedCostYer: number;
    estimatedDurationMins: number;
    warrantyCoverage: string;
    preventiveTips: string[];
  } | null>(null);

  const [bookingName, setBookingName] = useState(currentUser?.name || '');
  const [bookingPhone, setBookingPhone] = useState(currentUser?.phone || '');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedTicketId, setBookedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const effectiveDevice = deviceModel === 'جهاز ذكي آخر' ? customDevice.trim() || 'هاتف ذكي' : deviceModel;

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !description.trim()) {
      alert('يرجى تحديد عرض واحد على الأقل أو كتابة وصف المشكلة');
      return;
    }

    setIsDiagnosing(true);
    setDiagnosticResult(null);
    setBookedTicketId(null);

    try {
      const res = await fetch('/api/gemini/hardware-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceModel: effectiveDevice,
          symptoms: selectedSymptoms,
          description: description.trim()
        })
      });

      const data = await res.json();
      setDiagnosticResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleBookRepair = async () => {
    if (!bookingPhone.trim() || !bookingName.trim()) {
      alert('يرجى إدخال اسمك ورقم هاتفك لحجز موعد الصيانة');
      return;
    }

    setIsBooking(true);
    const ticketId = 'MNT-' + Math.floor(1000 + Math.random() * 9000);
    const newReq: MaintenanceRequest = {
      id: ticketId,
      customerName: bookingName.trim(),
      phone: bookingPhone.trim(),
      deviceModel: effectiveDevice,
      issue: `${diagnosticResult?.diagnosticTitle || 'عطل فني'} (${selectedSymptoms.join(' ، ')})`,
      status: 'قيد الفحص',
      receivedAt: new Date().toISOString(),
      cost: diagnosticResult?.estimatedCostYer || 15000,
      notes: `حجز ذكي عبر المستشار الفني - مدة الإصلاح المتوقعة: ${diagnosticResult?.estimatedDurationMins || 45} دقيقة`
    };

    try {
      await storeService.saveMaintenanceRequest(newReq);
      setBookedTicketId(ticketId);
      if (onBookingSuccess) onBookingSuccess(ticketId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <Cpu className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">مستشار تشخيص أعطال الهواتف</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold border border-[#D4AF37]/30">
                  AI Hardware Lab
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                تشخيص فوري دقيق لعتاد جهازك، تقدير تكلفة قطع الغيار والوقت، مع حجز صيانة فوري
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
          
          {bookedTicketId ? (
            /* Booking Confirmed View */
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#D4AF37] font-bold">تم تسجيل موعد الصيانة بنجاح</span>
                <h3 className="text-xl font-black text-white">
                  رقم تذكرة الصيانة: <span className="font-mono text-[#D4AF37]">{bookedTicketId}</span>
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  تفضل بزيارة فرع الوكالة (شارع صخر أو شارع حدة) لتسليم الجهاز لمهندس الصيانة المعتمد والحصول على فحص مجهري مجاني.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setDiagnosticResult(null);
                    setBookedTicketId(null);
                  }}
                  className="px-5 py-2.5 bg-[#181818] hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl"
                >
                  فحص جهاز آخر
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
            /* Diagnostic Form & Result */
            <div className="space-y-6">
              
              <form onSubmit={handleDiagnose} className="space-y-4">
                {/* Device Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    اختر طراز هاتفك أو جهازك:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2b2b2b] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    >
                      {COMMON_DEVICES.map(dev => (
                        <option key={dev} value={dev}>{dev}</option>
                      ))}
                    </select>

                    {deviceModel === 'جهاز ذكي آخر' && (
                      <input
                        type="text"
                        value={customDevice}
                        onChange={(e) => setCustomDevice(e.target.value)}
                        placeholder="اكتب اسم وطراز جهازك..."
                        className="w-full bg-[#141414] border border-[#2b2b2b] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Symptoms Pill Grid */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    حدد الأعراض التي تلاحظها في جهازك (يمكنك اختيار أكثر من عرض):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SYMPTOMS_LIST.map(sym => {
                      const isSelected = selectedSymptoms.includes(sym.label);
                      const Icon = sym.icon;
                      return (
                        <button
                          key={sym.id}
                          type="button"
                          onClick={() => toggleSymptom(sym.label)}
                          className={`p-2.5 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#221c0e] border-[#D4AF37] text-[#D4AF37] shadow-sm'
                              : 'bg-[#121212] border-[#222] text-zinc-400 hover:text-white hover:border-[#333]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                          <span className="text-[11px] font-bold leading-tight">{sym.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    ملاحظات إضافية أو وصف كيف بدأ العطل (اختياري):
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: سقط الهاتف من مسافة متر وبدأ يظهر شريط أخضر عمودي مع حرارة طفيفة..."
                    rows={2}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#D4AF37] rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDiagnosing}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#c29d2b] to-[#a8831b] hover:from-[#e5c14d] hover:to-[#c29d2b] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isDiagnosing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-black" />
                      <span>جاري الفحص المجهري بالذكاء الاصطناعي...</span>
                    </span>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 text-black" />
                      <span>تشخيص العطل وتقدير التكلفة والوقت فوراً</span>
                    </>
                  )}
                </button>
              </form>

              {/* DIAGNOSTIC REPORT CARD */}
              {diagnosticResult && (
                <div className="bg-[#121212] border border-[#52410e] rounded-2xl p-5 space-y-4 animate-fadeIn">
                  
                  {/* Title & Severity */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#202020]">
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-mono block">DIAGNOSTIC VERDICT</span>
                      <h3 className="text-sm sm:text-base font-black text-white">{diagnosticResult.diagnosticTitle}</h3>
                    </div>
                    <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-1 rounded-full font-bold">
                      مستوى الأولوية: {diagnosticResult.severity}
                    </span>
                  </div>

                  {/* Root Cause & Repair Procedure */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#161616] rounded-xl border border-[#262626] space-y-1">
                      <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>السبب الجذري المحتمل:</span>
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">{diagnosticResult.rootCause}</p>
                    </div>

                    <div className="p-3 bg-[#161616] rounded-xl border border-[#262626] space-y-1">
                      <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>الإجراء الفني المقترح:</span>
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">{diagnosticResult.recommendedRepair}</p>
                    </div>
                  </div>

                  {/* Estimation Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 bg-[#171409] border border-[#3d310e] rounded-xl">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">التكلفة التقديرية</span>
                      <div className="text-sm sm:text-base font-black text-[#D4AF37] font-mono">
                        {formatPrice(diagnosticResult.estimatedCostYer, currency)}
                      </div>
                    </div>

                    <div className="p-3 bg-[#171409] border border-[#3d310e] rounded-xl">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">مدة الإصلاح التقريبية</span>
                      <div className="text-sm sm:text-base font-black text-white flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{diagnosticResult.estimatedDurationMins} دقيقة</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#171409] border border-[#3d310e] rounded-xl">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">الضمان المعتمد</span>
                      <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ضمان ذهبي 6 أشهر</span>
                      </div>
                    </div>
                  </div>

                  {/* Preventive Tips */}
                  {diagnosticResult.preventiveTips?.length > 0 && (
                    <div className="p-3 bg-black/40 border border-[#222] rounded-xl text-[11px] text-zinc-400 space-y-1">
                      <strong className="text-white">نصيحة المهندس للوقاية:</strong>
                      <ul className="list-disc list-inside space-y-0.5 pr-1">
                        {diagnosticResult.preventiveTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instant Booking Strip */}
                  <div className="p-4 bg-gradient-to-r from-[#1c1809] to-[#0e0c05] border border-[#52410e] rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>حجز موعد الصيانة السريعة في المعرض:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="الاسم الكامل"
                        className="bg-[#141414] border border-[#333] text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="رقم الهاتف (77XXXXXXX)"
                        className="bg-[#141414] border border-[#333] text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#D4AF37] text-left ltr"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleBookRepair}
                      disabled={isBooking}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isBooking ? (
                        <span>جاري إصدار تذكرة الصيانة...</span>
                      ) : (
                        <>
                          <span>تأكيد حجز الموعد واستلام تذكرة الصيانة</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#080808] border-t border-[#1a1a1a] text-center text-[10px] text-zinc-500">
          مركز صيانة WAKNOVA المعتمد · فحص مجهري وقطع غيار أصلية 100% بضمان الوكالة الذهبي
        </div>

      </div>
    </div>
  );
};
