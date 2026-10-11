import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Share2,
  Sparkles,
  User
} from 'lucide-react';
import { Product, Review, UserProfile } from '../types';
import { storeService } from '../services/storeService';
import { Currency, formatPrice } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  currency?: Currency;
  currentUser?: UserProfile | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  allProducts,
  onSelectProduct,
  currency = 'YER',
  currentUser
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (currentUser?.name && !reviewerName) {
      setReviewerName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!product) return;
    setSelectedImageIndex(0);
    setQuantity(1);
    storeService.getReviews(product.id).then(setReviews);
  }, [product]);

  if (!product) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `شاهد ${product.name} على متجر WAKNOVA الوكالة الحديثة للهواتف الذكية`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;
    setIsSubmittingReview(true);
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      customerName: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      createdAt: new Date().toISOString(),
      isVerified: true,
      userRole: currentUser?.role || 'customer'
    };
    await storeService.addReview(newRev);
    setReviews([newRev, ...reviews]);
    if (!currentUser) setReviewerName('');
    setReviewerComment('');
    setShowReviewForm(false);
    setIsSubmittingReview(false);
  };

  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header Close & Share */}
        <div className="flex items-center justify-between p-4 border-b border-[#202020] bg-black/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-en text-xs font-bold text-[#D4AF37] tracking-widest uppercase">
              {product.brand}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#181818] hover:bg-[#252525] text-zinc-300 hover:text-white transition text-xs flex items-center gap-1.5"
              title="مشاركة المنتج"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-2 rounded-full transition ${
                isFavorite
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                  : 'bg-[#181818] text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* Main Product Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            
            {/* Left/Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full bg-[#141414] rounded-2xl overflow-hidden border border-[#222] p-6 flex items-center justify-center">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 p-1 bg-[#141414] shrink-0 transition ${
                        selectedImageIndex === idx
                          ? 'border-[#D4AF37] shadow-md shadow-[#D4AF37]/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#111] p-3 rounded-xl border border-[#222] flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <div className="font-bold text-white">ضمان الوكالة الذهبي</div>
                    <div className="text-[10px] text-zinc-400">فحص واستبدال معتمد</div>
                  </div>
                </div>

                <div className="bg-[#111] p-3 rounded-xl border border-[#222] flex items-center gap-2.5 text-xs text-zinc-300">
                  <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <div className="font-bold text-white">شحن فوري باليمن</div>
                    <div className="text-[10px] text-zinc-400">صنعاء وكافة المحافظات</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Details & Buy Actions */}
            <div className="space-y-5">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-white">{product.rating || 4.8}</span>
                    <span>({reviews.length || product.reviewsCount || 15} تقييم)</span>
                  </div>
                  <span>•</span>
                  <span className={isOutOfStock ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isOutOfStock ? 'غير متوفر حالياً' : `متوفر بالمخزن (${product.quantity} قطعة)`}
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171408] to-black border border-[#3e320f] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block mb-1">السعر الرسمي:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {formatPrice(product.price, currency)}
                    </span>
                  </div>
                </div>

                {product.oldPrice && (
                  <div className="text-left">
                    <span className="text-xs text-zinc-500 block mb-1">قبل الخصم:</span>
                    <span className="text-sm font-mono text-zinc-400 line-through">
                      {formatPrice(product.oldPrice, currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">الكمية:</span>
                  <div className="flex items-center border border-[#333] rounded-xl bg-[#141414] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-white font-mono font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                      className="px-3.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition text-sm font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={isOutOfStock}
                    className="w-full bg-[#D4AF37] hover:bg-[#e2c14f] text-black font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition disabled:bg-zinc-800 disabled:text-zinc-500 active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>أضف إلى السلة</span>
                  </button>

                  <a
                    href={`https://wa.me/967780000751?text=${encodeURIComponent(
                      `مرحباً وكالة WAKNOVA، أرغب بطلب وشراء المنتج التالي:\n- ${product.name}\n- الكمية: ${quantity}\n- السعر: ${product.price} ريال يمني`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#171717] hover:bg-[#222] border border-[#3e320f] hover:border-[#D4AF37] text-[#D4AF37] font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>طلب فوري عبر واتساب</span>
                  </a>
                </div>
              </div>

              {/* Product Marketing Description */}
              <div className="pt-4 border-t border-[#202020] space-y-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>الوصف والمواصفات الفنية:</span>
                </h3>
                <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-[#111] p-4 rounded-xl border border-[#222]">
                  {product.description}
                </div>
              </div>

            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-[#202020] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base">تقييمات وآراء العملاء</h3>
                <p className="text-xs text-zinc-400">تجارب حقيقية لعملاء وكالة WAKNOVA</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs bg-[#171717] hover:bg-[#252525] border border-[#333] hover:border-[#D4AF37] text-[#D4AF37] font-semibold px-4 py-2 rounded-xl transition"
              >
                {showReviewForm ? 'إلغاء' : 'أضف تقييمك'}
              </button>
            </div>

            {/* Review Form Drawer */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-[#141414] border border-[#333] p-4 rounded-2xl space-y-3 animate-fadeIn">
                <h4 className="text-white text-xs font-bold">اكتب رأيك في هذا المنتج:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="اسمك الكريم"
                    required
                    className="bg-[#0c0c0c] border border-[#262626] text-xs text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex items-center gap-2 bg-[#0c0c0c] border border-[#262626] rounded-xl px-3 py-2">
                    <span className="text-xs text-zinc-400">التقييم:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewerRating(s)}
                          className="text-amber-400"
                        >
                          <Star className={`w-4 h-4 ${s <= reviewerRating ? 'fill-amber-400' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="شاركنا رأيك في جودة المنتج وسرعة الشحن..."
                  required
                  rows={2}
                  className="w-full bg-[#0c0c0c] border border-[#262626] text-xs text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-[#D4AF37] hover:bg-[#e2c14f] text-black text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    {isSubmittingReview ? 'جاري الإرسال...' : 'نشر التقييم'}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">كن أول من يكتب تقييماً لهذا المنتج الفاخر!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#111] border border-[#222] p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-zinc-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white">{rev.customerName}</span>
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                            <span>مشترٍ موثق</span>
                            <span>✔️</span>
                          </span>
                          {rev.userRole === 'admin' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                              المدير العام 👑
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-zinc-600 font-mono block">
                      {new Date(rev.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="pt-6 border-t border-[#202020] space-y-4">
              <h3 className="text-white font-bold text-sm">منتجات مشابهة قد تناسبك:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarProducts.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectProduct(sim)}
                    className="bg-[#111] hover:bg-[#181818] border border-[#222] hover:border-[#D4AF37]/50 rounded-xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2 group"
                  >
                    <div className="aspect-square bg-[#161616] rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={sim.images[0]}
                        alt={sim.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-semibold block">{sim.brand}</span>
                      <h4 className="text-xs text-white line-clamp-1 font-medium">{sim.name}</h4>
                      <span className="text-xs font-mono font-bold text-white mt-1 block">
                        {sim.price.toLocaleString('en-US')} ريال
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
