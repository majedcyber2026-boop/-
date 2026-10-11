/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SpecialOrderModal } from './components/SpecialOrderModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { CashierPOS } from './components/CashierPOS';
import { MaintenanceModal } from './components/MaintenanceModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { InstallAppModal } from './components/InstallAppModal';
import { DeviceCompatibilityModal } from './components/DeviceCompatibilityModal';
import { BundleBuilderModal } from './components/BundleBuilderModal';
import { WarrantyVerifierModal } from './components/WarrantyVerifierModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { AICompareModal } from './components/AICompareModal';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { LivePurchaseTicker } from './components/LivePurchaseTicker';

import { Product, CartItem, Order, PaymentMethodConfig, Coupon, UserProfile } from './types';
import { storeService } from './services/storeService';
import { authService } from './services/authService';
import { Currency, setGlobalExchangeRates } from './utils/currency';
import {
  Bot,
  PlusCircle,
  Truck,
  ShoppingBag,
  Home,
  Sparkles,
  Phone,
  MessageCircle,
  Layers,
  Flame,
  Award,
  X,
  Scale,
  Heart,
  User
} from 'lucide-react';

export default function App() {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart & Favorites State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('waknova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('waknova_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'bestseller' | 'sale'>('all');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);
  const [aiBrandFilter, setAiBrandFilter] = useState<string | null>(null);
  const [aiMaxPriceFilter, setAiMaxPriceFilter] = useState<number | null>(null);

  // Coupons & Payment Methods
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);

  // Checkout discount state
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState('');

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSpecialOrderOpen, setIsSpecialOrderOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInstallAppOpen, setIsInstallAppOpen] = useState(false);
  const [showInstallTopBanner, setShowInstallTopBanner] = useState(true);
  const [isDeviceCompatibilityOpen, setIsDeviceCompatibilityOpen] = useState(false);
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [warrantyInitialSerial, setWarrantyInitialSerial] = useState('');
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Authentication & RBAC State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authIntendedTarget, setAuthIntendedTarget] = useState<string | undefined>(undefined);

  // Official Invoice State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceModalOpen(true);
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'forgot' = 'signin', intended?: string) => {
    setAuthMode(mode);
    setAuthIntendedTarget(intended);
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    showToast('تم تسجيل الخروج بنجاح. نتطلع لزيارتك القادمة!');
  };

  const handleOpenAdmin = () => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
      setIsAdminOpen(true);
    } else {
      handleOpenAuth('signin', 'لوحة تحكم المدير');
    }
  };

  const handleOpenCashier = () => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
      setIsCashierOpen(true);
    } else {
      handleOpenAuth('signin', 'شاشة الكاشير (POS)');
    }
  };

  // Multi-Currency Selection
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return (localStorage.getItem('waknova_currency') as Currency) || 'YER';
    } catch {
      return 'YER';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('waknova_currency', currency);
    } catch (e) {
      // ignore
    }
  }, [currency]);

  // In-app Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyDeviceFilter = (brandKeywords: string) => {
    setSearchQuery(brandKeywords);
    setAiBrandFilter(brandKeywords);
    setAiSearchSummary(`تصفية المنتجات المتوافقة مع أجهزة ${brandKeywords}`);
    showToast(`تم فرز المنتجات المعتمدة لأجهزة ${brandKeywords} بنجاح!`);
  };

  const handleAddBundleToCart = (bundleItem: any) => {
    setCart(prev => [bundleItem, ...prev]);
    showToast('تمت إضافة البكج الملكي الكامل إلى سلة المشتريات مع علبة الهدايا المجانية!');
    setIsCartOpen(true);
  };

  const handleToggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`تمت إزالة ${product.name} من المقارنة.`);
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 2) {
          showToast(`تم تحديث المقارنة مع ${product.name}`);
          return [prev[1], product];
        }
        showToast(`تمت إضافة ${product.name} للمقارنة بالذكاء الاصطناعي!`);
        return [...prev, product];
      }
    });
  };

  // Initial Load & Auto Seed
  const refreshProducts = async () => {
    const list = await storeService.getProducts();
    setProducts(list);
  };

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      await storeService.initializeDatabase();
      const [prods, coups, pms, sets] = await Promise.all([
        storeService.getProducts(),
        storeService.getCoupons(),
        storeService.getPaymentMethods(),
        storeService.getSettings()
      ]);
      setProducts(prods);
      setCoupons(coups);
      setPaymentMethods(pms);
      if (sets) {
        setGlobalExchangeRates(sets.exchangeRateSar, sets.exchangeRateUsd, sets.exchangeRegion);
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  // Sync Cart & Favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem('waknova_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('waknova_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity = Math.min(product.quantity, updated[idx].quantity + quantity);
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Favorites Handlers
  const handleToggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`تم حذف "${product.name}" من المفضلة`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`تم إضافة "${product.name}" إلى المفضلة`);
        return [...prev, product];
      }
    });
  };

  // AI Smart Natural Language Search
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      showToast('يرجى كتابة ما تبحث عنه أولاً (مثلاً: شاحن سريع تحت 6000 ريال)');
      return;
    }
    setIsAiSearching(true);
    try {
      const res = await fetch('/api/gemini/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.category && data.category.trim() !== '') {
        setActiveCategory(data.category);
      }
      if (data.brand && data.brand.trim() !== '') {
        setAiBrandFilter(data.brand);
      } else {
        setAiBrandFilter(null);
      }
      if (data.maxPrice && Number(data.maxPrice) > 0) {
        setAiMaxPriceFilter(Number(data.maxPrice));
      } else {
        setAiMaxPriceFilter(null);
      }

      let summary = `نتائج البحث الذكي لـ "${searchQuery}"`;
      if (data.maxPrice > 0) summary += ` (السعر حتى ${Number(data.maxPrice).toLocaleString('en-US')} ريال)`;
      if (data.brand) summary += ` (ماركة ${data.brand})`;
      if (data.category) summary += ` (قسم ${data.category})`;
      setAiSearchSummary(summary);
    } catch {
      setAiSearchSummary(`نتائج البحث لـ "${searchQuery}"`);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Tab filter
      if (activeFilter === 'new' && !product.isNew) return false;
      if (activeFilter === 'bestseller' && !product.isFeatured) return false;
      if (activeFilter === 'sale' && !product.onSale) return false;

      // AI brand filter
      if (aiBrandFilter) {
        const b = aiBrandFilter.toLowerCase();
        const matchBrand = product.brand.toLowerCase().includes(b);
        const matchName = product.name.toLowerCase().includes(b);
        if (!matchBrand && !matchName) return false;
      }

      // AI max price filter
      if (aiMaxPriceFilter && aiMaxPriceFilter > 0) {
        if (product.price > aiMaxPriceFilter) return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        return matchName || matchBrand || matchCategory || matchDesc;
      }

      return true;
    });
  }, [products, activeCategory, activeFilter, searchQuery, aiBrandFilter, aiMaxPriceFilter]);

  // Total cart count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1c1809] border border-[#D4AF37] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top PWA Install Bar */}
      {showInstallTopBanner && (
        <div className="bg-gradient-to-r from-[#1c1809] via-[#241c09] to-[#141108] border-b border-[#52410e]/60 px-3 py-1.5 text-xs flex items-center justify-between text-zinc-200 relative z-40">
          <div className="flex items-center gap-2">
            <span className="text-sm">📱</span>
            <span className="text-[11px] sm:text-xs">
              <strong className="text-[#D4AF37]">تطبيق WAKNOVA الملكي للجوال:</strong> ثبّت التطبيق على شاشتك الرئيسية لأندرويد وآيفون بضغطة زر
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallAppOpen(true)}
              className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full shadow transition cursor-pointer"
            >
              تثبيت الآن
            </button>
            <button
              onClick={() => setShowInstallTopBanner(false)}
              className="text-zinc-500 hover:text-white p-1 cursor-pointer"
              aria-label="إغلاق الشريط"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsCustomerAccountOpen(true)}
        onOpenSpecialOrder={() => setIsSpecialOrderOpen(true)}
        onOpenTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAI={() => setIsAIChatOpen(true)}
        onOpenAccount={() => setIsCustomerAccountOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenCashier={handleOpenCashier}
        onOpenMaintenance={() => setIsMaintenanceOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenInstallApp={() => setIsInstallAppOpen(true)}
        onOpenDeviceCompatibility={() => setIsDeviceCompatibilityOpen(true)}
        onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
        onOpenWarranty={() => setIsWarrantyOpen(true)}
        onOpenAdvisor={() => setIsAIAdvisorOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        isAiSearching={isAiSearching}
        onAiSearch={handleAiSearch}
        currency={currency}
        onChangeCurrency={setCurrency}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Hero & Category Section */}
      <HeroBanner
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setAiSearchSummary(null);
        }}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onOpenSpecialOrder={() => setIsSpecialOrderOpen(true)}
        onOpenInstallApp={() => setIsInstallAppOpen(true)}
        onOpenDeviceCompatibility={() => setIsDeviceCompatibilityOpen(true)}
        onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
        onOpenWarranty={() => setIsWarrantyOpen(true)}
        onOpenAdvisor={() => setIsAIAdvisorOpen(true)}
        currency={currency}
      />

      {/* Products Catalog Grid */}
      <main id="products-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Active AI Search Filter Tag */}
        {aiSearchSummary && (
          <div className="mb-6 p-3 bg-[#181408] border border-[#52410e] rounded-2xl flex items-center justify-between text-xs text-[#D4AF37]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">{aiSearchSummary}</span>
            </div>
            <button
              onClick={() => {
                setAiSearchSummary(null);
                setSearchQuery('');
                setActiveCategory('all');
                setAiBrandFilter(null);
                setAiMaxPriceFilter(null);
              }}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              إلغاء التصفية
            </button>
          </div>
        )}

        {/* Section Title & Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-6 bg-[#D4AF37] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeCategory === 'all' ? 'جميع المنتجات المتوفرة' : `قسم ${activeCategory}`}
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              ({filteredProducts.length} منتج)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span>الفرز: الماركات الأصلية المعتمدة</span>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">جاري تحميل كتالوج المنتجات الفاخرة...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0e0e] border border-[#222] rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center text-zinc-500 mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">لم نجد منتجات مطابقة لهذا البحث</h3>
              <p className="text-xs text-zinc-400 mt-1">هل تبحث عن قطعة نادرة أو غير متوفرة؟ نتشرف بتوفيرها لك خصيصاً.</p>
            </div>
            <button
              onClick={() => setIsSpecialOrderOpen(true)}
              className="bg-[#D4AF37] text-black font-bold text-xs px-6 py-3 rounded-full hover:bg-[#e2c14f] transition shadow-lg shadow-[#D4AF37]/20"
            >
              اطلب منتج غير متوفر الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.id === product.id)}
                onOpenDetails={setSelectedProduct}
                onToggleCompare={handleToggleCompare}
                isComparing={compareList.some(p => p.id === product.id)}
                currency={currency}
              />
            ))}
          </div>
        )}

        {/* Promotional Special Orders Callout Section */}
        <div className="mt-16 bg-gradient-to-r from-black via-[#161208] to-black border border-[#3e320f] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
              خدمة الوكالة الحصرية لعملائنا في اليمن
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              تبحث عن منتج أو قطعة غير متوفرة بالسوق؟
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              نوفر لك شواحن أصلية نادرة، كابلات شحن خاصة، بطاريات طوارئ للابتوبات، أقلام ذكية، أو شاشات وقطع صيانة معتمدة خلال أيام وبأفضل الأسعار.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSpecialOrderOpen(true)}
                className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>اطلب منتج غير متوفر الآن</span>
              </button>
              <a
                href="https://wa.me/967780000751?text=مرحباً%20وكالة%20WAKNOVA%20أبحث%20عن%20منتج%20خاص"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#181818] hover:bg-[#252525] border border-[#333] text-white text-xs sm:text-sm px-5 py-3 rounded-full transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>تواصل مع الإدارة مباشرة</span>
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Compare Action Pill */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fadeIn">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#f7e499] to-[#aa771c] hover:brightness-110 active:scale-95 text-black font-black text-xs px-5 py-3 rounded-full shadow-2xl shadow-[#D4AF37]/50 flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-black" />
            <span>مقارنة المنتجات بالذكاء الاصطناعي ({compareList.length})</span>
          </button>
        </div>
      )}

      {/* Floating Actions: Minimal & Unobtrusive */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex flex-col gap-2.5">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#aa771c] text-black shadow-xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group relative border border-white/20 cursor-pointer"
          title="مساعد WAKNOVA الذكي"
        >
          <Bot className="w-5 h-5 text-black" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
          </span>
        </button>

        <a
          href="https://wa.me/967780000751"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/20"
          title="واتساب الوكالة الحديثة: 780000751"
        >
          <Phone className="w-5 h-5 fill-white" />
        </a>
      </div>

      {/* Mobile-First Bottom Navigation Bar: Clean, Ergonomic, Native Feel */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 border-t border-[#222] backdrop-blur-xl px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveCategory('all');
          }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#D4AF37] cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#D4AF37] cursor-pointer"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">التشكيلة</span>
        </button>

        <button
          onClick={() => setIsAIAdvisorOpen(true)}
          className="flex flex-col items-center gap-1 text-[#D4AF37] cursor-pointer"
        >
          <Bot className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] font-bold">مستشار AI</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              setIsCustomerAccountOpen(true);
            } else {
              handleOpenAuth('signin');
            }
          }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#D4AF37] cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{currentUser ? 'حسابي' : 'دخول'}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-zinc-400 hover:text-[#D4AF37] cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">السلة</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSpecialOrder={() => setIsSpecialOrderOpen(true)}
        onOpenTracking={() => setIsOrderTrackingOpen(true)}
        onOpenMaintenance={() => setIsMaintenanceOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ALL MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.some(f => f.id === selectedProduct.id)}
          allProducts={products}
          onSelectProduct={setSelectedProduct}
          currency={currency}
          currentUser={currentUser}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={(discount, couponCode) => {
            setCheckoutDiscount(discount);
            setCheckoutCouponCode(couponCode);
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          coupons={coupons}
          currency={currency}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cart}
          discount={checkoutDiscount}
          couponCode={checkoutCouponCode}
          onOrderSuccess={(order) => {
            setCart([]);
            showToast(`تم استلام طلبك بنجاح! رقم الطلب: ${order.id}`);
          }}
          paymentMethods={paymentMethods}
          currentUser={currentUser}
          currency={currency}
          onOpenInvoice={handleOpenInvoice}
        />
      )}

      {/* Special Order Modal */}
      {isSpecialOrderOpen && (
        <SpecialOrderModal
          isOpen={isSpecialOrderOpen}
          onClose={() => setIsSpecialOrderOpen(false)}
        />
      )}

      {/* Order Tracking Modal */}
      {isOrderTrackingOpen && (
        <OrderTrackingModal
          isOpen={isOrderTrackingOpen}
          onClose={() => setIsOrderTrackingOpen(false)}
          currentUser={currentUser}
          currency={currency}
          onOpenInvoice={handleOpenInvoice}
          onOpenWarranty={(serial) => {
            setWarrantyInitialSerial(serial || '');
            setIsOrderTrackingOpen(false);
            setIsWarrantyOpen(true);
          }}
        />
      )}

      {/* Customer Account Modal */}
      {isCustomerAccountOpen && (
        <CustomerAccountModal
          isOpen={isCustomerAccountOpen}
          onClose={() => setIsCustomerAccountOpen(false)}
          favorites={favorites}
          onOpenProduct={(p) => {
            setIsCustomerAccountOpen(false);
            setSelectedProduct(p);
          }}
          onOpenTracking={() => {
            setIsCustomerAccountOpen(false);
            setIsOrderTrackingOpen(true);
          }}
          currentUser={currentUser}
          onOpenAuth={() => handleOpenAuth('signin')}
          onSignOut={handleSignOut}
          onOpenInvoice={handleOpenInvoice}
        />
      )}

      {/* AI Chat Drawer */}
      {isAIChatOpen && (
        <AIChatDrawer
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          products={products}
          onOpenProduct={(p) => {
            setIsAIChatOpen(false);
            setSelectedProduct(p);
          }}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onProductsUpdated={refreshProducts}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
          onOpenInvoice={handleOpenInvoice}
        />
      )}

      {/* Royal Authentication & RBAC Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
          intendedTarget={authIntendedTarget}
          onSuccess={(u) => {
            showToast(`مرحباً بك يا ${u.name}! تم تسجيل الدخول بنجاح.`);
          }}
        />
      )}

      {/* Official & Thermal Invoice Modal */}
      {isInvoiceModalOpen && selectedOrderForInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedOrderForInvoice(null);
          }}
          order={selectedOrderForInvoice}
          currency={currency}
        />
      )}

      {/* Cashier POS */}
      {isCashierOpen && (
        <CashierPOS
          isOpen={isCashierOpen}
          onClose={() => setIsCashierOpen(false)}
          products={products}
          onOrderCompleted={refreshProducts}
        />
      )}

      {/* Maintenance Modal */}
      {isMaintenanceOpen && (
        <MaintenanceModal
          isOpen={isMaintenanceOpen}
          onClose={() => setIsMaintenanceOpen(false)}
        />
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <AboutModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      {/* Contact Modal */}
      {isContactOpen && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      )}

      {/* Install Mobile App PWA Modal */}
      {isInstallAppOpen && (
        <InstallAppModal
          isOpen={isInstallAppOpen}
          onClose={() => setIsInstallAppOpen(false)}
        />
      )}

      {/* AI Device Compatibility Matcher Modal */}
      {isDeviceCompatibilityOpen && (
        <DeviceCompatibilityModal
          isOpen={isDeviceCompatibilityOpen}
          onClose={() => setIsDeviceCompatibilityOpen(false)}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onApplyDeviceFilter={handleApplyDeviceFilter}
        />
      )}

      {/* Smart Luxury Bundle Builder Modal */}
      {isBundleBuilderOpen && (
        <BundleBuilderModal
          isOpen={isBundleBuilderOpen}
          onClose={() => setIsBundleBuilderOpen(false)}
          products={products}
          onAddBundleToCart={handleAddBundleToCart}
        />
      )}

      {/* IMEI & Serial Warranty Checker Modal */}
      {isWarrantyOpen && (
        <WarrantyVerifierModal
          isOpen={isWarrantyOpen}
          onClose={() => {
            setIsWarrantyOpen(false);
            setWarrantyInitialSerial('');
          }}
          initialSerial={warrantyInitialSerial}
          currentUser={currentUser}
        />
      )}

      {/* WAKNOVA AI Luxury Tech Advisor Modal */}
      {isAIAdvisorOpen && (
        <AIAdvisorModal
          isOpen={isAIAdvisorOpen}
          onClose={() => setIsAIAdvisorOpen(false)}
          products={products}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onOpenProduct={setSelectedProduct}
          currency={currency}
        />
      )}

      {/* AI Comparison Modal */}
      {isCompareModalOpen && (
        <AICompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          products={compareList}
          onRemoveFromCompare={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          currency={currency}
        />
      )}

      {/* Floating Live Real-Time Purchase & Delivery Ticker */}
      <LivePurchaseTicker
        currency={currency}
        onSelectProduct={(pName) => setSearchQuery(pName)}
      />

    </div>
  );
}
