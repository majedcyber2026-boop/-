export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in YER
  cost: number;
  quantity: number;
  images: string[];
  description: string;
  isActive: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  serialNumber?: string;
  warrantyExpiry?: string;
}

export type OrderPriority = '🔴 عاجل جدًا' | '🟠 مهم' | '🟡 عادي' | '🟢 مؤجل';
export type OrderStatus = 'جديدة' | 'قيد التجهيز' | 'تم الشحن' | 'تم التسليم' | 'ملغاة';
export type PaymentStatus = 'بانتظار التحقق' | 'تم التحقق' | 'ملغي';
export type PaymentMethodType = 'الدفع عند الاستلام' | 'الكريمي المميز' | 'جيب (Jeeb)' | 'ون كاش (OneCash)' | 'جوالي';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  receiptImage?: string;
  priority: OrderPriority;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  trackingCode?: string;
  courierName?: string;
  courierPhone?: string;
  warrantyActivated?: boolean;
  cancellationReason?: string;
}

export interface RMARequest {
  id: string;
  orderId?: string;
  serialNumber: string;
  customerName: string;
  phone: string;
  deviceModel: string;
  requestType: 'استبدال فوري (3 أيام)' | 'صيانة تحت الضمان (12 شهر)' | 'فحص فني';
  issueDescription: string;
  status: 'قيد المراجعة' | 'تمت الموافقة وبانتظار الشحن' | 'جاري الفحص المخبري' | 'تم الاستبدال/الإصلاح' | 'مرفوض';
  adminNotes?: string;
  createdAt: string;
}

export interface SpecialOrder {
  id: string;
  productName: string;
  quantity: number;
  neededBy: string; // اليوم / هذا الأسبوع / تاريخ محدد
  notes: string;
  phone: string;
  status: 'بانتظار الرد' | 'تم توفيره' | 'جاري البحث' | 'غير متوفر';
  adminReply?: string;
  estimatedPrice?: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  totalSpent: number;
  ordersCount: number;
  points: number;
  createdAt: string;
}

export interface PaymentMethodConfig {
  id: string;
  walletName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  icon?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified?: boolean;
  userRole?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage or fixed amount
  isPercentage: boolean;
  isActive: boolean;
  expiryDate: string;
}

export interface MaintenanceRequest {
  id: string;
  customerName: string;
  phone: string;
  deviceModel: string;
  issue: string;
  status: 'قيد الفحص' | 'جاري الإصلاح' | 'جاهز للاستلام' | 'تم التسليم';
  receivedAt: string;
  deliveredAt?: string;
  cost?: number;
  notes: string;
}

export interface StoreNotification {
  id: string;
  userId?: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type?: 'order' | 'maintenance' | 'system';
}

export interface StoreSettings {
  id?: string;
  storeName: string;
  storeNameEn: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  country: string;
  address: string;
  aboutUs: string;
  returnPolicy: string;
  privacyPolicy: string;
  loyaltyRate: number; // points per 1000 YER
  exchangeRateSar?: number; // e.g. 500 YER per 1 SAR (Sanaa) or 530 (Aden)
  exchangeRateUsd?: number; // e.g. 1900 YER per 1 USD (or 530)
  exchangeRegion?: 'صنعاء (المناطق الشمالية)' | 'عدن (المناطق الجنوبية)';
  shippingFeeSanaa?: number;
  shippingFeeProvinces?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'customer' | 'manager' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  governorate: string;
  role: UserRole;
  points: number;
  walletBalance: number; // in YER
  createdAt: string;
  avatar?: string;
  address?: string;
}
