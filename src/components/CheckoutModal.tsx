import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Upload,
  CreditCard,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Wallet,
  Printer
} from 'lucide-react';
import { CartItem, Order, PaymentMethodConfig, PaymentMethodType, OrderPriority, UserProfile } from '../types';
import { storeService } from '../services/storeService';
import { authService } from '../services/authService';
import { Currency, formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discount: number;
  couponCode: string;
  onOrderSuccess: (order: Order) => void;
  paymentMethods: PaymentMethodConfig[];
  currentUser?: UserProfile | null;
  currency?: Currency;
  onOpenInvoice?: (order: Order) => void;
}

const YEMENI_GOVERNORATES = [
  'صنعاء (أمانة العاصمة)',
  'صنعاء (المحافظة)',
  'عدن',
  'تعز',
  'إب',
  'حضرموت (المكلا / سيئون)',
  'الحديدة',
  'ذمار',
  'مأرب',
  'لحج',
  'أبين',
  'شبوة',
  'البيضاء',
  'صعدة',
  'عمران',
  'حجة',
  'المحويت',
  'الضالع',
  'المهرة',
  'الجوف',
  'ريمة',
  'سقطرى'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discount,
  couponCode,
  onOrderSuccess,
  paymentMethods,
  currentUser,
  currency = 'YER',
  onOpenInvoice
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [governorate, setGovernorate] = useState(currentUser?.governorate || YEMENI_GOVERNORATES[0]);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('الدفع عند الاستلام');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [useWallet, setUseWallet] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
      if (currentUser.governorate) setGovernorate(currentUser.governorate);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalBeforeWallet = Math.max(0, subtotal - discount);
  const walletAvailable = currentUser?.walletBalance || 0;
  const walletDeduction = (useWallet && walletAvailable > 0) ? Math.min(walletAvailable, totalBeforeWallet) : 0;
  const total = Math.max(0, totalBeforeWallet - walletDeduction);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedWalletConfig = paymentMethods.find(p => p.walletName.includes(paymentMethod) || paymentMethod.includes(p.walletName));

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    // Call server Gemini to classify order priority automatically
    let classifiedPriority: OrderPriority = '🟡 عادي';
    try {
      const res = await fetch('/api/gemini/classify-priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          total,
          customerName
        })
      });
      const data = await res.json();
      if (data.priority) {
        classifiedPriority = data.priority as OrderPriority;
      }
    } catch {
      if (notes.includes('عاجل') || notes.includes('اليوم') || notes.includes('سفر')) {
        classifiedPriority = '🔴 عاجل جدًا';
      }
    }

    // Deduct from wallet if used
    if (walletDeduction > 0 && currentUser) {
      try {
        await authService.updateProfile({
          walletBalance: Math.max(0, walletAvailable - walletDeduction)
        });
      } catch (err) {
        console.warn('Wallet balance update error:', err);
      }
    }

    const orderNotes = [
      notes.trim(),
      walletDeduction > 0 ? `[تم استخدام رصيد المحفظة النقدية: خصم ${walletDeduction.toLocaleString('en-US')} ريال]` : ''
    ].filter(Boolean).join(' - ');

    const trackingCode = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerName.trim(),
      phone: phone.trim(),
      governorate,
      address: address.trim(),
      items: cartItems.map((i, idx) => ({
        productId: i.product.id,
        name: i.product.name,
        brand: i.product.brand,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        serialNumber: `WAK-${(i.product.brand || 'GOLD').toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`,
        warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })),
      total,
      subtotal,
      discount: discount + walletDeduction,
      couponCode: couponCode || undefined,
      paymentMethod: (walletDeduction >= totalBeforeWallet) ? 'ون كاش (OneCash)' : paymentMethod,
      paymentStatus: paymentMethod === 'الدفع عند الاستلام' ? 'بانتظار التحقق' : (receiptImage ? 'بانتظار التحقق' : 'بانتظار التحقق'),
      receiptImage: receiptImage || undefined,
      priority: classifiedPriority,
      status: 'جديدة',
      notes: orderNotes,
      createdAt: new Date().toISOString(),
      trackingCode,
      warrantyActivated: true,
      courierName: governorate.includes('صنعاء') ? 'مندوب الوكالة السريع (صنعاء)' : 'شركة النسر للشحن المعتمد',
      courierPhone: '780000751'
    };

    await storeService.saveOrder(newOrder);
    setCompletedOrder(newOrder);
    onOrderSuccess(newOrder);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-en text-[#D4AF37] font-bold tracking-widest text-sm">WAKNOVA</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {completedOrder ? 'تم تأكيد طلبك بنجاح' : 'إتمام الطلب وتحديد التوصيل'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#D4AF37] font-bold tracking-wider uppercase block">
                  تهانينا، تم استلام طلبك!
                </span>
                <h3 className="text-2xl font-black text-white">
                  رقم طلبك: <span className="font-mono text-[#D4AF37]">{completedOrder.id}</span>
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  شكراً لاختيارك الوكالة الحديثة للهواتف الذكية WAKNOVA. سيقوم فريق خدمة العملاء بالتواصل معك هاتفياً أو عبر واتساب لتأكيد الشحن.
                </p>
              </div>

              {/* Order Quick Details Box */}
              <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 text-xs text-right max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>العميل:</span>
                  <span className="text-white font-bold">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>رقم الهاتف:</span>
                  <span className="text-white font-mono">{completedOrder.phone}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>المحافظة والعنوان:</span>
                  <span className="text-white">{completedOrder.governorate} - {completedOrder.address}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>كود الشحنة للتتبع:</span>
                  <span className="text-[#D4AF37] font-mono font-bold">{completedOrder.trackingCode || 'TRK-7510'}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>الضمان الذهبي للأجهزة:</span>
                  <span className="text-emerald-400 font-bold">مفعّل وسارٍ (12 شهراً + استبدال 3 أيام)</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>طريقة الدفع:</span>
                  <span className="text-white">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>الأولوية المصنفة (AI):</span>
                  <span className="font-bold">{completedOrder.priority}</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-2 border-t border-[#222]">
                  <span>المبلغ الإجمالي:</span>
                  <span className="font-mono font-bold text-base text-[#D4AF37]">
                    {formatPrice(completedOrder.total, currency)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Invoice & WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                {onOpenInvoice && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenInvoice(completedOrder);
                      onClose();
                    }}
                    className="bg-[#1c1809] hover:bg-[#2a220b] border border-[#52410e] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#D4AF37]/10 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>عرض وطباعة الفاتورة (PDF)</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/967780000751?text=${encodeURIComponent(
                    `مرحباً وكالة WAKNOVA، لقد قمت بإنشاء طلب جديد في المتجر:\n- رقم الطلب: ${completedOrder.id}\n- الاسم: ${completedOrder.customerName}\n- الإجمالي: ${completedOrder.total} ريال يمني\n- المحافظة: ${completedOrder.governorate}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>تأكيد عبر واتساب</span>
                </a>

                <button
                  onClick={onClose}
                  className="bg-[#181818] hover:bg-zinc-800 text-zinc-300 text-xs font-bold py-3 px-5 rounded-2xl transition"
                >
                  العودة
                </button>
              </div>

            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>بيانات المستلم والتوصيل</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">الاسم الثلاثي *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: صالح علي الكبسي"
                      className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">رقم الهاتف (واتساب / اتصال) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 771234567"
                      className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">المحافظة *</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                    >
                      {YEMENI_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov} className="bg-zinc-900 text-white">
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">العنوان بالتفصيل والشارع *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="مثال: حي حدة - شارع بيروت - جوار..."
                      className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 mb-1 block">ملاحظات خاصة بالتسليم (اختياري)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="إذا كنت مستعجلاً، مسافر، أو تود الشحن عبر شركة معينة (الرويشان / البراق / النسر)..."
                    rows={2}
                    className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl p-3 outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-3 border-t border-[#202020]">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>طريقة الدفع</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'الدفع عند الاستلام', label: 'الدفع عند الاستلام (كاش)', note: 'داخل صنعاء' },
                    { id: 'الكريمي المميز', label: 'بنك الكريمي (حساب مميز)', note: 'تحويل فوري' },
                    { id: 'جيب (Jeeb)', label: 'محفظة جيب (Jeeb)', note: 'عبر الهاتف 780000751' },
                    { id: 'ون كاش (OneCash)', label: 'محفظة ون كاش (OneCash)', note: 'عبر الهاتف 780000751' },
                    { id: 'جوالي', label: 'محفظة جوالي (Jawwali)', note: 'عبر الهاتف 780000751' },
                  ].map(method => (
                    <label
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        paymentMethod === method.id
                          ? 'bg-[#1c1809] border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/15'
                          : 'bg-[#121212] border-[#222] text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{method.label}</div>
                        <div className="text-[10px] text-zinc-500">{method.note}</div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as PaymentMethodType)}
                        className="accent-[#D4AF37]"
                      />
                    </label>
                  ))}
                </div>

                {/* Wallet Details Display & Receipt Upload */}
                {paymentMethod !== 'الدفع عند الاستلام' && (
                  <div className="bg-[#141414] border border-[#3e320f] p-4 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#D4AF37] font-bold block">
                          بيانات التحويل لمحفظة {paymentMethod}:
                        </span>
                        <div className="text-base font-black font-mono text-white mt-0.5">
                          {selectedWalletConfig ? selectedWalletConfig.accountNumber : '780000751'}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          باسم: {selectedWalletConfig ? selectedWalletConfig.accountName : 'الوكالة الحديثة للهواتف الذكية WAKNOVA'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAccount(selectedWalletConfig?.accountNumber || '780000751')}
                        className="bg-[#1f1a0b] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#52410e] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedAccount ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                      </button>
                    </div>

                    {/* Receipt Image Upload */}
                    <div className="pt-2 border-t border-[#262626]">
                      <label className="text-[11px] text-zinc-300 font-bold block mb-1.5">
                        رفع صورة سند التحويل (اختياري / لتسريع التحقق):
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-[#1f1f1f] hover:bg-zinc-800 border border-[#333] hover:border-[#D4AF37] px-4 py-2 rounded-xl text-xs text-white flex items-center gap-2 transition">
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>اختر صورة السند</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {receiptImage && (
                          <div className="flex items-center gap-2">
                            <img src={receiptImage} alt="Receipt preview" className="w-9 h-9 object-cover rounded-lg border border-[#D4AF37]" />
                            <span className="text-[11px] text-emerald-400">تم إرفاق السند</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* WAKNOVA VIP Wallet Deduction Card */}
              {currentUser && walletAvailable > 0 && (
                <div className="p-4 bg-gradient-to-r from-[#1c1809] to-[#120f05] border border-[#52410e] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2a220b] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>محفظة WAKNOVA النقدية</span>
                        <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">رصيد VIP متاح</span>
                      </h4>
                      <p className="text-[11px] text-zinc-300">
                        الرصيد المتاح: <strong className="text-[#D4AF37] font-mono">{formatPrice(walletAvailable, currency)}</strong>
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#241c09] hover:bg-[#2f240b] border border-[#D4AF37]/40 px-3.5 py-2 rounded-xl transition">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-black text-white">خصم من الرصيد</span>
                  </label>
                </div>
              )}

              {/* Order Items & Price Summary Box */}
              <div className="bg-[#111] p-4 rounded-2xl border border-[#222] space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>عدد المنتجات:</span>
                  <span className="text-white font-mono">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} قطعة</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-white">{formatPrice(subtotal, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>الخصم المطبق ({couponCode}):</span>
                    <span className="font-mono">-{formatPrice(discount, currency)}</span>
                  </div>
                )}
                {walletDeduction > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-bold">
                    <span>الخصم من المحفظة النقدية:</span>
                    <span className="font-mono">-{formatPrice(walletDeduction, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>رسوم التوصيل:</span>
                  <span className="text-emerald-400 font-bold">حسب المحافظة (يدفع عند الاستلام)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#222]">
                  <span>المبلغ المطلوب سداده:</span>
                  <span className="text-lg font-mono text-[#D4AF37] font-black">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>جاري معالجة الطلب وتصنيف الأولوية بالذكاء الاصطناعي...</span>
                  </span>
                ) : (
                  <span>تأكيد الطلب الآن</span>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
