import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Award, Sparkles } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { Currency, formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (discount: number, couponCode: string) => void;
  coupons: Coupon[];
  currency?: Currency;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  coupons,
  currency = 'YER'
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.isPercentage) {
      discount = Math.round((subtotal * appliedCoupon.discount) / 100);
    } else {
      discount = appliedCoupon.discount;
    }
    discount = Math.min(discount, subtotal);
  }

  const grandTotal = Math.max(0, subtotal - discount);
  const earnedPoints = Math.floor(grandTotal / 1000) * 10;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError('كود الخصم غير صالح أو منتهي الصلاحية');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0d0d0d] border-r border-[#262626] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">
                سلة المشتريات ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] hover:bg-[#252525] text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2a2a2a] flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">سلتك فارغة حالياً</h3>
                  <p className="text-xs text-zinc-400 mt-1">تصفح تشكيلة الشواحن والسماعات الفاخرة وأضف ما يناسبك</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#D4AF37] text-black font-bold text-xs px-6 py-2.5 rounded-full hover:bg-[#e2c14f] transition"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#121212] border border-[#222] p-3.5 rounded-2xl flex gap-3.5 items-center justify-between"
                >
                  <div className="w-16 h-16 bg-[#181818] rounded-xl p-2 shrink-0 border border-[#262626] flex items-center justify-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#D4AF37] font-semibold font-en uppercase block">
                      {item.product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                    <div className="text-xs font-mono font-bold text-zinc-300 mt-1">
                      {item.product.price.toLocaleString('en-US')} ريال
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#333] rounded-lg bg-[#181818] overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs text-white font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity}
                          className="px-2 py-0.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-400 hover:text-red-300 p-1 transition"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-left font-mono font-bold text-xs text-white">
                    {formatPrice(item.product.price * item.quantity, currency)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#222] bg-[#090909] space-y-4">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="كود الخصم (مثل WAKNOVA10)"
                      className="w-full bg-[#141414] border border-[#2a2a2a] text-xs text-white uppercase rounded-xl py-2 px-3 outline-none focus:border-[#D4AF37]"
                    />
                    <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1c1809] border border-[#52410e] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    تطبيق
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    تم تطبيق الخصم: {appliedCoupon.code} ({appliedCoupon.isPercentage ? `${appliedCoupon.discount}%` : `${formatPrice(appliedCoupon.discount, currency)}`})
                  </p>
                )}
                {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              </form>

              {/* Loyalty Points Pill */}
              <div className="bg-[#141414] p-2.5 rounded-xl border border-[#262626] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>نقاط الولاء المكتسبة:</span>
                </div>
                <span className="font-bold text-[#D4AF37] font-mono">+{earnedPoints} نقطة</span>
              </div>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-white">{formatPrice(subtotal, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>قيمة الخصم:</span>
                    <span className="font-mono">-{formatPrice(discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#222]">
                  <span>الإجمالي النهائي:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#D4AF37] font-mono">
                      {formatPrice(grandTotal, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => onProceedToCheckout(discount, appliedCoupon?.code || '')}
                className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
