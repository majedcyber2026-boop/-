import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Lock, Phone } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'return';
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'return'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'return'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202020] bg-black/60 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c1809] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                سياسات وضمانات متجر WAKNOVA
              </h2>
              <p className="text-[11px] text-zinc-400">الوكالة الحديثة للهواتف الذكية ومستلزماتها - اليمن</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#202020] bg-[#111]">
          <button
            onClick={() => setActiveTab('return')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'return'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>الضمان الذهبي والاستبدال</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>سياسة الخصوصية</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الشروط والأحكام</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed">
          
          {activeTab === 'return' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#171408] border border-[#3e320f] space-y-2">
                <h3 className="text-sm font-bold text-[#D4AF37]">بنود الضمان الذهبي وسياسة الاستبدال:</h3>
                <p>
                  نلتزم في <strong className="text-white">الوكالة الحديثة للهواتف الذكية ومستلزماتها (WAKNOVA)</strong> بتقديم منتجات أصلية ومعتمدة فقط مع الضمان المباشر:
                </p>
              </div>

              <ul className="list-disc list-inside space-y-2 bg-[#121212] p-4 rounded-2xl border border-[#222]">
                <li><strong>مهلة الفحص والاستبدال:</strong> يحق للعميل فحص المنتج واستبداله خلال <strong>3 أيام</strong> من تاريخ الاستلام في حال ظهور أي عيب مصنعي.</li>
                <li><strong>حالة المنتج والعلبة:</strong> يجب إعادة المنتج بكامل ملحقاته وعلبته وكرتونته الأصلية بدون أي كسر أو سوء استخدام خارجي أو تعرض للماء.</li>
                <li><strong>شواحن وبطاريات Temax و Ronin:</strong> تخضع لفحص الكفاءة الفنية في مركز الصيانة فور الاستلام للتأكد من الخلل واستبدال القطعة فوراً.</li>
                <li><strong>الشحن للمحافظات:</strong> يتحمل المتجر تكاليف شحن الاستبدال في حال كان الخلل ناتجاً عن عيب مصنعي مثبت.</li>
              </ul>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#222] space-y-2">
                <h3 className="text-sm font-bold text-white">التزامنا بحماية خصوصية العملاء:</h3>
                <p>
                  نحن نعتبر ثقة عملائنا في اليمن أمانة غالية. لا نقوم إطلاقاً ببيع أو تأجير أو مشاركة بياناتك الشخصية (الاسم، أرقام الهواتف، العناوين، وسندات التحويل المالي) مع أي طرف خارجي أو إعلاني.
                </p>
              </div>

              <div className="space-y-2 bg-[#121212] p-4 rounded-2xl border border-[#222]">
                <h4 className="font-bold text-white">استخدام البيانات:</h4>
                <p>تستخدم بياناتك فقط للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>تجهيز وإرسال شحنتك عبر شركات النقل المعتمدة في اليمن.</li>
                  <li>التواصل معك عبر اتصال أو واتساب لتأكيد عنوان التسليم وإرسال سندات التحقق.</li>
                  <li>احتساب وإيداع نقاط الولاء التراكمية في حسابك الشخصي.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#222] space-y-2">
                <h3 className="text-sm font-bold text-white">الشروط والأحكام العامة للتعامل:</h3>
                <p>
                  باستخدامك لمتجر WAKNOVA وإتمام عمليات الشراء أو الطلبات الخاصة، فإنك توافق على البنود المنظمة لعملية البيع والشحن في الجمهورية اليمنية:
                </p>
              </div>

              <ul className="list-disc list-inside space-y-2 bg-[#121212] p-4 rounded-2xl border border-[#222]">
                <li><strong>الأسعار والعملة:</strong> جميع الأسعار المعروضة هي بالريال اليمني (YER) وتشمل التعبئة الأصلية.</li>
                <li><strong>التحويل عبر المحافظ:</strong> عند اختيار الدفع عبر الكريمي أو جيب أو ون كاش، يبقى الطلب في حالة "بانتظار التحقق" حتى مراجعة سند التحويل من قبل الإدارة المالية.</li>
                <li><strong>الطلبات الخاصة:</strong> توفير القطع غير المتوفرة يخضع لتوافرها لدى الوكلاء والموردين وتقدير الوقت المناسب للشحن.</li>
              </ul>
            </div>
          )}

          {/* Official Contact Reminder */}
          <div className="p-3 bg-[#141414] rounded-xl border border-[#262626] flex items-center justify-between text-xs text-zinc-400">
            <span>لأي استفسارات قانونية أو فنية، تواصل مع الإدارة:</span>
            <a
              href="https://wa.me/967780000751"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] font-bold font-mono hover:underline"
            >
              780000751
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
