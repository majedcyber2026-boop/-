import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  Briefcase,
  Gift,
  KeyRound
} from 'lucide-react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  intendedTarget?: string; // e.g. "لوحة الإدارة" or "الكاشير"
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  intendedTarget
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupGovernorate, setSignupGovernorate] = useState('صنعاء');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Forgot Password State
  const [resetIdentifier, setResetIdentifier] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو الهاتف وكلمة المرور');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.signIn(loginIdentifier, loginPassword);
      setSuccessMessage(`أهلاً بك مجدداً يا ${user.name}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!signupName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!signupPhone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }
    if (!signupEmail.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (signupPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('كلمة المرور غير متطابقة مع تأكيد كلمة المرور');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.signUp({
        name: signupName,
        phone: signupPhone,
        governorate: signupGovernorate,
        email: signupEmail,
        password: signupPassword
      });
      setSuccessMessage(`تم إنشاء حسابك بنجاح! مرحباً بك ${user.name}، وتمت إضافة 500 نقطة ترحيبية.`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!resetIdentifier.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم هاتفك المسجل');
      return;
    }

    try {
      setLoading(true);
      const msg = await authService.resetPassword(resetIdentifier);
      setSuccessMessage(msg);
    } catch (err: any) {
      setError(err.message || 'تعذر استعادة كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const user = authService.switchDemoAccount(role);
      setSuccessMessage(`تم تسجيل الدخول بنجاح بصلاحية: ${
        role === 'admin' ? 'المدير العام 👑' : role === 'manager' ? 'مدير المعرض والكاشير 👔' : 'عميل VIP ⭐'
      }`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#2b2515] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1f1b13] bg-gradient-to-b from-[#14120a] to-[#0d0d0d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2a220b] to-[#120f05] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {mode === 'signin' && 'تسجيل الدخول إلى WAKNOVA'}
                  {mode === 'signup' && 'إنشاء حساب عضوية VIP جديد'}
                  {mode === 'forgot' && 'استعادة كلمة المرور والحساب'}
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400">
                {intendedTarget ? `مطلوب تسجيل الدخول للوصول إلى: ${intendedTarget}` : 'بوابتك الرقمية الحصرية لأفخم متجر هواتف وإلكترونيات'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-5 bg-[#141414] border border-[#222] rounded-2xl">
          <button
            onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signin'
                ? 'bg-[#221c0e] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-[#221c0e] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>إنشاء حساب جديد</span>
            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-mono">+500ن</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Notification Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin@waknova.com أو 771234567"
                    className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none pr-9 text-left ltr"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-zinc-300">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] text-[#D4AF37] hover:underline"
                  >
                    نسيت كلمة السر؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none pr-9 pl-9 text-left ltr"
                    required
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#D4AF37] via-[#c29d2b] to-[#a8831b] hover:from-[#e5c14d] hover:to-[#c29d2b] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول الآمن</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              {/* Gift Promo Banner */}
              <div className="p-3 bg-gradient-to-r from-[#1f1906] to-[#120f04] border border-[#52410e] rounded-xl flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-[#D4AF37] shrink-0 animate-bounce" />
                <p className="text-[11px] text-[#F3E5AB]">
                  <strong className="text-white">هدية انضمام فورية:</strong> ستحصل على 500 نقطة WAKNOVA VIP مضافة فوراً لرصيدك بمجرد فتح الحساب!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="مثال: محمد اليافعي"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none pr-8"
                      required
                    />
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    رقم الهاتف (واتساب)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="77XXXXXXX"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none pr-8 text-left ltr"
                      required
                    />
                    <Phone className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    المحافظة
                  </label>
                  <div className="relative">
                    <select
                      value={signupGovernorate}
                      onChange={(e) => setSignupGovernorate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white outline-none pr-8 appearance-none"
                    >
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="حضرموت">حضرموت (المكلا / سيئون)</option>
                      <option value="الحديدة">الحديدة</option>
                      <option value="إب">إب</option>
                      <option value="مأرب">مأرب</option>
                      <option value="ذمار">ذمار</option>
                      <option value="أبين">أبين</option>
                      <option value="شبوة">شبوة</option>
                      <option value="لحج">لحج</option>
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none pr-8 text-left ltr"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="6 أحرف أو أرقام على الأقل"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none pr-8 text-left ltr"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="أعد كتابة كلمة المرور"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none pr-8 text-left ltr"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#D4AF37] via-[#c29d2b] to-[#a8831b] hover:from-[#e5c14d] hover:to-[#c29d2b] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>تأكيد التسجيل والانضمام لعضوية VIP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-[#181818] border border-[#262626] rounded-xl flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300">
                  <p className="font-bold text-white mb-0.5">استعادة الحساب الفورية</p>
                  <p className="text-zinc-400 text-[11px]">
                    أدخل بريدك الإلكتروني المسجل، وسنرسل لك رابطاً آمناً ومشفراً لإعادة تعيين كلمة المرور فوراً وبكل سهولة.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">
                  البريد الإلكتروني المسجل
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none pr-9 text-left ltr"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#e5c14d] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>إرسال رابط الاستعادة الآن</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="px-4 py-3 bg-[#1c1c1c] hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Access Bar (Instant Multi-Role Switcher) */}
          <div className="pt-3 border-t border-[#1f1f1f]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-zinc-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>دخول سريع للمعاينة واختبار الأدوار (One-Click Testing):</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-xl bg-[#1c1708] hover:bg-[#2b220a] border border-[#59440c] text-right flex flex-col gap-0.5 transition group"
              >
                <div className="flex items-center gap-1 text-[#D4AF37] text-[11px] font-black">
                  <Crown className="w-3 h-3" />
                  <span>المدير العام</span>
                </div>
                <span className="text-[9px] text-zinc-400">كامل الصلاحيات 👑</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('manager')}
                className="p-2 rounded-xl bg-[#14171c] hover:bg-[#1c222b] border border-[#23354a] text-right flex flex-col gap-0.5 transition group"
              >
                <div className="flex items-center gap-1 text-sky-400 text-[11px] font-black">
                  <Briefcase className="w-3 h-3" />
                  <span>مدير المعرض</span>
                </div>
                <span className="text-[9px] text-zinc-400">كاشير وطلبات 👔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-2 rounded-xl bg-[#141c16] hover:bg-[#1b2b1f] border border-[#204627] text-right flex flex-col gap-0.5 transition group"
              >
                <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-black">
                  <Sparkles className="w-3 h-3" />
                  <span>عميل VIP</span>
                </div>
                <span className="text-[9px] text-zinc-400">رصيد ونقاط ⭐</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0a0a] border-t border-[#181818] text-center text-[10px] text-zinc-500">
          حماية مشفرة 256-bit SSL | عضوية WAKNOVA الملكية للأجهزة الذكية
        </div>
      </div>
    </div>
  );
};
