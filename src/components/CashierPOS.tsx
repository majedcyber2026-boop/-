import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Search,
  ShoppingCart,
  User,
  Phone,
  RefreshCw
} from 'lucide-react';
import { Product, Order, CartItem, OrderStatus, PaymentMethodType } from '../types';
import { storeService } from '../services/storeService';

interface CashierPOSProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOrderCompleted: () => void;
}

export const CashierPOS: React.FC<CashierPOSProps> = ({
  isOpen,
  onClose,
  products,
  onOrderCompleted
}) => {
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('عميل مباشر');
  const [customerPhone, setCustomerPhone] = useState('780000751');
  const [governorate, setGovernorate] = useState('صنعاء');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('الدفع عند الاستلام');
  const [searchFilter, setSearchFilter] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successSale, setSuccessSale] = useState<Order | null>(null);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    setPosCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setPosCart(prev =>
      prev
        .map(i => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const subtotal = posCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCompleteSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (posCart.length === 0) return;
    setIsProcessing(true);

    const newSaleOrder: Order = {
      id: 'POS-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerName.trim() || 'عميل الفرع',
      phone: customerPhone.trim() || '780000751',
      governorate,
      address: 'بيع مباشر من المحل / كاشير الوكالة الحديثة',
      items: posCart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        brand: i.product.brand,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0]
      })),
      total: subtotal,
      subtotal,
      discount: 0,
      paymentMethod,
      paymentStatus: 'تم التحقق',
      priority: '🟡 عادي',
      status: 'تم التسليم',
      notes: 'مبيعات الكاشير المباشرة POS',
      createdAt: new Date().toISOString()
    };

    await storeService.saveOrder(newSaleOrder);
    setSuccessSale(newSaleOrder);
    setPosCart([]);
    setIsProcessing(false);
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/95 backdrop-blur-md flex flex-col animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-[#0a0a0a] border-b border-[#262626] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black font-black flex items-center justify-center font-en">
            POS
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">نظام الكاشير ونقاط البيع السريعة (POS)</h2>
            <p className="text-[11px] text-zinc-400">الوكالة الحديثة للهواتف الذكية WAKNOVA - صلاحيات البيع المباشر</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Products Grid */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden border-b md:border-b-0 md:border-l border-[#202020]">
          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="بحث سريع عن الصنف أو الماركة..."
              className="w-full bg-[#121212] border border-[#262626] focus:border-[#D4AF37] text-xs text-white rounded-xl py-2.5 pr-9 pl-4 outline-none"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
          </div>

          {/* Product Items */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-1">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => handleAddToCart(p)}
                className="bg-[#111] hover:bg-[#181818] border border-[#222] hover:border-[#D4AF37]/50 p-2.5 rounded-xl cursor-pointer transition flex flex-col justify-between select-none active:scale-95"
              >
                <div className="aspect-square bg-[#161616] rounded-lg p-2 flex items-center justify-center mb-1.5">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-bold block">{p.brand}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-mono font-bold text-white">{p.price.toLocaleString('en-US')} ريال</span>
                    <span className="text-[10px] text-zinc-400 font-mono">({p.quantity})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Checkout Terminal */}
        <div className="w-full md:w-96 bg-[#0d0d0d] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                <span>سلة البيع الحالية ({posCart.reduce((acc, i) => acc + i.quantity, 0)})</span>
              </h3>
              {posCart.length > 0 && (
                <button
                  onClick={() => setPosCart([])}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  إفراغ السلة
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {posCart.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  اضغط على أي صنف لإضافته إلى فاتورة البيع
                </div>
              ) : (
                posCart.map(item => (
                  <div key={item.product.id} className="bg-[#141414] p-2 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">{item.product.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {item.product.price} × {item.quantity} = {item.product.price * item.quantity} ريال
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="w-6 h-6 rounded bg-[#222] hover:bg-zinc-700 flex items-center justify-center text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-white font-mono">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="w-6 h-6 rounded bg-[#222] hover:bg-zinc-700 flex items-center justify-center text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Customer Info */}
            <div className="space-y-2 border-t border-[#222] pt-3 text-xs">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اسم العميل"
                className="w-full bg-[#141414] border border-[#262626] rounded-xl p-2 text-white"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="رقم الهاتف"
                className="w-full bg-[#141414] border border-[#262626] rounded-xl p-2 text-white font-mono"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#262626] rounded-xl p-2 text-white"
              >
                <option value="الدفع عند الاستلام">كاش مباشر (نقدي)</option>
                <option value="الكريمي المميز">حساب الكريمي</option>
                <option value="جيب (Jeeb)">محفظة جيب</option>
                <option value="ون كاش (OneCash)">محفظة ون كاش</option>
              </select>
            </div>
          </div>

          {/* Bottom Total & Checkout Button */}
          <div className="pt-4 border-t border-[#222] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">إجمالي الفاتورة:</span>
              <div className="text-xl font-black text-[#D4AF37] font-mono">
                {subtotal.toLocaleString('en-US')} ريال
              </div>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={posCart.length === 0 || isProcessing}
              className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-black text-xs py-3.5 rounded-xl transition disabled:opacity-40"
            >
              {isProcessing ? 'جاري الحفظ...' : 'إتمام البيع واستخراج السند'}
            </button>

            {successSale && (
              <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 p-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم إتمام الفاتورة بنجاح: {successSale.id}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
