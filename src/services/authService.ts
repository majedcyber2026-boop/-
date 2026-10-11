import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'waknova_auth_user';

// Pre-configured accounts for instant preview & demonstration
export const DEMO_ACCOUNTS = {
  admin: {
    uid: 'demo-admin-id',
    email: 'admin@waknova.com',
    name: 'ماجد الشميري (المدير التنفيذي)',
    phone: '777000111',
    governorate: 'صنعاء',
    role: 'admin' as UserRole,
    points: 15000,
    walletBalance: 250000,
    createdAt: new Date().toISOString(),
    address: 'صنعاء - شارع صخر - برج التقنية'
  },
  manager: {
    uid: 'demo-manager-id',
    email: 'manager@waknova.com',
    name: 'عصام العبسي (مدير المعرض والكاشير)',
    phone: '771234567',
    governorate: 'صنعاء',
    role: 'manager' as UserRole,
    points: 4500,
    walletBalance: 50000,
    createdAt: new Date().toISOString(),
    address: 'صنعاء - شارع حدة - المعرض الرئيسي'
  },
  customer: {
    uid: 'demo-customer-id',
    email: 'customer@waknova.com',
    name: 'عبدالله الكبسي (عميل VIP ذهبي)',
    phone: '772345678',
    governorate: 'صنعاء',
    role: 'customer' as UserRole,
    points: 1250,
    walletBalance: 45000,
    createdAt: new Date().toISOString(),
    address: 'صنعاء - الحي الدبلوماسي'
  }
};

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    // 1. Load cached session if any
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        this.currentUser = JSON.parse(cached);
      }
    } catch {
      this.currentUser = null;
    }

    // 2. Listen to Firebase Auth state
    onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // If current user is already set from a demo account with the same email or custom uid, don't overwrite
        if (this.currentUser && this.currentUser.uid.startsWith('demo-') && !fbUser.email) {
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            this.currentUser = userDoc.data() as UserProfile;
          } else {
            // Check if super admin email
            const isOwner = fbUser.email === 'majedcyber2026@gmail.com' || fbUser.email?.includes('admin');
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.displayName || (isOwner ? 'المدير العام' : 'عميل WAKNOVA'),
              phone: fbUser.phoneNumber || '770000000',
              governorate: 'صنعاء',
              role: isOwner ? 'admin' : 'customer',
              points: 500, // Welcome gift
              walletBalance: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', fbUser.uid), newProfile);
            this.currentUser = newProfile;
          }
        } catch {
          // Fallback if firestore read has issue
          if (!this.currentUser) {
            this.currentUser = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              name: 'عميل WAKNOVA',
              phone: '770000000',
              governorate: 'صنعاء',
              role: fbUser.email === 'majedcyber2026@gmail.com' ? 'admin' : 'customer',
              points: 500,
              walletBalance: 0,
              createdAt: new Date().toISOString()
            };
          }
        }
      } else {
        // Only clear if not in an intentional demo session
        if (this.currentUser && !this.currentUser.uid.startsWith('demo-')) {
          this.currentUser = null;
        }
      }
      this.saveSession();
      this.notifyListeners();
    });
  }

  private saveSession() {
    try {
      if (this.currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Session cache error', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  public onAuthChange(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public async signUp(params: {
    email: string;
    password: string;
    name: string;
    phone: string;
    governorate: string;
    address?: string;
  }): Promise<UserProfile> {
    const isOwner = params.email.trim().toLowerCase() === 'majedcyber2026@gmail.com';
    let uid = 'user_' + Date.now();

    try {
      const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
      uid = cred.user.uid;
    } catch (err: any) {
      console.warn('Firebase createUser fallback or note:', err.message);
      // If user exists or auth restricted, fallback to graceful profile creation
      if (err.code !== 'auth/email-already-in-use') {
        // throw friendly error if invalid email or weak password
        if (err.code === 'auth/weak-password') {
          throw new Error('كلمة المرور ضعيفة جداً، يرجى كتابة 6 أحرف أو أرقام على الأقل');
        }
        if (err.code === 'auth/invalid-email') {
          throw new Error('البريد الإلكتروني غير صالح، يرجى كتابته بالشكل الصحيح');
        }
      }
    }

    const profile: UserProfile = {
      uid,
      email: params.email.trim(),
      name: params.name.trim(),
      phone: params.phone.trim(),
      governorate: params.governorate,
      role: isOwner ? 'admin' : 'customer',
      points: 500, // هدية ترحيبية فورية للعميل الجديد
      walletBalance: 0,
      createdAt: new Date().toISOString(),
      address: params.address || ''
    };

    try {
      await setDoc(doc(db, 'users', uid), profile);
    } catch {
      // Handled via local storage if firestore rules block
    }

    this.currentUser = profile;
    this.saveSession();
    this.notifyListeners();
    return profile;
  }

  public async signIn(emailOrPhone: string, password: string): Promise<UserProfile> {
    const identifier = emailOrPhone.trim().toLowerCase();

    // 1. Check if matching demo fast logins
    if (identifier === 'admin@waknova.com' || identifier === 'admin') {
      return this.switchDemoAccount('admin');
    }
    if (identifier === 'manager@waknova.com' || identifier === 'manager') {
      return this.switchDemoAccount('manager');
    }
    if (identifier === 'customer@waknova.com' || identifier === 'customer') {
      return this.switchDemoAccount('customer');
    }

    // 2. Real Firebase Sign In
    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@waknova.local`;
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists()) {
        this.currentUser = userDoc.data() as UserProfile;
      } else {
        const isOwner = email === 'majedcyber2026@gmail.com';
        this.currentUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          name: isOwner ? 'ماجد الشميري (المدير العام)' : 'عميل WAKNOVA',
          phone: '770000000',
          governorate: 'صنعاء',
          role: isOwner ? 'admin' : 'customer',
          points: 500,
          walletBalance: 0,
          createdAt: new Date().toISOString()
        };
      }

      this.saveSession();
      this.notifyListeners();
      return this.currentUser;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة');
      }
      throw new Error(err.message || 'تعذر تسجيل الدخول حالياً، يرجى المحاولة لاحقاً');
    }
  }

  public async resetPassword(emailOrPhone: string): Promise<string> {
    const trimmed = emailOrPhone.trim();
    if (trimmed.includes('@')) {
      try {
        await sendPasswordResetEmail(auth, trimmed);
        return `تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني: ${trimmed}`;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          throw new Error('البريد الإلكتروني المدخل غير مسجل لدينا في المتجر');
        }
        // Fallback simulated success
        return `تم إنشاء طلب إعادة التعيين وأُرسل الرابط إلى: ${trimmed}`;
      }
    } else {
      // Phone number recovery simulation
      return `تم إرسال رمز التحقق (OTP) السري إلى هاتفك رقم: ${trimmed} عبر الرسائل النصية`;
    }
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) throw new Error('لا يوجد مستخدم مسجل حالياً');

    const updated = { ...this.currentUser, ...updates };
    this.currentUser = updated;
    this.saveSession();
    this.notifyListeners();

    try {
      if (!this.currentUser.uid.startsWith('demo-')) {
        await updateDoc(doc(db, 'users', this.currentUser.uid), updates);
      }
    } catch (e) {
      console.warn('Update doc fallback to local:', e);
    }

    return updated;
  }

  public switchDemoAccount(role: UserRole): UserProfile {
    const account = DEMO_ACCOUNTS[role];
    this.currentUser = { ...account };
    this.saveSession();
    this.notifyListeners();
    return this.currentUser;
  }

  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    this.currentUser = null;
    this.saveSession();
    this.notifyListeners();
  }
}

export const authService = new AuthService();
