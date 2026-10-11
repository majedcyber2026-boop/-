import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Apple, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Copy, 
  ExternalLink, 
  QrCode, 
  AlertCircle,
  MoreVertical,
  Check
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'prompted' | 'manual_needed' | 'success'>('idle');
  const [showQR, setShowQR] = useState(false);

  // App direct public link
  const directAppUrl = 'https://ais-pre-t7vvgxkr7bu6y5ih5l6e7g-569310056591.europe-west3.run.app';

  // Detect whether running in an iframe (e.g. AI Studio preview)
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOSDevice) {
      setActivePlatform('ios');
    }

    // Check if prompt was already captured on initial page load
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      setInstallStatus('success');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeInstall = async () => {
    const promptObj = deferredPrompt || (window as any).deferredPrompt;

    if (promptObj) {
      try {
        await promptObj.prompt();
        const choice = await promptObj.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setInstallStatus('success');
          (window as any).deferredPrompt = null;
          setDeferredPrompt(null);
        } else {
          setInstallStatus('manual_needed');
        }
      } catch (err) {
        console.error('Error launching install prompt:', err);
        setInstallStatus('manual_needed');
      }
    } else {
      // Browser didn't expose native programmatic prompt (e.g. in iframe, Safari, or already installed)
      setInstallStatus('manual_needed');
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(directAppUrl)}&bgcolor=000000&color=D4AF37&margin=10`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#131008] via-[#0d0d0d] to-black border border-[#52410e] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#aa771c]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-5 border-b border-[#262010] flex items-center justify-between relative z-10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#886616] p-0.5 shadow-lg shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">تثبيت تطبيق WAKNOVA</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-bold">
                  تطبيق أصلي PWA
                </span>
              </div>
              <p className="text-xs text-zinc-400">تثبيت فوري على أندرويد وآيفون بدون الحاجة لمتاجر التطبيقات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Iframe Detection Warning Banner */}
        {isInIframe && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#221a08] to-[#1a1405] border border-[#6b5212] flex items-start gap-3 relative z-10 shadow-lg">
            <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-white">
                أنت تستعرض المتجر الآن داخل شاشة معاينة (معزولة عن النظام):
              </p>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                لكي يقوم المتصفح بتثبيت التطبيق على جهازك، يجب فتح الرابط المباشر في متصفحك الأساسي (<strong className="text-[#D4AF37]">Chrome</strong> أو <strong className="text-[#D4AF37]">Safari</strong>).
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <a
                  href={directAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D4AF37] text-black font-black text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#e2c14f] transition shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح الرابط المباشر في المتصفح</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="bg-black/60 border border-[#52410e] text-zinc-200 text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:border-[#D4AF37] transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{copied ? 'تم نسخ الرابط!' : 'نسخ الرابط المباشر'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Platform Selector Tabs */}
        <div className="p-4 bg-[#14120a] border-b border-[#241c09] flex gap-2 relative z-10">
          <button
            onClick={() => {
              setActivePlatform('android');
              setInstallStatus('idle');
            }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activePlatform === 'android'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                : 'bg-[#1b1912] text-zinc-400 hover:text-white border border-[#2b2413]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>هواتف أندرويد (Android)</span>
          </button>

          <button
            onClick={() => {
              setActivePlatform('ios');
              setInstallStatus('idle');
            }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activePlatform === 'ios'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                : 'bg-[#1b1912] text-zinc-400 hover:text-white border border-[#2b2413]'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>هواتف آيفون (iPhone / iOS)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 relative z-10 overflow-y-auto max-h-[70vh]">
          
          {/* App Preview Card with Install Button */}
          <div className="p-4 rounded-2xl bg-black/70 border border-[#3d300e] flex flex-wrap items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#f7df8b] to-[#aa771c] p-0.5 shadow-xl shadow-[#D4AF37]/30 shrink-0">
                <div className="w-full h-full bg-black rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-[#D4AF37] font-black text-2xl font-mono leading-none">W</span>
                  <span className="text-[7px] text-[#f7df8b] tracking-widest font-mono font-bold mt-0.5">WAKNOVA</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">WAKNOVA - الوكالة الحديثة</h3>
                <p className="text-xs text-zinc-400">هواتف ذكية وملحقات أصلية فاخرة</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تطبيق ويب رسمي خفيف وفوري (PWA)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNativeInstall}
                className="bg-gradient-to-r from-[#D4AF37] via-[#e8c85c] to-[#aa771c] hover:brightness-110 active:scale-95 text-black font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>تثبيت الآن</span>
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="p-2.5 rounded-xl bg-[#1a170e] hover:bg-[#252012] border border-[#443511] text-[#D4AF37] transition"
                title="عرض باركود التثبيت QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QR Code Section (if toggled) */}
          {showQR && (
            <div className="p-4 rounded-2xl bg-[#141209] border border-[#52410e] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right animate-fadeIn">
              <div className="p-2 bg-black rounded-xl border border-[#52410e] shadow-lg shrink-0">
                <img 
                  src={qrImageUrl} 
                  alt="QR Code for WAKNOVA App" 
                  className="w-32 h-32 rounded-lg"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start text-[#D4AF37]">
                  <QrCode className="w-4 h-4" />
                  <span>امسح الكود بكاميرا هاتفك</span>
                </h4>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  وجّه كاميرا هاتفك (آيفون أو أندرويد) مباشرة نحو الباركود لفتح المتجر في متصفحك وتثبيته بضغطة زر واحدة.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="mt-2 text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 mx-auto sm:mx-0 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'تم نسخ الرابط المباشر!' : 'أو انسخ رابط المتجر المباشر'}</span>
                </button>
              </div>
            </div>
          )}

          {/* If Installed Successfully */}
          {installStatus === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">تم تثبيت تطبيق WAKNOVA بنجاح! 🎉</p>
                <p className="text-emerald-300/80 text-[11px] mt-0.5">
                  أيقونة التطبيق موجودة الآن على شاشة هاتفك الرئيسية، وتعمل بملء الشاشة وبدون إعلانات وبأعلى سرعة.
                </p>
              </div>
            </div>
          )}

          {/* Manual Prompt Needed Notice */}
          {installStatus === 'manual_needed' && (
            <div className="p-3.5 rounded-2xl bg-[#211a08] border border-[#D4AF37]/50 text-xs text-zinc-200 flex items-start gap-2.5 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="font-bold text-white">الخطوة البسيطة المتبقية للتثبيت:</p>
                <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                  اتبع الخطوات الموضحة أدناه حسب نوع هاتفك لإضافة التطبيق فوراً إلى شاشتك الرئيسية!
                </p>
              </div>
            </div>
          )}

          {/* Android Step-by-Step Instructions */}
          {activePlatform === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>خطوات التثبيت على أجهزة أندرويد (Google Chrome / Samsung):</span>
                </h4>
                <span className="text-[10px] text-zinc-400 bg-[#16140b] px-2 py-0.5 rounded border border-[#33280c]">
                  أقل من 5 ثوانٍ
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">افتح المتجر في متصفح Google Chrome</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      إذا كنت تفتح الرابط من داخل تطبيق آخر، افتحه في Chrome مباشرة.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={directAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-[#1e1b10] border border-[#443511] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح الرابط في Chrome</span>
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className="text-[10px] bg-[#1e1b10] border border-[#443511] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <Copy className="w-3 h-3 text-[#D4AF37]" />
                        <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e] font-bold text-xs flex items-center justify-center shrink-0">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">اضغط على زر الخيارات (الثلاث نقاط ⋮)</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      ستجد زر الثلاث نقاط <strong className="text-[#D4AF37]">⋮</strong> في الزاوية العلوية (أو السفلية) لمتصفح Chrome.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e] font-bold text-xs flex items-center justify-center shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      اختر <span className="text-[#D4AF37]">"تثبيت التطبيق"</span> أو <span className="text-[#D4AF37]">"إضافة إلى الشاشة الرئيسية"</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      اضغط كلمة <strong>"تثبيت" (Install)</strong> وسيتم تحميل أيقونة المتجر فوراً على هاتفك كأي تطبيق رسمي.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS / iPhone Step-by-Step Instructions */}
          {activePlatform === 'ios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Apple className="w-4 h-4" />
                  <span>طريقة تثبيت التطبيق على هواتف آيفون (Safari):</span>
                </h4>
                <span className="text-[10px] text-zinc-400 bg-[#16140b] px-2 py-0.5 rounded border border-[#33280c]">
                  بدون App Store
                </span>
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e] flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">افتح المتجر عبر متصفح سفاري (Safari)</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      نظام iOS يشترط فتح الرابط داخل Safari لإمكانية تثبيت أي تطبيق على الشاشة الرئيسية.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={directAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-[#1e1b10] border border-[#443511] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح في Safari</span>
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className="text-[10px] bg-[#1e1b10] border border-[#443511] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <Copy className="w-3 h-3 text-[#D4AF37]" />
                        <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e] flex items-center justify-center shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">اضغط زر المشاركة (Share)</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      في أسفل شاشة Safari، اضغط على زر المشاركة <span className="text-[#D4AF37] font-bold">[⎋ المربع وفيه سهم للأعلى]</span>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e] flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">اختر "إضافة إلى الصفحة الرئيسية"</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      مرر القائمة لأسفل واختر <strong className="text-[#D4AF37]">"إضافة إلى الصفحة الرئيسية" (Add to Home Screen ⊞)</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-2xl bg-[#14120a] border border-[#2b220d] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-black text-xs flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">اضغط "إضافة" (Add) في الزاوية العلوية</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      ستظهر أيقونة WAKNOVA الملكية فوراً على شاشة هاتفك بجانب باقي التطبيقات وتعمل بملء الشاشة وبسرعة خارقة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advantages Grid */}
          <div className="pt-2 border-t border-[#26200e] grid grid-cols-3 gap-2 text-center text-zinc-300">
            <div className="bg-[#12110a] p-3 rounded-2xl border border-[#221c0b]">
              <Zap className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-white">سرعة خارقة</span>
              <span className="text-[9px] text-zinc-500">تحميل واستجابة فورية</span>
            </div>

            <div className="bg-[#12110a] p-3 rounded-2xl border border-[#221c0b]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-white">حجم خفيف جداً</span>
              <span className="text-[9px] text-zinc-500">أقل من 2 ميغابايت</span>
            </div>

            <div className="bg-[#12110a] p-3 rounded-2xl border border-[#221c0b]">
              <Smartphone className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-white">شاشة كاملة</span>
              <span className="text-[9px] text-zinc-500">بدون أشرطة متصفح</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/80 border-t border-[#262010] flex items-center justify-between text-xs text-zinc-400">
          <span>الوكالة الحديثة للهواتف الذكية ومستلزماتها باليمن</span>
          <button
            onClick={onClose}
            className="text-[#D4AF37] hover:underline font-bold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
