import React, { useState } from 'react';
import {
  X,
  Wrench,
  Search,
  CheckCircle2,
  Clock,
  Smartphone,
  Phone,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { MaintenanceRequest } from '../types';
import { storeService } from '../services/storeService';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'track' | 'submit'>('track');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [matchedRequests, setMatchedRequests] = useState<MaintenanceRequest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Submit form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<MaintenanceRequest | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;
    setHasSearched(true);
    const all = await storeService.getMaintenanceRequests();
    const query = phoneSearch.trim();
    setMatchedRequests(all.filter(r => r.phone.includes(query) || r.id.includes(query)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !deviceModel.trim() || !issue.trim()) return;
    setIsSubmitting(true);

    const newReq: MaintenanceRequest = {
      id: 'maint-' + Math.floor(100 + Math.random() * 900),
      customerName: customerName.trim(),
      phone: phone.trim(),
      deviceModel: deviceModel.trim(),
      issue: issue.trim(),
      status: 'قيد الفحص',
      receivedAt: new Date().toISOString(),
      notes: 'تم استلام الجهاز في مركز الصيانة المعتمد للوكالة.'
    };

    await storeService.saveMaintenanceRequest(newReq);
    setSubmittedTicket(newReq);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">مركز صيانة الهواتف الذكية</h2>
              <p className="text-[11px] text-zinc-400">فحص وصيانة أجهزة آيفون وسامسونج وقطع أصلية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#202020] bg-[#111]">
          <button
            onClick={() => { setActiveTab('track'); setSubmittedTicket(null); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'track'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            متابعة حالة جهاز تحت الصيانة
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'submit'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            تسجيل طلب صيانة جديد
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'track' ? (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  placeholder="أدخل رقم الهاتف للبحث عن تذاكر الصيانة..."
                  required
                  className="flex-1 bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Search className="w-4 h-4" />
                  <span>بحث</span>
                </button>
              </form>

              {hasSearched && matchedRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500 bg-[#121212] rounded-2xl border border-[#222]">
                  لا توجد أجهزة مسجلة في قسم الصيانة بهذا الرقم حالياً.
                </div>
              ) : (
                matchedRequests.map(ticket => (
                  <div key={ticket.id} className="bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-sm font-bold text-white">{ticket.deviceModel}</span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        ticket.status === 'جاهز للاستلام' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        ticket.status === 'جاري الإصلاح' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        ticket.status === 'تم التسليم' ? 'bg-zinc-800 text-zinc-300' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <p><span className="text-zinc-500">العميل:</span> {ticket.customerName}</p>
                      <p><span className="text-zinc-500">المشكلة المشخصة:</span> {ticket.issue}</p>
                      {ticket.notes && <p><span className="text-zinc-500">تقرير الفني:</span> {ticket.notes}</p>}
                      {ticket.cost && <p><span className="text-zinc-500">التكلفة المقدرة:</span> <span className="font-mono font-bold text-[#D4AF37]">{ticket.cost.toLocaleString('en-US')} ريال</span></p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            submittedTicket ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">تم فتح تذكرة الصيانة بنجاح!</h3>
                <p className="text-xs text-zinc-400">
                  رقم التذكرة: <span className="font-mono text-[#D4AF37] font-bold">{submittedTicket.id}</span>
                </p>
                <p className="text-xs text-zinc-500">تفضل بزيارة فرع الوكالة الحديثة أو تواصل معنا عبر واتساب 780000751 لتسليم الجهاز للفحص الأولي.</p>
                <button
                  onClick={() => { setActiveTab('track'); setSubmittedTicket(null); }}
                  className="bg-[#D4AF37] text-black text-xs font-bold px-5 py-2.5 rounded-full mt-2"
                >
                  عرض تفاصيل التذكرة
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 font-bold mb-1 block">اسم صاحب الجهاز *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="اسمك الكريم"
                      className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-300 font-bold mb-1 block">رقم الهاتف (واتساب) *</label>
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
                  <label className="text-[11px] text-zinc-300 font-bold mb-1 block">موديل الجهاز ونوعه *</label>
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="مثال: iPhone 14 Pro Max أو Samsung S23 Ultra أو شاحن سيارة..."
                    className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 font-bold mb-1 block">وصف المشكلة أو العطل *</label>
                  <textarea
                    required
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="مثال: منفذ الشحن لا يشحن، البطارية تهبط سريعاً، كسر في الكاميرا، تنظيف سماعة..."
                    rows={3}
                    className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs py-3.5 px-4 rounded-xl transition"
                >
                  {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الجهاز في الصيانة'}
                </button>
              </form>
            )
          )}

        </div>

      </div>
    </div>
  );
};
