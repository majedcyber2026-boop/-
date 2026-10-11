import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from './firestoreError';
import {
  Product,
  Order,
  SpecialOrder,
  Customer,
  PaymentMethodConfig,
  Coupon,
  MaintenanceRequest,
  StoreSettings,
  Review,
  RMARequest
} from '../types';
import {
  initialProducts,
  initialCustomers,
  initialOrders,
  initialSpecialOrders,
  initialPaymentMethods,
  initialCoupons,
  initialMaintenanceRequests,
  initialSettings,
  initialReviews
} from '../data/seedData';

// Local Storage Keys for fast fallback & instantaneous rendering
const STORAGE_PREFIX = 'waknova_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage quota or error', e);
  }
}

// Global service
class StoreService {
  private isSeeded = false;

  // Initialize & Seed Database if empty
  async initializeDatabase() {
    if (this.isSeeded) return;
    try {
      const prodCol = collection(db, 'products');
      let snap = null;
      try {
        snap = await getDocs(prodCol);
      } catch (err) {
        console.warn('Firestore products check noticed:', err);
      }

      if (!snap || snap.empty) {
        console.log('🌱 Firestore products empty or initializing, seeding WAKNOVA dataset...');
        await this.seedAllData();
      }
      this.isSeeded = true;
    } catch (e) {
      console.warn('Firestore initialization notice (using offline seed/cache):', e);
    } finally {
      // Ensure local state is seeded
      if (!localStorage.getItem(STORAGE_PREFIX + 'products')) {
        setLocal('products', initialProducts);
        setLocal('customers', initialCustomers);
        setLocal('orders', initialOrders);
        setLocal('specialOrders', initialSpecialOrders);
        setLocal('paymentMethods', initialPaymentMethods);
        setLocal('coupons', initialCoupons);
        setLocal('maintenance', initialMaintenanceRequests);
        setLocal('settings', initialSettings);
        setLocal('reviews', initialReviews);
      }
    }
  }

  // Seed All Data to Firestore
  async seedAllData() {
    try {
      // 1. Settings
      await setDoc(doc(db, 'settings', 'main'), initialSettings).catch(e => console.warn('Settings write:', e));

      // 2. Products
      for (const p of initialProducts) {
        await setDoc(doc(db, 'products', p.id), p).catch(e => console.warn(`Product ${p.id} write:`, e));
      }

      // 3. Customers
      for (const c of initialCustomers) {
        await setDoc(doc(db, 'customers', c.id), c).catch(e => console.warn(`Customer ${c.id} write:`, e));
      }

      // 4. Orders
      for (const o of initialOrders) {
        await setDoc(doc(db, 'orders', o.id), o).catch(e => console.warn(`Order ${o.id} write:`, e));
      }

      // 5. Special Orders
      for (const s of initialSpecialOrders) {
        await setDoc(doc(db, 'specialOrders', s.id), s).catch(e => console.warn(`SpecialOrder ${s.id} write:`, e));
      }

      // 6. Payment Methods
      for (const pm of initialPaymentMethods) {
        await setDoc(doc(db, 'paymentMethods', pm.id), pm).catch(e => console.warn(`PaymentMethod ${pm.id} write:`, e));
      }

      // 7. Coupons
      for (const cp of initialCoupons) {
        await setDoc(doc(db, 'coupons', cp.id), cp).catch(e => console.warn(`Coupon ${cp.id} write:`, e));
      }

      // 8. Maintenance
      for (const m of initialMaintenanceRequests) {
        await setDoc(doc(db, 'maintenanceRequests', m.id), m).catch(e => console.warn(`Maintenance ${m.id} write:`, e));
      }

      // 9. Reviews
      for (const r of initialReviews) {
        await setDoc(doc(db, 'reviews', r.id), r).catch(e => console.warn(`Review ${r.id} write:`, e));
      }

      console.log('✅ WAKNOVA dataset initialized successfully!');
    } catch (e) {
      console.warn('Seed process caught error:', e);
    } finally {
      // Also sync to local storage
      setLocal('products', initialProducts);
      setLocal('customers', initialCustomers);
      setLocal('orders', initialOrders);
      setLocal('specialOrders', initialSpecialOrders);
      setLocal('paymentMethods', initialPaymentMethods);
      setLocal('coupons', initialCoupons);
      setLocal('maintenance', initialMaintenanceRequests);
      setLocal('settings', initialSettings);
      setLocal('reviews', initialReviews);
    }
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        setLocal('products', list);
        return list;
      }
    } catch (e) {
      console.warn('Falling back to cached products:', e);
    }
    return getLocal('products', initialProducts);
  }

  async saveProduct(product: Product): Promise<void> {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.warn('Firestore write failed, saving locally:', e);
    }
    const current = getLocal<Product[]>('products', initialProducts);
    const idx = current.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      current[idx] = product;
    } else {
      current.unshift(product);
    }
    setLocal('products', current);
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.warn('Firestore delete failed, deleting locally:', e);
    }
    const current = getLocal<Product[]>('products', initialProducts);
    const updated = current.filter(p => p.id !== productId);
    setLocal('products', updated);
  }

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        setLocal('orders', list);
        return list;
      }
    } catch (e) {
      console.warn('Falling back to cached orders:', e);
    }
    return getLocal('orders', initialOrders);
  }

  async saveOrder(order: Order): Promise<void> {
    // Auto generate serial numbers & tracking code if missing
    const enrichedItems = order.items.map((item, idx) => {
      const serialNumber = item.serialNumber || `WAK-${(item.brand || 'GOLD').toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
      const warrantyExpiry = item.warrantyExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      return {
        ...item,
        serialNumber,
        warrantyExpiry
      };
    });

    const enrichedOrder: Order = {
      ...order,
      items: enrichedItems,
      trackingCode: order.trackingCode || `TRK-${order.id.replace('ORD-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      warrantyActivated: order.warrantyActivated ?? true,
      courierName: order.courierName || 'مندوب الوكالة السريع (WAKNOVA Express)',
      courierPhone: order.courierPhone || '780000751'
    };

    try {
      await setDoc(doc(db, 'orders', enrichedOrder.id), enrichedOrder);
    } catch (e) {
      console.warn('Firestore write order failed, saving locally:', e);
    }
    const current = getLocal<Order[]>('orders', initialOrders);
    const idx = current.findIndex(o => o.id === enrichedOrder.id);
    if (idx >= 0) {
      current[idx] = enrichedOrder;
    } else {
      current.unshift(enrichedOrder);
    }
    setLocal('orders', current);

    // Update or add customer loyalty info
    this.updateCustomerFromOrder(enrichedOrder);
  }

  async cancelOrder(orderId: string, reason: string = 'إلغاء من قبل العميل'): Promise<boolean> {
    const orders = await this.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    // Only allow cancelling if new
    if (target.status !== 'جديدة') {
      return false;
    }

    const updated: Order = {
      ...target,
      status: 'ملغاة',
      cancellationReason: reason
    };

    try {
      await setDoc(doc(db, 'orders', orderId), updated);
    } catch (e) {}

    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx] = updated;
      setLocal('orders', orders);
    }
    return true;
  }

  // --- RMA & GOLDEN WARRANTY REQUESTS ---
  async getRMARequests(): Promise<RMARequest[]> {
    try {
      const snap = await getDocs(collection(db, 'rmaRequests'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as RMARequest));
        setLocal('rmaRequests', list);
        return list;
      }
    } catch (e) {}
    return getLocal<RMARequest[]>('rmaRequests', [
      {
        id: 'RMA-901',
        orderId: 'ORD-901',
        serialNumber: 'WAK-TEM-892144',
        customerName: 'محمد أحمد الكبسي',
        phone: '771234567',
        deviceModel: 'شاحن Temax 35W GaN',
        requestType: 'استبدال فوري (3 أيام)',
        issueDescription: 'إضاءة المؤشر لا تعمل عند التوصيل بالكهرباء.',
        status: 'تمت الموافقة وبانتظار الشحن',
        adminNotes: 'تم اعتماد الاستبدال المباشر برأس شاحن جديد.',
        createdAt: '2026-03-14T10:00:00Z'
      }
    ]);
  }

  async saveRMARequest(req: RMARequest): Promise<void> {
    try {
      await setDoc(doc(db, 'rmaRequests', req.id), req);
    } catch (e) {
      console.warn('Firestore write RMA failed:', e);
    }
    const current = await this.getRMARequests();
    const idx = current.findIndex(r => r.id === req.id);
    if (idx >= 0) {
      current[idx] = req;
    } else {
      current.unshift(req);
    }
    setLocal('rmaRequests', current);
  }

  private async updateCustomerFromOrder(order: Order) {
    const customers = getLocal<Customer[]>('customers', initialCustomers);
    const existing = customers.find(c => c.phone === order.phone);
    const earnedPoints = Math.floor(order.total / 1000) * 10;
    if (existing) {
      existing.totalSpent += order.total;
      existing.ordersCount += 1;
      existing.points += earnedPoints;
      existing.governorate = order.governorate || existing.governorate;
      try {
        await updateDoc(doc(db, 'customers', existing.id), {
          totalSpent: existing.totalSpent,
          ordersCount: existing.ordersCount,
          points: existing.points
        });
      } catch {}
    } else {
      const newCust: Customer = {
        id: 'cust-' + Date.now(),
        name: order.customerName,
        phone: order.phone,
        governorate: order.governorate,
        totalSpent: order.total,
        ordersCount: 1,
        points: earnedPoints,
        createdAt: new Date().toISOString()
      };
      customers.push(newCust);
      try {
        await setDoc(doc(db, 'customers', newCust.id), newCust);
      } catch {}
    }
    setLocal('customers', customers);
  }

  // --- SPECIAL ORDERS ---
  async getSpecialOrders(): Promise<SpecialOrder[]> {
    try {
      const snap = await getDocs(collection(db, 'specialOrders'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as SpecialOrder));
        setLocal('specialOrders', list);
        return list;
      }
    } catch (e) {
      console.warn('Falling back to cached special orders:', e);
    }
    return getLocal('specialOrders', initialSpecialOrders);
  }

  async saveSpecialOrder(so: SpecialOrder): Promise<void> {
    try {
      await setDoc(doc(db, 'specialOrders', so.id), so);
    } catch (e) {
      console.warn('Firestore write special order failed, saving locally:', e);
    }
    const current = getLocal<SpecialOrder[]>('specialOrders', initialSpecialOrders);
    const idx = current.findIndex(s => s.id === so.id);
    if (idx >= 0) {
      current[idx] = so;
    } else {
      current.unshift(so);
    }
    setLocal('specialOrders', current);
  }

  // --- CUSTOMERS ---
  async getCustomers(): Promise<Customer[]> {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Customer));
        setLocal('customers', list);
        return list;
      }
    } catch (e) {
      console.warn('Falling back to cached customers:', e);
    }
    return getLocal('customers', initialCustomers);
  }

  // --- PAYMENT METHODS ---
  async getPaymentMethods(): Promise<PaymentMethodConfig[]> {
    try {
      const snap = await getDocs(collection(db, 'paymentMethods'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as PaymentMethodConfig));
        setLocal('paymentMethods', list);
        return list;
      }
    } catch (e) {}
    return getLocal('paymentMethods', initialPaymentMethods);
  }

  async savePaymentMethod(pm: PaymentMethodConfig): Promise<void> {
    try {
      await setDoc(doc(db, 'paymentMethods', pm.id), pm);
    } catch (e) {}
    const current = getLocal<PaymentMethodConfig[]>('paymentMethods', initialPaymentMethods);
    const idx = current.findIndex(p => p.id === pm.id);
    if (idx >= 0) {
      current[idx] = pm;
    } else {
      current.push(pm);
    }
    setLocal('paymentMethods', current);
  }

  // --- COUPONS ---
  async getCoupons(): Promise<Coupon[]> {
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Coupon));
        setLocal('coupons', list);
        return list;
      }
    } catch (e) {}
    return getLocal('coupons', initialCoupons);
  }

  async saveCoupon(coupon: Coupon): Promise<void> {
    try {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
    } catch (e) {}
    const current = getLocal<Coupon[]>('coupons', initialCoupons);
    const idx = current.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      current[idx] = coupon;
    } else {
      current.push(coupon);
    }
    setLocal('coupons', current);
  }

  // --- MAINTENANCE REQUESTS ---
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    try {
      const snap = await getDocs(collection(db, 'maintenanceRequests'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as MaintenanceRequest));
        setLocal('maintenance', list);
        return list;
      }
    } catch (e) {}
    return getLocal('maintenance', initialMaintenanceRequests);
  }

  async saveMaintenanceRequest(req: MaintenanceRequest): Promise<void> {
    try {
      await setDoc(doc(db, 'maintenanceRequests', req.id), req);
    } catch (e) {}
    const current = getLocal<MaintenanceRequest[]>('maintenance', initialMaintenanceRequests);
    const idx = current.findIndex(m => m.id === req.id);
    if (idx >= 0) {
      current[idx] = req;
    } else {
      current.unshift(req);
    }
    setLocal('maintenance', current);
  }

  // --- SETTINGS ---
  async getSettings(): Promise<StoreSettings> {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (!snap.empty) {
        const data = snap.docs[0].data() as StoreSettings;
        setLocal('settings', data);
        return data;
      }
    } catch (e) {}
    return getLocal('settings', initialSettings);
  }

  async saveSettings(settings: StoreSettings): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
    } catch (e) {}
    setLocal('settings', settings);
  }

  // --- REVIEWS ---
  async getReviews(productId?: string): Promise<Review[]> {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Review));
        setLocal('reviews', list);
        return productId ? list.filter(r => r.productId === productId) : list;
      }
    } catch (e) {}
    const all = getLocal<Review[]>('reviews', initialReviews);
    return productId ? all.filter(r => r.productId === productId) : all;
  }

  async addReview(review: Review): Promise<void> {
    try {
      await setDoc(doc(db, 'reviews', review.id), review);
    } catch (e) {}
    const all = getLocal<Review[]>('reviews', initialReviews);
    all.unshift(review);
    setLocal('reviews', all);
  }
}

export const storeService = new StoreService();
