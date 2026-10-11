import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  Bot,
  Truck,
  PlusCircle,
  Shield,
  Phone,
  Menu,
  X,
  User,
  Wrench,
  Smartphone,
  Gift,
  ShieldCheck,
  ExternalLink,
  Crown,
  Briefcase,
  LogIn,
  LogOut
} from 'lucide-react';
import { Currency } from '../utils/currency';
import { UserProfile } from '../types';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenSpecialOrder: () => void;
  onOpenTracking: () => void;
  onOpenAI: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenCashier: () => void;
  onOpenMaintenance: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenInstallApp?: () => void;
  onOpenDeviceCompatibility?: () => void;
  onOpenBundleBuilder?: () => void;
  onOpenWarranty?: () => void;
  onOpenAdvisor?: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  isAiSearching: boolean;
  onAiSearch: () => void;
  currency: Currency;
  onChangeCurrency: (c: Currency) => void;
  currentUser?: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'forgot', intended?: string) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onOpenSpecialOrder,
  onOpenTracking,
  onOpenAI,
  onOpenAccount,
  onOpenAdmin,
  onOpenCashier,
  onOpenMaintenance,
  onOpenAbout,
  onOpenContact,
  onOpenInstallApp,
  onOpenDeviceCompatibility,
  onOpenBundleBuilder,
  onOpenWarranty,
  onOpenAdvisor,
  onSearch,
  searchQuery,
  isAiSearching,
  onAiSearch,
  currency,
  onChangeCurrency,
  currentUser,
  onOpenAuth,
  onSignOut
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-[#222]">
      
      {/* Micro Status Bar: Clean & Minimal */}
      <div className="bg-[#0a0a0a] border-b border-[#1c1c1c] py-1.5 px-4 sm:px-8 text-xs flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2 sm:gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <strong className="text-white">WAKNOVA</strong> · الضمان الذهبي 100% أصلي
          </span>
          <span className="hidden md:inline text-zinc-600">·</span>
          <span className="hidden md:inline text-zinc-400">توصيل سريع لكافة محافظات اليمن</span>
        </div>

        {/* Currency Switcher & Quick Contacts */}
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center bg-[#141414] border border-[#2b2b2b] rounded-lg p-0.5 text-[10px] font-bold">
            <button
              onClick={() => onChangeCurrency('YER')}
              className={`px-2 py-0.5 rounded transition ${
                currency === 'YER'
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ريال يمني
            </button>
            <button
              onClick={() => onChangeCurrency('SAR')}
              className={`px-2 py-0.5 rounded transition ${
                currency === 'SAR'
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ر.س
            </button>
            <button
              onClick={() => onChangeCurrency('USD')}
              className={`px-2 py-0.5 rounded transition ${
                currency === 'USD'
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          <span className="hidden sm:inline text-zinc-700">|</span>

          <a
            href="https://wa.me/967780000751"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[#D4AF37] hover:underline font-mono text-[11px]"
          >
            <Phone className="w-3 h-3" />
            <span dir="ltr">780000751</span>
          </a>

          {/* User Auth Quick Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#18150c] border border-[#52410e] hover:border-[#D4AF37] text-white text-[11px] transition"
                title="فتح ملفك الشخصي"
              >
                {currentUser.role === 'admin' ? (
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                ) : currentUser.role === 'manager' ? (
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="font-bold truncate max-w-[110px]">{currentUser.name}</span>
              </button>

              {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                <button
                  onClick={onOpenAdmin}
                  className="px-2 py-0.5 rounded-lg bg-[#2b220d] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition text-[10px] font-bold"
                >
                  لوحة الإدارة
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex items-center gap-1 text-[11px] text-[#D4AF37] hover:text-[#f3e2a0] bg-[#1a1608] border border-[#52410e] hover:border-[#D4AF37] px-2.5 py-0.5 rounded-full transition font-bold"
              >
                <LogIn className="w-3 h-3" />
                <span>دخول / تسجيل</span>
              </button>

              <button
                onClick={() => onOpenAuth('signin', 'لوحة الإدارة')}
                className="text-[11px] text-zinc-500 hover:text-[#D4AF37] transition font-medium"
              >
                الإدارة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Luxury Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#f5df88] to-[#aa771c] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <span className="text-[#D4AF37] font-black text-xl font-mono">W</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-widest font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#f7e499] to-[#aa771c]">
                  WAKNOVA
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">الوكالة الحديثة للهواتف</p>
            </div>
          </div>

          {/* Central Intelligent Search Field (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAiSearch()}
                placeholder="ابحث عن شاحن GaN، سماعة، بطارية، كابل رونين، ماركة..."
                className="w-full bg-[#111] border border-[#262626] focus:border-[#D4AF37] text-xs sm:text-sm rounded-full py-2.5 pr-10 pl-28 text-white placeholder-zinc-500 outline-none transition"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              
              <button
                onClick={onAiSearch}
                disabled={isAiSearching}
                className="absolute left-1.5 top-1.5 bg-gradient-to-r from-[#D4AF37] to-[#aa771c] hover:opacity-90 disabled:opacity-50 text-black text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiSearching ? 'فهم...' : 'بحث ذكي'}</span>
              </button>
            </div>
          </div>

          {/* Action Suite */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Advisor / Concierge Pill Trigger */}
            <button
              onClick={onOpenAdvisor || onOpenAI}
              className="bg-[#19150b] hover:bg-[#251e0e] border border-[#52410e] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5 transition shadow-sm cursor-pointer group"
              title="مستشار WAKNOVA الذكي"
            >
              <Bot className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">مستشار AI</span>
            </button>

            {/* Favorites Icon */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] text-zinc-300 hover:text-white transition cursor-pointer"
              title="المفضلة"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] text-zinc-300 hover:text-[#D4AF37] transition cursor-pointer"
              title="سلة المشتريات"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-black rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  onOpenAccount();
                } else {
                  onOpenAuth('signin');
                }
              }}
              className={`relative p-2.5 rounded-full border transition cursor-pointer ${
                currentUser
                  ? 'bg-[#1c1809] border-[#52410e] text-[#D4AF37] hover:border-[#D4AF37]'
                  : 'bg-[#111] hover:bg-[#1a1a1a] border-[#262626] text-zinc-300 hover:text-white'
              }`}
              title={currentUser ? `حساب: ${currentUser.name}` : 'تسجيل الدخول / حسابي'}
            >
              {currentUser?.role === 'admin' ? (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              ) : currentUser?.role === 'manager' ? (
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {currentUser && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
              )}
            </button>

            {/* Luxury Slide-Out Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] text-zinc-300 hover:text-white transition cursor-pointer"
              title="القائمة والخدمات"
              aria-label="القائمة"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Field */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAiSearch()}
              placeholder="ابحث عن الشواحن، السماعات، الهواتف..."
              className="w-full bg-[#111] border border-[#262626] text-xs rounded-full py-2 pr-9 pl-22 text-white placeholder-zinc-500 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-2.5" />
            <button
              onClick={onAiSearch}
              disabled={isAiSearching}
              className="absolute left-1 top-1 bg-[#D4AF37] text-black text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>بحث ذكي</span>
            </button>
          </div>
        </div>

      </div>

      {/* Luxury Slide-Out Services Drawer */}
      {menuOpen && (
        <div className="border-t border-[#222] bg-[#0c0c0c] px-4 sm:px-8 py-5 space-y-4 animate-fadeIn shadow-2xl">
          <div className="max-w-7xl mx-auto space-y-4">
            
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 pb-2 border-b border-[#1c1c1c]">
              <span>أجنحة وخدمات WAKNOVA الحصرية</span>
              <span className="text-[#D4AF37]">الوكالة الحديثة</span>
            </div>

            {/* Primary Grid of Services */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              
              {/* Service 1: AI Advisor */}
              <button
                onClick={() => { onOpenAdvisor ? onOpenAdvisor() : onOpenAI(); setMenuOpen(false); }}
                className="p-3 rounded-2xl bg-[#141209] hover:bg-[#1c180b] border border-[#44350e] text-right space-y-1 transition group"
              >
                <Bot className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">مستشار AI الذكي</h4>
                <p className="text-[10px] text-zinc-400">توصيات مخصصة لميزانيتك</p>
              </button>

              {/* Service 2: Device Compatibility */}
              {onOpenDeviceCompatibility && (
                <button
                  onClick={() => { onOpenDeviceCompatibility(); setMenuOpen(false); }}
                  className="p-3 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-right space-y-1 transition group"
                >
                  <Smartphone className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">فاحص التوافق</h4>
                  <p className="text-[10px] text-zinc-400">مطابقة الشواحن والسماعات</p>
                </button>
              )}

              {/* Service 3: VIP Bundle Builder */}
              {onOpenBundleBuilder && (
                <button
                  onClick={() => { onOpenBundleBuilder(); setMenuOpen(false); }}
                  className="p-3 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-right space-y-1 transition group"
                >
                  <Gift className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">صانع البكج الملكي</h4>
                  <p className="text-[10px] text-zinc-400">تجميع أجهزة بخصم فوري</p>
                </button>
              )}

              {/* Service 4: Warranty Verifier */}
              {onOpenWarranty && (
                <button
                  onClick={() => { onOpenWarranty(); setMenuOpen(false); }}
                  className="p-3 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-right space-y-1 transition group"
                >
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">فاحص الضمان</h4>
                  <p className="text-[10px] text-zinc-400">التحقق بالسيريال و IMEI</p>
                </button>
              )}

              {/* Service 5: Special Order */}
              <button
                onClick={() => { onOpenSpecialOrder(); setMenuOpen(false); }}
                className="p-3 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-right space-y-1 transition group"
              >
                <PlusCircle className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">طلب منتج خاص</h4>
                <p className="text-[10px] text-zinc-400">توفير قطع نادرة بالسوق</p>
              </button>

              {/* Service 6: Order Tracking */}
              <button
                onClick={() => { onOpenTracking(); setMenuOpen(false); }}
                className="p-3 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-right space-y-1 transition group"
              >
                <Truck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">تتبع الشحنات</h4>
                <p className="text-[10px] text-zinc-400">متابعة حالة شحنتك فوراً</p>
              </button>

            </div>

            {/* Quick Links Strip */}
            <div className="pt-2 border-t border-[#1c1c1c] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => { onOpenAccount(); setMenuOpen(false); }} className="hover:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>حساب العميل</span>
                </button>
                <button onClick={() => { onOpenMaintenance(); setMenuOpen(false); }} className="hover:text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>خدمات الصيانة</span>
                </button>
                {onOpenInstallApp && (
                  <button onClick={() => { onOpenInstallApp(); setMenuOpen(false); }} className="text-[#D4AF37] hover:underline font-bold">
                    📲 تثبيت التطبيق للجوال
                  </button>
                )}
                <button onClick={() => { onOpenAbout(); setMenuOpen(false); }} className="hover:text-white">
                  عن الوكالة
                </button>
                <button onClick={() => { onOpenContact(); setMenuOpen(false); }} className="hover:text-white">
                  تواصل معنا
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => { onOpenCashier(); setMenuOpen(false); }} className="text-zinc-500 hover:text-white">
                  الكاشير (POS)
                </button>
                <button onClick={() => { onOpenAdmin(); setMenuOpen(false); }} className="text-[#D4AF37] font-bold">
                  لوحة تحكم المدير
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
