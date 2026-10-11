import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Award,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  ExternalLink,
  LogOut,
  Edit2,
  Check,
  Wallet,
  Shield,
  Crown,
  Briefcase,
  FileText
} from 'lucide-react';
import { Order, Product, Customer, UserProfile } from '../types';
import { storeService } from '../services/storeService';
import { authService } from '../services/authService';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onOpenProduct: (product: Product) => void;
  onOpenTracking: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenInvoice?: (order: Order) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onOpenProduct,
  onOpenTracking,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editGovernorate, setEditGovernorate] = useState(currentUser?.governorate || 'صنعاء');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditGovernorate(currentUser.governorate);
      setEditAddress(currentUser.address || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isOpen) return;

    storeService.getOrders().then(orders => {
      if (currentUser?.phone) {
        setCustomerOrders(orders.filter(o => o.phone === currentUser.phone || o.customerName === currentUser.name));
      } else {
        setCustomerOrders(orders.slice(0, 3));
      }
    });
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      await authService.updateProfile({
        name: editName,
        phone: editPhone,
        governorate: editGovernorate,
        address: editAddress
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#202020] bg-black/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37] shadow-md shadow-[#D4AF37]/10">
              {currentUser?.role === 'admin' ? (
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              ) : currentUser?.role === 'manager' ? (
                <Briefcase className="w-5 h-5 text-sky-400" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white">
                  {currentUser ? currentUser.name : 'حساب العميل ونقاط الولاء'}
                </h2>
                {currentUser && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : currentUser.role === 'manager'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentUser.role === 'admin' ? 'المدير العام 👑' : currentUser.role === 'manager' ? 'مدير المعرض 👔' : 'عضو VIP ⭐'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {currentUser?.email || 'عضوية WAKNOVA VIP المميزة للأجهزة الذكية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="p-2 rounded-xl bg-[#181818] hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition flex items-center gap-1 text-xs"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">خروج</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#202020] bg-[#111] px-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>الملف والنقاط والمحفظة</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>طلباتي ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>المفضلة ({favorites.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Guest State Prompt if not logged in */}
          {!currentUser && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1506] to-[#0e0c05] border border-[#59440c] text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#2a220b] border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                <Crown className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">سجّل دخولك للاستفادة من مميزات النخبة</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  احصل على 500 نقطة ولاء ترحيبية فورية، وتتبع سجل طلباتك ومحفظتك الرقمية وخصومات الصيانة الحصرية.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#b38f26] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition"
              >
                تسجيل الدخول / إنشاء حساب جديد الآن
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Royal Black & Gold VIP Card */}
              {(() => {
                const points = currentUser?.points || 500;
                const wallet = currentUser?.walletBalance || 0;
                const isBlack = points >= 1500;
                const isGold = points >= 500 && points < 1500;
                const tierName = isBlack ? 'بطاقة WAKNOVA الملكية السوداء' : (isGold ? 'بطاقة WAKNOVA الذهبية المرموقة' : 'عضوية WAKNOVA الفضية');
                const tierBadge = isBlack ? 'ROYAL BLACK VIP' : (isGold ? 'GOLD PRESTIGE' : 'SILVER MEMBER');
                const nextTarget = isBlack ? 3000 : (isGold ? 1500 : 500);
                const progressPercent = Math.min(100, Math.round((points / nextTarget) * 100));

                return (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-500 ${
                      isBlack
                        ? 'bg-gradient-to-br from-[#050505] via-[#101012] to-[#1a1813] border-[#7d6118] shadow-black/80'
                        : 'bg-gradient-to-br from-[#241c09] via-[#131108] to-black border-[#52410e]'
                    }`}>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#aa771c]/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-start justify-between relative z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-gradient-to-r from-[#D4AF37] to-[#f5da89] text-black font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              {tierBadge}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold">WAKNOVA CLUB</span>
                          </div>
                          <h3 className="text-xl font-black text-white mt-2.5 tracking-wide">
                            {currentUser?.name || 'عميل WAKNOVA المميز'}
                          </h3>
                          <p className="text-xs text-[#D4AF37] font-mono mt-0.5" dir="ltr">
                            {currentUser?.phone || '77XXXXXXX'}
                          </p>
                        </div>

                        <div className="text-left">
                          <span className="text-[10px] text-zinc-400 block font-mono">REWARD POINTS</span>
                          <div className="text-2xl font-black text-[#D4AF37] font-mono mt-0.5">
                            {points.toLocaleString('en-US')}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-bold">نقطة ولاء</span>
                        </div>
                      </div>

                      {/* Tier Progress Bar */}
                      <div className="mt-5 space-y-1.5 relative z-10">
                        <div className="flex justify-between text-[11px] text-zinc-400">
                          <span>{tierName}</span>
                          <span>{points} / {nextTarget} نقطة للترقية</span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-[#332a0c]">
                          <div
                            style={{ width: `${progressPercent}%` }}
                            className="h-full bg-gradient-to-r from-[#886616] via-[#D4AF37] to-[#fae6a2] rounded-full transition-all duration-1000"
                          />
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-[#332a0c] flex items-center justify-between text-xs text-zinc-300 relative z-10">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{currentUser?.governorate || 'صنعاء'}</span>
                        </div>
                        <div className="text-[#D4AF37] text-[11px] font-bold">
                          {isBlack ? 'ميزة الشحن المجاني الدائم مفعلة ⚡' : 'كل 1000 ريال = 10 نقاط ولاء'}
                        </div>
                      </div>
                    </div>

                    {/* Wallet and Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#121212] p-4 rounded-2xl border border-[#2b2515] flex items-center justify-between">
                        <div>
                          <span className="text-xs text-zinc-400 block mb-0.5">رصيد المحفظة النقدية (Wallet):</span>
                          <div className="text-xl font-black text-[#D4AF37] font-mono">
                            {wallet.toLocaleString('en-US')} <span className="text-xs text-zinc-400">ريال</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
                          <Wallet className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="bg-[#121212] p-4 rounded-2xl border border-[#222] flex items-center justify-between">
                        <div>
                          <span className="text-xs text-zinc-400 block mb-0.5">عدد الطلبات المنفذة:</span>
                          <div className="text-xl font-black text-white font-mono">
                            {customerOrders.length} <span className="text-xs text-zinc-400">طلبات</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#333] flex items-center justify-center text-zinc-300">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Saved Address Info & Profile Editing */}
                    <div className="bg-[#121212] p-4 rounded-2xl border border-[#222] space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#D4AF37]" />
                          <span>بيانات العميل والعنوان المسجل:</span>
                        </h4>
                        {currentUser && (
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{isEditing ? 'إلغاء' : 'تعديل البيانات'}</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">الاسم</label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-[#181818] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">رقم الهاتف</label>
                              <input
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full bg-[#181818] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-white text-left ltr"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-1">العنوان التفصيلي للتوصيل</label>
                            <input
                              type="text"
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              placeholder="مثال: شارع حدة - أمام برج نماء"
                              className="w-full bg-[#181818] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c29d2b] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>حفظ التعديلات</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-300 space-y-1">
                          <p><strong className="text-white">المحافظة:</strong> {currentUser?.governorate || 'صنعاء'}</p>
                          <p><strong className="text-white">العنوان:</strong> {currentUser?.address || 'الجمهورية اليمنية - شارع حدة'}</p>
                          <p><strong className="text-white">الهاتف:</strong> <span dir="ltr">{currentUser?.phone || '77XXXXXXX'}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3 animate-fadeIn">
              {customerOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500">
                  لا توجد طلبات سابقة مسجلة بهذا الحساب حالياً.
                </div>
              ) : (
                customerOrders.map(order => (
                  <div key={order.id} className="bg-[#121212] border border-[#222] p-4 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#D4AF37]">{order.id}</span>
                      <span className="bg-[#181818] text-white px-2.5 py-0.5 rounded-full border border-[#333] font-bold">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-300">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(' ، ')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#202020] text-xs">
                      <span className="text-zinc-400 font-mono font-bold">
                        {order.total.toLocaleString('en-US')} ريال
                      </span>
                      <div className="flex items-center gap-3">
                        {onOpenInvoice && (
                          <button
                            onClick={() => onOpenInvoice(order)}
                            className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>الفاتورة الرسمية</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onClose();
                            onOpenTracking();
                          }}
                          className="text-zinc-400 hover:text-white font-bold"
                        >
                          تتبع الشحنة
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-3 animate-fadeIn">
              {favorites.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500">
                  لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => onOpenProduct(prod)}
                      className="bg-[#121212] border border-[#222] hover:border-[#D4AF37]/50 p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 object-contain bg-[#181818] p-1.5 rounded-xl shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#D4AF37] font-semibold">{prod.brand}</span>
                        <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                        <div className="text-xs font-mono font-bold text-white mt-1">
                          {prod.price.toLocaleString('en-US')} ريال
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
