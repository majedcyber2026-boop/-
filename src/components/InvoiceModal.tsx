import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Shield,
  QrCode,
  Calendar,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Copy,
  Receipt
} from 'lucide-react';
import { Order } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  currency?: Currency;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  currency = 'YER'
}) => {
  const [invoiceType, setInvoiceType] = useState<'a4' | 'thermal'>('a4');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `WAKNOVA-INVOICE:${order.id}|TOTAL:${order.total}YER|CUSTOMER:${order.customerName}|DATE:${order.createdAt}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white">
        
        {/* Actions Bar (Hidden during Print) */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/70 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">فاتورة الشراء الرسمية</h3>
                <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {order.id}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">الوكالة الحديثة للهواتف الذكية ومستلزماتها</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Invoice Format Toggle */}
            <div className="hidden sm:flex bg-[#141414] border border-[#2b2b2b] rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => setInvoiceType('a4')}
                className={`px-2.5 py-1 rounded transition ${
                  invoiceType === 'a4'
                    ? 'bg-[#D4AF37] text-black font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                رسمية A4
              </button>
              <button
                onClick={() => setInvoiceType('thermal')}
                className={`px-2.5 py-1 rounded transition ${
                  invoiceType === 'thermal'
                    ? 'bg-[#D4AF37] text-black font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                حرارية (80mm)
              </button>
            </div>

            {/* Print & PDF Action */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#b38f26] hover:from-[#e5c14d] hover:to-[#c29d2b] text-black font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
              title="طباعة أو تصدير PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Viewport */}
        <div className="p-4 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible">
          
          {/* A4 LUXURY INVOICE VIEW */}
          {invoiceType === 'a4' ? (
            <div className="bg-[#121212] print:bg-white text-zinc-200 print:text-black border border-[#262626] print:border-none rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl print:shadow-none max-w-2xl mx-auto">
              
              {/* Header Strip */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#2b2515] print:border-black/20 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#735813] p-0.5 flex items-center justify-center print:bg-black">
                    <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                      <span className="text-[#D4AF37] font-black text-2xl font-mono">W</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-white print:text-black tracking-wide">
                      الوكالة الحديثة للهواتف الذكية ومستلزماتها
                    </h1>
                    <p className="text-xs text-[#D4AF37] print:text-zinc-700 font-bold tracking-widest font-mono">
                      WAKNOVA LUXURY SMARTPHONES & ACCESSORIES
                    </p>
                    <p className="text-[11px] text-zinc-400 print:text-zinc-600">
                      صنعاء - شارع صخر / شارع حدة · هاتف: 780000751
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-left self-end sm:self-auto space-y-1">
                  <div className="inline-block bg-[#1f1b0f] print:bg-zinc-100 border border-[#52410e] print:border-zinc-300 px-3 py-1 rounded-lg">
                    <span className="text-[10px] text-zinc-400 print:text-zinc-600 block">رقم الفاتورة المعتمد</span>
                    <span className="text-sm font-mono font-black text-[#D4AF37] print:text-black">{order.id}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 print:text-zinc-600 font-mono">
                    {new Date(order.createdAt).toLocaleDateString('ar-YE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Customer and Order Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#161616] print:bg-zinc-50 border border-[#222] print:border-zinc-200 text-xs">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#D4AF37] print:text-black text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>بيانات العميل المستلم:</span>
                  </h4>
                  <p className="text-white print:text-black font-bold text-sm">{order.customerName}</p>
                  <p className="text-zinc-400 print:text-zinc-700 font-mono" dir="ltr">{order.phone}</p>
                  <p className="text-zinc-400 print:text-zinc-700">{order.governorate} - {order.address}</p>
                </div>

                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-r border-[#262626] print:border-zinc-200 pt-3 sm:pt-0 sm:pr-4">
                  <h4 className="font-extrabold text-[#D4AF37] print:text-black text-xs flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>تفاصيل العملية والدفع:</span>
                  </h4>
                  <p className="text-zinc-300 print:text-black">
                    <strong>طريقة الدفع:</strong> {order.paymentMethod}
                  </p>
                  <p className="text-zinc-300 print:text-black">
                    <strong>حالة الطلب:</strong> <span className="text-emerald-400 print:text-black font-bold">{order.status}</span>
                  </p>
                  <p className="text-zinc-300 print:text-black">
                    <strong>الأولوية:</strong> {order.priority}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-[#2b2515] print:border-black/30 text-zinc-400 print:text-black bg-[#16140d] print:bg-zinc-100">
                      <th className="p-2.5 font-bold">#</th>
                      <th className="p-2.5 font-bold">المنتج والماركة</th>
                      <th className="p-2.5 font-bold text-center">الكمية</th>
                      <th className="p-2.5 font-bold text-left">سعر الوحدة</th>
                      <th className="p-2.5 font-bold text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020] print:divide-zinc-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 print:hover:bg-transparent">
                        <td className="p-2.5 text-zinc-500 font-mono">{idx + 1}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-white print:text-black">{item.name}</div>
                          <span className="text-[10px] text-[#D4AF37] print:text-zinc-600 font-mono">{item.brand}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-white print:text-black">{item.quantity}</td>
                        <td className="p-2.5 text-left font-mono text-zinc-300 print:text-black">
                          {formatPrice(item.price, currency)}
                        </td>
                        <td className="p-2.5 text-left font-mono font-bold text-white print:text-black">
                          {formatPrice(item.price * item.quantity, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary & QR Code */}
              <div className="pt-4 border-t border-[#2b2515] print:border-black/30 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* QR Code Verification */}
                <div className="flex items-center gap-4 bg-[#141414] print:bg-zinc-50 p-3.5 rounded-2xl border border-[#222] print:border-zinc-200">
                  <img
                    src={qrDataUrl}
                    alt="QR Verification"
                    className="w-20 h-20 bg-white p-1 rounded-xl shrink-0"
                  />
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1 text-[#D4AF37] print:text-black font-bold">
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37] print:text-black" />
                      <span>التحقق من صحة الفاتورة</span>
                    </div>
                    <p className="text-zinc-400 print:text-zinc-600 leading-tight">
                      امسح رمز QR للتحقق الفوري من سريان الضمان الذهبي وأصالة المنتجات في نظام WAKNOVA.
                    </p>
                  </div>
                </div>

                {/* Numbers Summary */}
                <div className="space-y-2 text-xs text-left">
                  <div className="flex justify-between text-zinc-400 print:text-zinc-600">
                    <span className="text-right">المجموع الفرعي:</span>
                    <span className="font-mono font-bold text-white print:text-black">{formatPrice(order.subtotal, currency)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 print:text-black">
                      <span className="text-right">الخصم المطبق {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                      <span className="font-mono font-bold">- {formatPrice(order.discount, currency)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#333] print:border-black flex justify-between items-center text-sm">
                    <span className="font-black text-white print:text-black">المبلغ الإجمالي النهائي:</span>
                    <span className="font-mono font-black text-lg text-[#D4AF37] print:text-black">
                      {formatPrice(order.total, currency)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Warranty & Guarantee Stamp */}
              <div className="pt-4 border-t border-[#202020] print:border-zinc-300 text-[10px] text-zinc-400 print:text-zinc-600 space-y-1">
                <p className="font-bold text-zinc-300 print:text-black">
                  🛡️ الضمان الذهبي للوكالة الحديثة WAKNOVA:
                </p>
                <p>
                  جميع الأجهزة الإلكترونية والشواحن والسماعات مكفولة بضمان الوكالة الذهبي ضد العيوب المصنعية. تطبق شروط الاستبدال والإرجاع الرسمية خلال 3 أيام من تاريخ الاستلام مع إبراز هذه الفاتورة الأصلية.
                </p>
              </div>

            </div>
          ) : (
            /* THERMAL 80MM RECEIPT VIEW */
            <div className="w-[300px] mx-auto bg-white text-black p-4 font-mono text-[11px] space-y-3 border border-zinc-300 shadow-2xl print:border-none print:shadow-none print:p-0">
              
              <div className="text-center space-y-1 pb-2 border-b border-black border-dashed">
                <h2 className="text-sm font-black tracking-wider">WAKNOVA</h2>
                <p className="text-[10px]">الوكالة الحديثة للهواتف ومستلزماتها</p>
                <p className="text-[9px]">صنعاء · ت: 780000751</p>
                <div className="text-[10px] font-bold mt-1">فاتورة مبيعات #{order.id}</div>
                <div className="text-[9px] text-zinc-600">{order.createdAt.slice(0, 16).replace('T', ' ')}</div>
              </div>

              <div className="space-y-0.5 text-[10px] border-b border-black border-dashed pb-2">
                <div>العميل: {order.customerName}</div>
                <div>الهاتف: {order.phone}</div>
                <div>المحافظة: {order.governorate}</div>
                <div>الدفع: {order.paymentMethod}</div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 border-b border-black border-dashed pb-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[10px]">
                    <div className="w-3/5 truncate">
                      {item.quantity}x {item.name}
                    </div>
                    <div className="w-2/5 text-left font-bold">
                      {(item.price * item.quantity).toLocaleString('en-US')} YER
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>المجموع:</span>
                  <span>{order.subtotal.toLocaleString('en-US')} YER</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span>الخصم:</span>
                    <span>- {order.discount.toLocaleString('en-US')} YER</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                  <span>الصافي:</span>
                  <span>{order.total.toLocaleString('en-US')} YER</span>
                </div>
              </div>

              {/* QR and Barcode */}
              <div className="text-center pt-2 border-t border-black border-dashed space-y-1">
                <img
                  src={qrDataUrl}
                  alt="QR"
                  className="w-24 h-24 mx-auto"
                />
                <p className="text-[9px]">شكراً لثقتكم بالوكالة الحديثة!</p>
                <p className="text-[8px] text-zinc-500">احتفظ بالإيصال لخدمات الضمان والصيانة</p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#080808] border-t border-[#1a1a1a] flex items-center justify-between text-xs text-zinc-500 print:hidden px-6">
          <button
            onClick={handleCopyInvoiceNumber}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#D4AF37] transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'تم نسخ رقم الفاتورة!' : 'نسخ رقم الفاتورة'}</span>
          </button>
          <span>نظام فوترة WAKNOVA الرقمي الموحد</span>
        </div>

      </div>
    </div>
  );
};
