import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X, Sparkles, MapPin } from 'lucide-react';
import { Currency, formatPrice } from '../utils/currency';
import { storeService } from '../services/storeService';
import { Order } from '../types';

interface LivePurchaseTickerProps {
  currency?: Currency;
  onSelectProduct?: (productName: string) => void;
}

interface TickerItem {
  customerName: string;
  governorate: string;
  productName: string;
  image?: string;
  price: number;
  timeAgo: string;
}

const FALLBACK_TICKERS: TickerItem[] = [
  {
    customerName: 'محمد الكبسي',
    governorate: 'صنعاء',
    productName: 'شاحن Temax 35W GaN التوربيني مزدوج Type-C',
    image: 'https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80',
    price: 7800,
    timeAgo: 'منذ دقيقتين'
  },
  {
    customerName: 'فؤاد اليافعي',
    governorate: 'عدن',
    productName: 'سماعات KingTel TWS Pro اللاسلكية ANC',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    price: 11000,
    timeAgo: 'منذ 5 دقائق'
  },
  {
    customerName: 'صالح باوزير',
    governorate: 'حضرموت',
    productName: 'بطارية سفري Temax 30000mAh العملاقة 65W',
    image: 'https://images.unsplash.com/photo-1619472363539-786d790445d4?auto=format&fit=crop&w=800&q=80',
    price: 24000,
    timeAgo: 'منذ 9 دقائق'
  },
  {
    customerName: 'مازن الحكيمي',
    governorate: 'تعز',
    productName: 'ستاند شاحن لاسلكي 3 في 1 فاخر WAKNOVA',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
    price: 16500,
    timeAgo: 'منذ 14 دقيقة'
  },
  {
    customerName: 'أروى الشامي',
    governorate: 'إب',
    productName: 'كابل Ronin PD 100W قماش مصفح Type-C',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    price: 3200,
    timeAgo: 'منذ 18 دقيقة'
  }
];

export const LivePurchaseTicker: React.FC<LivePurchaseTickerProps> = ({
  currency = 'YER',
  onSelectProduct
}) => {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Attempt to load from real orders
    storeService.getOrders().then(orders => {
      if (orders && orders.length > 0) {
        const mapped: TickerItem[] = orders.slice(0, 10).map((o, idx) => {
          const firstItem = o.items[0];
          return {
            customerName: o.customerName.split(' ')[0] + ' ' + (o.customerName.split(' ')[1] || ''),
            governorate: o.governorate,
            productName: firstItem?.name || 'منتج أصلي من الوكالة',
            image: firstItem?.image,
            price: firstItem?.price || o.total,
            timeAgo: `منذ ${Math.max(2, (idx + 1) * 4)} دقائق`
          };
        });
        if (mapped.length > 0) {
          setItems(mapped);
        }
      }
    }).catch(() => {});
  }, []);

  // Interval rotation
  useEffect(() => {
    if (isDismissed) return;

    // Show initial notification after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      // Hide
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
        setIsVisible(true);
      }, 800);
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [items.length, isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = items[currentIndex];
  if (!current) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-xs sm:max-w-sm bg-gradient-to-r from-[#14120a] to-[#0d0d0d] border border-[#52410e]/70 rounded-2xl p-3 shadow-2xl shadow-black/80 backdrop-blur-md animate-fadeIn transition-all transform hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        {/* Product Image or Icon */}
        <div className="relative flex-shrink-0">
          {current.image ? (
            <img
              src={current.image}
              alt={current.productName}
              className="w-11 h-11 rounded-xl object-cover border border-[#44350e]"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          )}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
            <CheckCircle2 className="w-2.5 h-2.5 text-black" />
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-white flex items-center gap-1 truncate">
              <span>اشترى {current.customerName}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 flex items-center gap-0.5 text-[10px]">
                <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                {current.governorate}
              </span>
            </span>
            <span className="text-[9px] text-[#D4AF37] font-mono flex-shrink-0">
              {current.timeAgo}
            </span>
          </div>

          <p className="text-[11px] text-zinc-300 font-semibold truncate mt-0.5">
            {current.productName}
          </p>

          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] font-black text-[#D4AF37] font-mono">
              {formatPrice(current.price, currency)}
            </span>
            <span className="text-[9px] bg-[#1a180d] text-[#D4AF37] border border-[#544314] px-1.5 py-0.2 rounded font-bold">
              طلب معتمد ✓
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
          title="إغلاق التنبيهات"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
