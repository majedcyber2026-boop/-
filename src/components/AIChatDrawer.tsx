import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, ShoppingBag, Phone, RefreshCw, MessageSquareShare, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenProduct: (product: Product) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onOpenProduct
}) => {
  const [input, setInput] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalatedSuccess, setEscalatedSuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'أهلاً بك في WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها باليمن 🌟 أنا مساعدك الذكي، كيف أستطيع خدمتك اليوم؟ يمكنك سؤالي عن أنسب الشواحن لأجهزتك، سعات البطاريات السفري، السماعات الأصلية، أو التوصيل في اليمن.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleEscalateToManager = async () => {
    try {
      setIsEscalating(true);
      const conversationText = messages.map(m => `${m.sender === 'user' ? 'العميل' : 'المساعد الذكي'}: ${m.text}`).join('\n');
      
      // Save conversation to Firestore
      await addDoc(collection(db, 'inquiries'), {
        customerPhone: customerPhone.trim() || 'غير محدد',
        conversation: conversationText,
        messagesCount: messages.length,
        status: 'جديد',
        createdAt: serverTimestamp(),
        dateStr: new Date().toISOString()
      }).catch(err => {
        console.warn('Could not save to firestore:', err);
      });

      setEscalatedSuccess(true);

      // Open WhatsApp to manager
      const encodedText = encodeURIComponent(
        `السلام عليكم ورحمة الله، أنا من عملاء متجر WAKNOVA.\nلدي استفسار ومحادثة أود متابعتها مع الإدارة:\n${messages[messages.length - 1]?.text || ''}\nرقمي: ${customerPhone || 'مرفق'}`
      );
      window.open(`https://wa.me/967780000751?text=${encodedText}`, '_blank');
    } catch (e) {
      console.error(e);
    } finally {
      setIsEscalating(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          products: products.map(p => ({
            name: p.name,
            brand: p.brand,
            category: p.category,
            price: p.price,
            quantity: p.quantity
          }))
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'يسعدنا دائماً خدمتك في WAKNOVA! يمكنك أيضاً التواصل مباشرة مع الإدارة عبر واتساب على الرقم 780000751.';

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: 'يسعدنا دائماً خدمتك في WAKNOVA! شواحن Temax و Ronin وسماعات KingTel متوفرة بضمان معتمد. تفضل بمراسلتنا أيضاً عبر واتساب 780000751.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    'ما هو أفضل شاحن سريع للآيفون وسامسونج؟',
    'أبحث عن بطارية سفري قوية للابتوب والرحلات',
    'ما هي شروط التوصيل للمحافظات في اليمن؟',
    'هل سماعات KingTel TWS Pro تدعم عزل الضوضاء؟'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0d0d0d] border-r border-[#262626] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a6813] p-0.5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[#D4AF37]">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white">مساعد WAKNOVA الذكي</h2>
                  <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-mono border border-[#D4AF37]/30">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">مستشارك الفني لمنتجات الهواتف الأصلية</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] hover:bg-[#252525] text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Quick Prompts */}
            <div className="space-y-1.5 pb-2">
              <span className="text-[10px] text-zinc-500 font-bold block mb-1">أسئلة شائعة وسريعة:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-[11px] bg-[#141414] hover:bg-[#1f1a0b] text-zinc-300 hover:text-[#D4AF37] border border-[#2a2a2a] hover:border-[#52410e] px-2.5 py-1.5 rounded-xl transition text-right"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Flow */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                    m.sender === 'user'
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-[#1e1a0b] text-[#D4AF37] border border-[#52410e]'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-[#D4AF37] text-black font-semibold rounded-tl-sm'
                      : 'bg-[#141414] text-zinc-200 border border-[#262626] rounded-tr-sm whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block text-left font-mono ${
                      m.sender === 'user' ? 'text-black/60' : 'text-zinc-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-zinc-500">
                <div className="w-7 h-7 rounded-full bg-[#1e1a0b] border border-[#52410e] flex items-center justify-center text-[#D4AF37]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#141414] border border-[#262626] p-3 rounded-2xl flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                  <span>المساعد يفكر ويستخرج الإجابة...</span>
                </div>
              </div>
            )}

            {/* Manager Escalation Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#18150c] to-[#141414] border border-[#52410e]/60 text-xs space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[#D4AF37] font-bold flex items-center gap-1.5 text-[11px]">
                  <MessageSquareShare className="w-3.5 h-3.5" />
                  لم تجد إجابتك أو تود التحدث للمدير؟
                </span>
                {escalatedSuccess && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> تم التحويل والحفظ
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                يمكنك تحويل المحادثة وحفظها مباشرة لدى إدارة WAKNOVA للمتابعة الفورية عبر واتساب.
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="tel"
                  placeholder="رقم جوالك (اختياري)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="flex-1 bg-black/60 border border-[#333] focus:border-[#D4AF37] text-white text-[11px] rounded-lg px-2.5 py-1.5 outline-none font-mono"
                />
                <button
                  onClick={handleEscalateToManager}
                  disabled={isEscalating}
                  className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold text-[11px] px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  {isEscalating ? 'جاري التحويل...' : 'تحويل للمدير 👨‍💼'}
                </button>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 sm:p-4 border-t border-[#222] bg-[#090909]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا باللغة العربية..."
                className="flex-1 bg-[#141414] border border-[#2a2a2a] focus:border-[#D4AF37] text-xs text-white rounded-xl py-3 px-3.5 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black p-3 rounded-xl transition disabled:opacity-40"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500 px-1">
              <span>مدعوم بواسطة Google Gemini</span>
              <a
                href="https://wa.me/967780000751"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                واتساب مباشر: 780000751
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
