import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  User,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus, UserProfile } from '../types';
import { storeService } from '../services/storeService';
import { Currency, formatPrice } from '../utils/currency';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  currency?: Currency;
  onOpenInvoice?: (order: Order) => void;
  onOpenWarranty?: (serialNumber?: string) => void;
}

const DETAILED_STEPS: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'جديدة', label: 'تم الاستلام', desc: 'تم تسجيل الطلب وحجز المنتجات من المستودع', icon: '📝' },
  { status: 'قيد التجهيز', label: 'الفحص والتجهيز', desc: 'فحص الجودة وتسجيل الأرقام التسلسلية والتغليف الفاخر', icon: '🔍' },
  { status: 'تم الشحن', label: 'جاري التوصيل', desc: 'الشحنة مع مندوب التوصيل أو شركة الشحن متجهة إليك', icon: '🚚' },
  { status: 'تم التسليم', label: 'تم التسليم والضمان', desc: 'تم الاستلام بنجاح وتفعيل الضمان الذهبي لـ WAKNOVA', icon: '✨' }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currency = 'YER',
  onOpenInvoice,
  onOpenWarranty
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_orders' | 'search'>(currentUser ? 'my_orders' : 'search');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // Load user orders if logged in
  useEffect(() => {
    if (isOpen && currentUser?.phone) {
      loadUserOrders();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const loadUserOrders = async () => {
    setIsLoading(true);
    const all = await storeService.getOrders();
    const userPhone = currentUser?.phone || '';
    const userEmail = currentUser?.email || '';
    const userMatched = all.filter(o => 
      (userPhone && o.phone.includes(userPhone)) ||
      (currentUser?.name && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase()))
    );
    setOrders(userMatched);
    setIsLoading(false);
    setHasSearched(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    const allOrders = await storeService.getOrders();
    const query = searchKey.trim().toLowerCase();

    const matched = allOrders.filter(o => 
      o.phone.includes(query) || 
      o.id.toLowerCase().includes(query) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(query)) ||
      o.customerName.toLowerCase().includes(query)
    );

    setOrders(matched);
    setIsLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) return;
    setCancellingOrderId(orderId);
    try {
      const ok = await storeService.cancelOrder(orderId, 'طلب إلغاء من العميل عبر التتبع');
      if (ok) {
        setCancelFeedback(`تم إلغاء الطلب ${orderId} بنجاح.`);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ملغاة' } : o));
      } else {
        alert('لا يمكن إلغاء الطلب لأنه قيد التجهيز أو تم شحنه بالفعل.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancellingOrderId(null);
      setTimeout(() => setCancelFeedback(null), 3000);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'ملغاة') return -1;
    return DETAILED_STEPS.findIndex(s => s.status === status);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#2a2414] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/70 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">رادار تتبع الطلبات والشحنات المباشر</h2>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  مباشر LIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">تتبع مسار شحنتك لحظة بلحظة واطلع على سيريال الضمان والفواتير</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle if User is Logged In */}
        {currentUser && (
          <div className="px-5 pt-4 bg-[#101010] border-b border-[#1f1f1f] flex gap-3">
            <button
              onClick={() => {
                setActiveTab('my_orders');
                loadUserOrders();
              }}
              className={`pb-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'my_orders'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>طلباتي السابقة ({currentUser.name})</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`pb-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'search'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>بحث عن طلب آخر</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">

          {/* Feedback banner */}
          {cancelFeedback && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-700 rounded-xl text-emerald-300 text-xs font-bold text-center animate-fadeIn">
              {cancelFeedback}
            </div>
          )}

          {/* Search Box (Always in search tab or if not logged in) */}
          {(activeTab === 'search' || !currentUser) && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="أدخل رقم الجوال (مثل 771234567) أو رقم الطلب (ORD-901) أو كود التتبع..."
                  required
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl py-3 pr-10 pl-4 outline-none font-mono"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
            </form>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12 text-xs text-zinc-400 space-y-2">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
              <p>جاري استرجاع سجل الشحنات والمسارات من قاعدة بيانات WAKNOVA...</p>
            </div>
          ) : hasSearched && orders.length === 0 ? (
            <div className="text-center py-12 bg-[#111] rounded-2xl border border-[#222] space-y-3 p-6">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">لم يتم العثور على أي طلبات مسجلة</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                يرجى التأكد من كتابة رقم الهاتف الصحيح المستخدم وقت إتمام الطلب أو رقم الطلب الرسمي (مثال: ORD-901).
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA%20أواجه%20مشكلة%20في%20تتبع%20طلبي"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>تواصل بالدعم عبر واتساب 780000751 للمساعدة الفورية</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const currentStep = getStepIndex(order.status);
                const isCancelled = order.status === 'ملغاة';
                const trackingNumber = order.trackingCode || `TRK-${order.id.replace('ORD-', '')}-751`;

                return (
                  <div
                    key={order.id}
                    className="bg-gradient-to-b from-[#131313] to-[#0d0d0d] border border-[#26241a] rounded-3xl p-4 sm:p-6 space-y-5 shadow-xl relative overflow-hidden"
                  >
                    {/* Top status bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202020] pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-base text-[#D4AF37]">{order.id}</span>
                          <span className="text-[10px] font-mono bg-[#1c1809] border border-[#52410e] text-[#D4AF37] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span>كود الشحنة: {trackingNumber}</span>
                            <button
                              onClick={() => handleCopy(trackingNumber)}
                              title="نسخ كود التتبع"
                              className="text-zinc-400 hover:text-white ml-1"
                            >
                              {copiedCode === trackingNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </span>
                          <span className="text-[11px] bg-[#1a1a1a] text-zinc-300 px-2 py-0.5 rounded-lg border border-[#333]">
                            {order.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1.5 flex-wrap">
                          <span>العميل: <strong className="text-white">{order.customerName}</strong></span>
                          <span>•</span>
                          <span>المحافظة: <strong className="text-zinc-200">{order.governorate}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-zinc-500">{new Date(order.createdAt).toLocaleDateString('ar-YE', { dateStyle: 'medium' })}</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-[11px] text-zinc-400 block">إجمالي الفاتورة:</span>
                        <span className="text-base font-black text-[#D4AF37] font-mono">
                          {formatPrice(order.total, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    {isCancelled ? (
                      <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-2xl text-center space-y-1">
                        <p className="text-sm font-bold text-red-400 flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>تم إلغاء هذا الطلب</span>
                        </p>
                        {order.cancellationReason && (
                          <p className="text-xs text-zinc-400">السبب: {order.cancellationReason}</p>
                        )}
                      </div>
                    ) : (
                      <div className="py-2 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative">
                          {DETAILED_STEPS.map((step, idx) => {
                            const isDone = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                              <div
                                key={step.status}
                                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                                  isCurrent
                                    ? 'bg-[#1b170a] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40'
                                    : isDone
                                    ? 'bg-[#101912] border-emerald-800/40 text-emerald-300'
                                    : 'bg-[#111] border-[#222] opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-base">{step.icon}</span>
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border border-zinc-700 text-[10px] text-zinc-500 flex items-center justify-center font-mono">
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#D4AF37]' : isDone ? 'text-white' : 'text-zinc-500'}`}>
                                    {step.label}
                                  </h4>
                                  <p className="text-[10px] text-zinc-400 leading-tight mt-1">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Courier info banner if shipping */}
                        {order.status === 'تم الشحن' && (
                          <div className="p-3 bg-[#17150c] border border-[#544314] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                                <Truck className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-white block">الشحنة على الطريق مع: {order.courierName || 'المندوب المعتمد'}</span>
                                <span className="text-[11px] text-zinc-400 font-mono">هاتف المندوب: {order.courierPhone || '780000751'}</span>
                              </div>
                            </div>
                            <a
                              href={`https://wa.me/967${order.courierPhone || '780000751'}?text=مرحباً%20معك%20العميل%20${order.customerName}%20بخصوص%20طلب%20${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>مراسلة المندوب</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items List with Gold Serials */}
                    <div className="pt-2 border-t border-[#202020] space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-bold">محتويات الطرد والأرقام التسلسلية المعتمدة:</span>
                        <span className="text-[11px] text-[#D4AF37] font-semibold">مشمولة بالضمان الذهبي 100%</span>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, i) => {
                          const itemSerial = item.serialNumber || `WAK-SN-${order.id.replace('ORD-', '')}${i + 1}`;
                          return (
                            <div
                              key={i}
                              className="flex flex-wrap items-center justify-between gap-2.5 text-xs bg-[#151515] hover:bg-[#181818] p-3 rounded-2xl border border-[#222] transition"
                            >
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-[#333]"
                                  />
                                )}
                                <div>
                                  <h5 className="font-bold text-white text-xs">
                                    {item.quantity}x {item.name}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#1d190b] px-2 py-0.5 rounded border border-[#52410e] flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3" />
                                      سيريال: {itemSerial}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-300 font-bold">
                                  {formatPrice(item.price * item.quantity, currency)}
                                </span>
                                {onOpenWarranty && (
                                  <button
                                    onClick={() => {
                                      onClose();
                                      onOpenWarranty(itemSerial);
                                    }}
                                    className="p-1.5 rounded-lg bg-[#222] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition text-[11px] font-bold flex items-center gap-1"
                                    title="فحص بطاقة الضمان الذهبي لهذا الجهاز"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">فحص الضمان</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions Suite */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#202020] text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Open Invoice Button */}
                        {onOpenInvoice && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenInvoice(order);
                            }}
                            className="bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] text-zinc-200 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>عرض الفاتورة الرسمية</span>
                          </button>
                        )}

                        {/* WhatsApp support */}
                        <a
                          href={`https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA%20أتابع%20طلبي%20رقم%20${order.id}%20(كود%20الشحنة%20${trackingNumber})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#172419] hover:bg-[#1e3221] border border-emerald-800/60 text-emerald-400 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>استفسار واتساب</span>
                        </a>

                        {/* Cancel order if still 'جديدة' */}
                        {order.status === 'جديدة' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrderId === order.id}
                            className="bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-300 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{cancellingOrderId === order.id ? 'جاري الإلغاء...' : 'إلغاء الطلب'}</span>
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>الدفع: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
