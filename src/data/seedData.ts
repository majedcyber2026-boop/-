import { Product, Customer, Order, SpecialOrder, PaymentMethodConfig, Coupon, MaintenanceRequest, StoreSettings, Review } from '../types';

export const initialSettings: StoreSettings = {
  storeName: "الوكالة الحديثة للهواتف الذكية ومستلزماتها",
  storeNameEn: "WAKNOVA",
  phone: "780000751",
  whatsapp: "780000751",
  instagram: "@6taaj",
  country: "اليمن",
  address: "الجمهورية اليمنية - صنعاء / خدمة التوصيل والشحن لكافة المحافظات",
  aboutUs: "WAKNOVA (الوكالة الحديثة للهواتف الذكية ومستلزماتها) هو صرح رائد في عالم التكنولوجيا والإكسسوارات الفاخرة في اليمن. نلتزم بتوفير المنتجات الأصلية 100% من أشهر الماركات العالمية والموثوقة مثل Temax وRonin وKingTel وLens Shield مع الضمان الحقيقي والخدمة المميزة لعملائنا في كل محافظات الوطن.",
  returnPolicy: "ضمان الفحص والاستبدال لمدة 3 أيام من تاريخ الاستلام في حال ظهور أي عيب مصنعي للمنتجات، بشرط بقاء المنتج بكامل ملحقاته وعلبته الأصلية.",
  privacyPolicy: "نحن في وكالة WAKNOVA نقدر ثقتكم ونلتزم التزاماً مطلقاً بحماية بياناتكم الشخصية وعناوينكم، ولا نشاركها إطلاقاً مع أي جهة خارجية.",
  loyaltyRate: 10 // 10 points per 1000 YER
};

export const initialPaymentMethods: PaymentMethodConfig[] = [
  {
    id: "kuraimi",
    walletName: "بنك الكريمي (حساب مميز)",
    accountNumber: "3008945612",
    accountName: "الوكالة الحديثة للهواتف الذكية - WAKNOVA",
    isActive: true,
  },
  {
    id: "jeeb",
    walletName: "محفظة جيب (Jeeb)",
    accountNumber: "780000751",
    accountName: "WAKNOVA الحديثة",
    isActive: true,
  },
  {
    id: "onecash",
    walletName: "محفظة ون كاش (OneCash)",
    accountNumber: "780000751",
    accountName: "الوكالة الحديثة للهواتف الذكية",
    isActive: true,
  },
  {
    id: "jawali",
    walletName: "محفظة جوالي (Jawwali)",
    accountNumber: "780000751",
    accountName: "WAKNOVA Store",
    isActive: true,
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: "c1",
    code: "WAKNOVA10",
    discount: 10,
    isPercentage: true,
    isActive: true,
    expiryDate: "2026-12-31"
  },
  {
    id: "c2",
    code: "GOLDEN",
    discount: 2000,
    isPercentage: false,
    isActive: true,
    expiryDate: "2026-11-30"
  },
  {
    id: "c3",
    code: "YEMEN2026",
    discount: 15,
    isPercentage: true,
    isActive: true,
    expiryDate: "2026-12-31"
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "شاحن Temax 24W السريع بمنفذين USB + Type-C",
    brand: "Temax",
    category: "شواحن",
    price: 4500,
    cost: 3100,
    quantity: 35,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "رأس شاحن جداري فائق السرعة من تيماكس بقدرة 24 واط. يدعم تقنية Quick Charge 3.0 ومزود بحماية ذكية من الحرارة والجهد الزائد. تصميم متين ومدمج يلائم السفر والاستخدام اليومي.",
    isActive: true,
    isFeatured: true,
    isNew: false,
    onSale: true,
    oldPrice: 5200,
    rating: 4.8,
    reviewsCount: 19,
    createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "prod-2",
    name: "شاحن Temax 35W GaN التوربيني مزدوج Type-C",
    brand: "Temax",
    category: "شواحن",
    price: 7800,
    cost: 5400,
    quantity: 28,
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "شاحن حديث بتقنية الجاليوم نيتريد (GaN) المتقدمة. قدرة 35 واط تدعم بروتوكول Power Delivery (PD) لشحن أجهزة آيفون وسامسونج من 0 إلى 60% في 25 دقيقة فقط بدون حرارة.",
    isActive: true,
    isFeatured: true,
    isNew: true,
    onSale: false,
    rating: 4.9,
    reviewsCount: 24,
    createdAt: "2026-03-10T12:00:00Z"
  },
  {
    id: "prod-3",
    name: "بطارية سفري Temax 20000mAh شحن فائق مع شاشة رقمية LED",
    brand: "Temax",
    category: "بطاريات",
    price: 13500,
    cost: 9800,
    quantity: 18,
    images: [
      "https://images.unsplash.com/photo-1609592426867-0c7f1a30f3c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1619472363539-786d790445d4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "باور بانك عملاق بسعة 20,000 ملي أمبير مع شاشة رقمية دقيقة تظهر النسبة المئوية المتبقية. 3 منافذ شحن سريعة 22.5W لشحن 3 أجهزة في وقت واحد بأعلى كفاءة وأمان.",
    isActive: true,
    isFeatured: true,
    isNew: false,
    onSale: true,
    oldPrice: 15000,
    rating: 5.0,
    reviewsCount: 31,
    createdAt: "2026-02-15T09:00:00Z"
  },
  {
    id: "prod-4",
    name: "بطارية سفري Temax 30000mAh العملاقة 65W للابتوب والهواتف",
    brand: "Temax",
    category: "بطاريات",
    price: 24000,
    cost: 18000,
    quantity: 12,
    images: [
      "https://images.unsplash.com/photo-1619472363539-786d790445d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609592426867-0c7f1a30f3c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "أقوى بطارية طوارئ بسعة 30,000 ملي أمبير قادرة على شحن أجهزة اللابتوب (MacBook / Dell / HP) بقوة 65 واط Type-C PD وهواتف آيفون وسامسونج لعدة أيام دون انقطاع.",
    isActive: true,
    isFeatured: true,
    isNew: true,
    onSale: false,
    rating: 4.9,
    reviewsCount: 15,
    createdAt: "2026-03-05T14:00:00Z"
  },
  {
    id: "prod-5",
    name: "كابل Ronin PD 100W قماش مصفح Type-C to Type-C 1.2M",
    brand: "Ronin",
    category: "كابلات",
    price: 3200,
    cost: 1900,
    quantity: 45,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80"
    ],
    description: "كابل رونين الخارق معتمد لنقل تيار حتى 100 واط لنقل البيانات الفائق وشحن الهواتف والحواسيب. مغطى بنسيج نايلون مجدول عسكري مقاوم للقطع والانثناء حتى 20,000 مرة.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: true,
    oldPrice: 3900,
    rating: 4.7,
    reviewsCount: 22,
    createdAt: "2026-02-20T11:00:00Z"
  },
  {
    id: "prod-6",
    name: "كابل Ronin Fast Charge 3A معدني Lightning للآيفون",
    brand: "Ronin",
    category: "كابلات",
    price: 2800,
    cost: 1600,
    quantity: 50,
    images: [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    description: "وصلة شحن سريعة لجميع أجهزة أبل آيفون وآيباد، مع رقاقة حماية ذكية ضد ارتفاع الفولتية وسرعة نقل بيانات فورية مع الحواسيب.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.6,
    reviewsCount: 18,
    createdAt: "2026-01-25T16:00:00Z"
  },
  {
    id: "prod-7",
    name: "كابل Ronin 3-in-1 متعدد المنافذ (Type-C / Lightning / Micro)",
    brand: "Ronin",
    category: "كابلات",
    price: 3600,
    cost: 2100,
    quantity: 40,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    description: "كابل واحد يشحن جميع أنواع الهواتف الذكية في آن واحد. أطراف معززة بالألومنيوم عالي النقاء وسلك داخلي نحاسي سميك لنقل تيار قوي ومستقر.",
    isActive: true,
    isFeatured: false,
    isNew: true,
    onSale: false,
    rating: 4.8,
    reviewsCount: 14,
    createdAt: "2026-03-08T08:00:00Z"
  },
  {
    id: "prod-8",
    name: "سماعات KingTel TWS Pro اللاسلكية عازلة للضوضاء ANC",
    brand: "KingTel",
    category: "سماعات",
    price: 11000,
    cost: 7600,
    quantity: 22,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    description: "سماعة إيربودز برو الرائدة من كينج تل. نظام إلغاء الضوضاء الفعال ANC، وصوت ستيريو نقي Hi-Fi مع ميكروفونات رباعية لعزل الهواء أثناء المكالمات، وبطارية تكفي 32 ساعة مع الحافظة.",
    isActive: true,
    isFeatured: true,
    isNew: true,
    onSale: true,
    oldPrice: 13500,
    rating: 4.9,
    reviewsCount: 42,
    createdAt: "2026-03-12T15:00:00Z"
  },
  {
    id: "prod-9",
    name: "سماعات KingTel AirBuds 3 ستيريو مع بيس عميق",
    brand: "KingTel",
    category: "سماعات",
    price: 7500,
    cost: 4900,
    quantity: 30,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    description: "سماعات بلوتوث مريحة وخفيفة جداً في الأذن مع لمس ذكي للتحكم بالموسيقى والمكالمات. زمن استجابة منخفض للألعاب وبلوتوث 5.3 لأقصى استقرار اتصال.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.5,
    reviewsCount: 16,
    createdAt: "2026-02-18T10:00:00Z"
  },
  {
    id: "prod-10",
    name: "سماعات رقبة KingTel Neckband الرياضية بطارية 40 ساعة",
    brand: "KingTel",
    category: "سماعات",
    price: 6200,
    cost: 4100,
    quantity: 26,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "سماعة عنق مغناطيسية مرنة ومريحة تناسب الرياضيين وسائقي السيارات والعمل الطويل. بطارية ضخمة تصمد لأيام، مع صوت جهوري رنان ومقاومة للرطوبة والتعرق.",
    isActive: true,
    isFeatured: true,
    isNew: false,
    onSale: false,
    rating: 4.8,
    reviewsCount: 20,
    createdAt: "2026-02-28T13:00:00Z"
  },
  {
    id: "prod-11",
    name: "سماعات رقبة Temax Sport Bass المغناطيسية",
    brand: "Temax",
    category: "سماعات",
    price: 5800,
    cost: 3800,
    quantity: 19,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "سماعة رقبة أنيقة من تيماكس بخامات ناعمة ومغناطيس ذكي للإيقاف المؤقت التلقائي. شحن سريع عبر Type-C وصوت نقي جداً للمكالمات الواضحة.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: true,
    oldPrice: 6500,
    rating: 4.6,
    reviewsCount: 11,
    createdAt: "2026-01-30T14:00:00Z"
  },
  {
    id: "prod-12",
    name: "واقي شاشة Lens Shield نانو 9H زجاجي مقاوم للكسر والخدوش",
    brand: "Lens Shield",
    category: "حماية شاشة",
    price: 1800,
    cost: 850,
    quantity: 80,
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "حماية شاشة زجاجية يابانية متطورة صلابة 9H مع حواف منحنية ثلاثية الأبعاد 3D. وضوح كريستالي 99.9% وطبقة مقاومة لبصمات الأصابع والزيوت.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.9,
    reviewsCount: 35,
    createdAt: "2026-03-01T09:00:00Z"
  },
  {
    id: "prod-13",
    name: "واقي عدسات الكاميرا Lens Shield Sapphire حماية كريستالية",
    brand: "Lens Shield",
    category: "حماية شاشة",
    price: 1500,
    cost: 650,
    quantity: 70,
    images: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "حلقات حماية معدنية مع زجاج ياقوتي لكاميرات الهواتف الذكية. تمنع الخدوش والصدمات دون التأثير إطلاقاً على جودة التصوير الليلي أو الفلاش.",
    isActive: true,
    isFeatured: false,
    isNew: true,
    onSale: false,
    rating: 4.8,
    reviewsCount: 28,
    createdAt: "2026-03-09T17:00:00Z"
  },
  {
    id: "prod-14",
    name: "حامل جوال مغناطيسي للسيارة Baseus دوران 360 درجة",
    brand: "Baseus",
    category: "إكسسوارات",
    price: 3500,
    cost: 2100,
    quantity: 32,
    images: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "ستاند سيارة مغناطيسي بقوة جذب عالية حتى في أصعب الطرق الوعرة. رأس كروي يتيح التدوير بزاوية 360 درجة وتركيب سهل على فتحات المكيف أو الطبلون.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: true,
    oldPrice: 4200,
    rating: 4.7,
    reviewsCount: 19,
    createdAt: "2026-02-12T11:00:00Z"
  },
  {
    id: "prod-15",
    name: "حامل جوال مكتبي ميكانيكي من الألومنيوم الفاخر",
    brand: "WAKNOVA Luxury",
    category: "إكسسوارات",
    price: 4200,
    cost: 2500,
    quantity: 25,
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80"
    ],
    description: "قاعدة مكتبية مصنوعة من سبائك الألومنيوم المستخدمة في الطيران. قابلة للطي وضبط الارتفاع والزاوية لمشاهدة الفيديوهات ومكالمات الفيديو والمذاكرة بثبات مطلق.",
    isActive: true,
    isFeatured: true,
    isNew: true,
    onSale: false,
    rating: 5.0,
    reviewsCount: 14,
    createdAt: "2026-03-14T11:00:00Z"
  },
  {
    id: "prod-16",
    name: "شاحن سيارة معدني Temax 45W ثنائي المنافذ مع إضاءة LED",
    brand: "Temax",
    category: "شواحن",
    price: 4900,
    cost: 3200,
    quantity: 29,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "شاحن ولاعة سيارة معدني أنيق بقوة 45 واط. يشحن الهاتفين بسرعة فائقة في وقت واحد مع حلقة ضوء LED زرقاء فاخرة لسهولة الاستخدام ليلاً.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.8,
    reviewsCount: 13,
    createdAt: "2026-02-22T08:00:00Z"
  },
  {
    id: "prod-17",
    name: "شاحن سيارة Ronin 60W التوربيني Super Fast",
    brand: "Ronin",
    category: "شواحن",
    price: 5900,
    cost: 3900,
    quantity: 20,
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "شاحن رونين التوربيني للسيارات بقدرة 60 واط مع منفذي Type-C وUSB تدعم تقنيات الشحن التكيفي الذكي للهواتف الرائدة.",
    isActive: true,
    isFeatured: false,
    isNew: true,
    onSale: false,
    rating: 4.9,
    reviewsCount: 9,
    createdAt: "2026-03-11T13:00:00Z"
  },
  {
    id: "prod-18",
    name: "وصلة محول Type-C إلى AUX 3.5mm DAC صوت نقي عالي الدقة",
    brand: "Ronin",
    category: "إكسسوارات",
    price: 2200,
    cost: 1100,
    quantity: 40,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    description: "محول صوتي مزود بشريحة معالجة DAC احترافية لنقل الصوت دون أي تشويش أو ضياع للترددات. متوافق مع آيباد وسامسونج وآيفون 15/16.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.7,
    reviewsCount: 17,
    createdAt: "2026-02-05T12:00:00Z"
  },
  {
    id: "prod-19",
    name: "ستاند شاحن لاسلكي 3 في 1 فاخر للهاتف والساعة والسماعة",
    brand: "WAKNOVA Luxury",
    category: "شواحن",
    price: 16500,
    cost: 11500,
    quantity: 14,
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80"
    ],
    description: "منصة شحن لاسلكية مكتبية راقية تشحن هاتفك الذكي وساعتك وسماعاتك معاً. تصميم ذهبي وأسود فاخر يلائم المكاتب وغرف النوم مع شريحة حماية من التيارات المفاجئة.",
    isActive: true,
    isFeatured: true,
    isNew: true,
    onSale: true,
    oldPrice: 19000,
    rating: 5.0,
    reviewsCount: 27,
    createdAt: "2026-03-15T16:00:00Z"
  },
  {
    id: "prod-20",
    name: "حلقة مغناطيسية MagSafe فاخرة مع مسند معدني دوار",
    brand: "Temax",
    category: "إكسسوارات",
    price: 2500,
    cost: 1300,
    quantity: 55,
    images: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "حلقة تثبيت مغناطيسية رقيقة ومتينة تلصق خلف الغطاء لتدعم تقنية الماج سيف وشواحن السيارات والستاندات، مع حلقة أصبع مريحة ومسند أفقي وعمودي.",
    isActive: true,
    isFeatured: false,
    isNew: false,
    onSale: false,
    rating: 4.6,
    reviewsCount: 21,
    createdAt: "2026-02-14T09:00:00Z"
  }
];

export const initialCustomers: Customer[] = [
  { id: "cust-1", name: "محمد أحمد الكبسي", phone: "771234567", governorate: "صنعاء", totalSpent: 42000, ordersCount: 3, points: 420, createdAt: "2026-01-10T08:00:00Z" },
  { id: "cust-2", name: "صالح علي باوزير", phone: "777890123", governorate: "حضرموت", totalSpent: 68500, ordersCount: 4, points: 685, createdAt: "2026-01-15T11:00:00Z" },
  { id: "cust-3", name: "فؤاد عبدالله اليافعي", phone: "733456789", governorate: "عدن", totalSpent: 35000, ordersCount: 2, points: 350, createdAt: "2026-02-01T14:00:00Z" },
  { id: "cust-4", name: "مازن عبدالكريم الحكيمي", phone: "711987654", governorate: "تعز", totalSpent: 19500, ordersCount: 1, points: 195, createdAt: "2026-02-12T10:00:00Z" },
  { id: "cust-5", name: "أروى نبيل الشامي", phone: "774321654", governorate: "إب", totalSpent: 28000, ordersCount: 2, points: 280, createdAt: "2026-02-20T16:00:00Z" },
  { id: "cust-6", name: "هيثم محمد الآنسي", phone: "775678901", governorate: "ذمار", totalSpent: 14500, ordersCount: 1, points: 145, createdAt: "2026-03-01T09:00:00Z" },
  { id: "cust-7", name: "جمال سيف المراني", phone: "738765432", governorate: "صنعاء", totalSpent: 51000, ordersCount: 3, points: 510, createdAt: "2026-03-04T12:00:00Z" },
  { id: "cust-8", name: "حسين علي القحطاني", phone: "712345678", governorate: "مأرب", totalSpent: 48000, ordersCount: 2, points: 480, createdAt: "2026-03-07T15:00:00Z" },
  { id: "cust-9", name: "طارق منصور النهاري", phone: "770112233", governorate: "الحديدة", totalSpent: 22000, ordersCount: 1, points: 220, createdAt: "2026-03-10T17:00:00Z" },
  { id: "cust-10", name: "خالد وليد العريقي", phone: "779988776", governorate: "تعز", totalSpent: 31500, ordersCount: 2, points: 315, createdAt: "2026-03-12T13:00:00Z" }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-901",
    customerName: "محمد أحمد الكبسي",
    phone: "771234567",
    governorate: "صنعاء",
    address: "حدة - شارع بيروت جوار بنك اليمن الدولي",
    items: [
      { productId: "prod-2", name: "شاحن Temax 35W GaN التوربيني مزدوج Type-C", brand: "Temax", price: 7800, quantity: 1, image: "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-5", name: "كابل Ronin PD 100W قماش مصفح Type-C to Type-C 1.2M", brand: "Ronin", price: 3200, quantity: 2, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 14200,
    subtotal: 14200,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🔴 عاجل جدًا",
    status: "جديدة",
    notes: "ضروري التوصيل اليوم قبل الساعة 4 عصراً لأني مسافر.",
    createdAt: "2026-03-15T09:30:00Z"
  },
  {
    id: "ORD-902",
    customerName: "صالح علي باوزير",
    phone: "777890123",
    governorate: "حضرموت",
    address: "المكلا - الديس جوار بريد المكلا العام",
    items: [
      { productId: "prod-4", name: "بطارية سفري Temax 30000mAh العملاقة 65W للابتوب والهواتف", brand: "Temax", price: 24000, quantity: 1, image: "https://images.unsplash.com/photo-1619472363539-786d790445d4?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 24000,
    subtotal: 24000,
    discount: 0,
    paymentMethod: "ون كاش (OneCash)",
    paymentStatus: "بانتظار التحقق",
    priority: "🟠 مهم",
    status: "قيد التجهيز",
    notes: "يرجى الشحن عبر فرع شركة النسر للشحن أو الرويشان.",
    createdAt: "2026-03-14T14:20:00Z"
  },
  {
    id: "ORD-903",
    customerName: "فؤاد عبدالله اليافعي",
    phone: "733456789",
    governorate: "عدن",
    address: "المنصورة - ريمي خلف مستشفى النقيب",
    items: [
      { productId: "prod-8", name: "سماعات KingTel TWS Pro اللاسلكية عازلة للضوضاء ANC", brand: "KingTel", price: 11000, quantity: 1, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-12", name: "واقي شاشة Lens Shield نانو 9H زجاجي مقاوم للكسر والخدوش", brand: "Lens Shield", price: 1800, quantity: 1, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 12800,
    subtotal: 12800,
    discount: 0,
    paymentMethod: "جيب (Jeeb)",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم الشحن",
    notes: "رقم السند تم إرساله على الواتساب.",
    createdAt: "2026-03-13T11:15:00Z"
  },
  {
    id: "ORD-904",
    customerName: "مازن عبدالكريم الحكيمي",
    phone: "711987654",
    governorate: "تعز",
    address: "شارع جمال - عمارة الشيباني الدور الثاني",
    items: [
      { productId: "prod-3", name: "بطارية سفري Temax 20000mAh شحن فائق مع شاشة رقمية LED", brand: "Temax", price: 13500, quantity: 1, image: "https://images.unsplash.com/photo-1609592426867-0c7f1a30f3c5?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 13500,
    subtotal: 13500,
    discount: 0,
    paymentMethod: "الدفع عند الاستلام",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم التسليم",
    notes: "تم الاستلام بنجاح، شكراً لكم.",
    createdAt: "2026-03-11T16:00:00Z"
  },
  {
    id: "ORD-905",
    customerName: "أروى نبيل الشامي",
    phone: "774321654",
    governorate: "إب",
    address: "الدائري الغربي - بالقرب من جامعة إب",
    items: [
      { productId: "prod-19", name: "ستاند شاحن لاسلكي 3 في 1 فاخر للهاتف والساعة والسماعة", brand: "WAKNOVA Luxury", price: 16500, quantity: 1, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 16500,
    subtotal: 16500,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🔴 عاجل جدًا",
    status: "قيد التجهيز",
    notes: "طلب هدية تخرج فاخرة يرجى تغليفها بأناقة.",
    createdAt: "2026-03-15T08:10:00Z"
  },
  {
    id: "ORD-906",
    customerName: "هيثم محمد الآنسي",
    phone: "775678901",
    governorate: "ذمار",
    address: "شارع رداع - جوار مكتب البريد",
    items: [
      { productId: "prod-10", name: "سماعات رقبة KingTel Neckband الرياضية بطارية 40 ساعة", brand: "KingTel", price: 6200, quantity: 1, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 6200,
    subtotal: 6200,
    discount: 0,
    paymentMethod: "الدفع عند الاستلام",
    paymentStatus: "بانتظار التحقق",
    priority: "🟡 عادي",
    status: "جديدة",
    notes: "الاتصال بي قبل الخروج للتوصيل.",
    createdAt: "2026-03-15T10:45:00Z"
  },
  {
    id: "ORD-907",
    customerName: "جمال سيف المراني",
    phone: "738765432",
    governorate: "صنعاء",
    address: "الأصبحي - شارع المقالح",
    items: [
      { productId: "prod-1", name: "شاحن Temax 24W السريع بمنفذين USB + Type-C", brand: "Temax", price: 4500, quantity: 2, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-6", name: "كابل Ronin Fast Charge 3A معدني Lightning للآيفون", brand: "Ronin", price: 2800, quantity: 2, image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 14600,
    subtotal: 14600,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم التسليم",
    notes: "",
    createdAt: "2026-03-10T13:20:00Z"
  },
  {
    id: "ORD-908",
    customerName: "حسين علي القحطاني",
    phone: "712345678",
    governorate: "مأرب",
    address: "المجمع - حي السلام شارع الروضة",
    items: [
      { productId: "prod-16", name: "شاحن سيارة معدني Temax 45W ثنائي المنافذ مع إضاءة LED", brand: "Temax", price: 4900, quantity: 1, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-14", name: "حامل جوال مغناطيسي للسيارة Baseus دوران 360 درجة", brand: "Baseus", price: 3500, quantity: 1, image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 8400,
    subtotal: 8400,
    discount: 0,
    paymentMethod: "ون كاش (OneCash)",
    paymentStatus: "تم التحقق",
    priority: "🟠 مهم",
    status: "تم الشحن",
    notes: "ارسلوا رقم بوليصة الشحن على رسالة نصية.",
    createdAt: "2026-03-12T18:00:00Z"
  },
  {
    id: "ORD-909",
    customerName: "طارق منصور النهاري",
    phone: "770112233",
    governorate: "الحديدة",
    address: "شارع صنعاء - خلف فندق القصر",
    items: [
      { productId: "prod-3", name: "بطارية سفري Temax 20000mAh شحن فائق مع شاشة رقمية LED", brand: "Temax", price: 13500, quantity: 1, image: "https://images.unsplash.com/photo-1609592426867-0c7f1a30f3c5?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 13500,
    subtotal: 13500,
    discount: 0,
    paymentMethod: "جيب (Jeeb)",
    paymentStatus: "ملغي",
    priority: "🟢 مؤجل",
    status: "ملغاة",
    notes: "طلب الإلغاء بسبب تغير نوع الجوال.",
    createdAt: "2026-03-08T11:00:00Z"
  },
  {
    id: "ORD-910",
    customerName: "خالد وليد العريقي",
    phone: "779988776",
    governorate: "تعز",
    address: "المسبح - جوار مدرسة زيد الموشكي",
    items: [
      { productId: "prod-15", name: "حامل جوال مكتبي ميكانيكي من الألومنيوم الفاخر", brand: "WAKNOVA Luxury", price: 4200, quantity: 1, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-18", name: "وصلة محول Type-C إلى AUX 3.5mm DAC صوت نقي عالي الدقة", brand: "Ronin", price: 2200, quantity: 1, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 6400,
    subtotal: 6400,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم التسليم",
    notes: "منتجات أصلية وممتازة بارك الله لكم.",
    createdAt: "2026-03-09T15:30:00Z"
  },
  {
    id: "ORD-911",
    customerName: "محمد أحمد الكبسي",
    phone: "771234567",
    governorate: "صنعاء",
    address: "حدة - شارع بيروت",
    items: [
      { productId: "prod-8", name: "سماعات KingTel TWS Pro اللاسلكية عازلة للضوضاء ANC", brand: "KingTel", price: 11000, quantity: 1, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 11000,
    subtotal: 11000,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم التسليم",
    notes: "",
    createdAt: "2026-02-25T14:00:00Z"
  },
  {
    id: "ORD-912",
    customerName: "صالح علي باوزير",
    phone: "777890123",
    governorate: "حضرموت",
    address: "المكلا",
    items: [
      { productId: "prod-2", name: "شاحن Temax 35W GaN التوربيني مزدوج Type-C", brand: "Temax", price: 7800, quantity: 2, image: "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 15600,
    subtotal: 15600,
    discount: 0,
    paymentMethod: "ون كاش (OneCash)",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "تم التسليم",
    notes: "",
    createdAt: "2026-02-20T10:00:00Z"
  },
  {
    id: "ORD-913",
    customerName: "عبدالرحمن سعيد المطري",
    phone: "772233445",
    governorate: "صنعاء",
    address: "الستين الشمالي - جوار جولة مذبح",
    items: [
      { productId: "prod-3", name: "بطارية سفري Temax 20000mAh شحن فائق مع شاشة رقمية LED", brand: "Temax", price: 13500, quantity: 1, image: "https://images.unsplash.com/photo-1609592426867-0c7f1a30f3c5?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-7", name: "كابل Ronin 3-in-1 متعدد المنافذ (Type-C / Lightning / Micro)", brand: "Ronin", price: 3600, quantity: 1, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 17100,
    subtotal: 17100,
    discount: 0,
    paymentMethod: "الدفع عند الاستلام",
    paymentStatus: "بانتظار التحقق",
    priority: "🔴 عاجل جدًا",
    status: "جديدة",
    notes: "مستعجل جداً أرجو التواصل فوراً.",
    createdAt: "2026-03-15T11:00:00Z"
  },
  {
    id: "ORD-914",
    customerName: "ياسر قاسم الهمداني",
    phone: "776655443",
    governorate: "صنعاء",
    address: "شارع بغداد - أمام مدرسة أروى",
    items: [
      { productId: "prod-13", name: "واقي عدسات الكاميرا Lens Shield Sapphire حماية كريستالية", brand: "Lens Shield", price: 1500, quantity: 2, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80" },
      { productId: "prod-20", name: "حلقة مغناطيسية MagSafe فاخرة مع مسند معدني دوار", brand: "Temax", price: 2500, quantity: 1, image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 5500,
    subtotal: 5500,
    discount: 0,
    paymentMethod: "جيب (Jeeb)",
    paymentStatus: "تم التحقق",
    priority: "🟡 عادي",
    status: "قيد التجهيز",
    notes: "",
    createdAt: "2026-03-14T20:15:00Z"
  },
  {
    id: "ORD-915",
    customerName: "بلال عبدربه الصبري",
    phone: "735544332",
    governorate: "إب",
    address: "شارع العدين - برج المختار",
    items: [
      { productId: "prod-17", name: "شاحن سيارة Ronin 60W التوربيني Super Fast", brand: "Ronin", price: 5900, quantity: 1, image: "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80" }
    ],
    total: 5900,
    subtotal: 5900,
    discount: 0,
    paymentMethod: "الكريمي المميز",
    paymentStatus: "تم التحقق",
    priority: "🟠 مهم",
    status: "تم الشحن",
    notes: "شحن عبر مكتب البراق للنقليات بإب.",
    createdAt: "2026-03-13T09:00:00Z"
  }
];

export const initialSpecialOrders: SpecialOrder[] = [
  {
    id: "sp-1",
    productName: "شاحن Apple MagSafe Duo الأصلي المزدوج القابل للطي",
    quantity: 1,
    neededBy: "هذا الأسبوع",
    notes: "أبحث عن الشاحن الأصلي من وكيل أبل بالكرتونة والضمان.",
    phone: "771234567",
    status: "تم توفيره",
    adminReply: "تم توفير القطعة الأصلية بفضل الله بسعر 38,000 ريال مع ضمان أبل، تواصل معنا لاستلامها.",
    estimatedPrice: 38000,
    createdAt: "2026-03-12T10:00:00Z"
  },
  {
    id: "sp-2",
    productName: "قلم S-Pen الأصلي لجهاز Samsung Galaxy S24 Ultra لون أسود تيتانيوم",
    quantity: 2,
    neededBy: "اليوم",
    notes: "مستعجل جداً ضاع القلم الأصلي للجهاز.",
    phone: "777890123",
    status: "جاري البحث",
    adminReply: "جاري الفحص مع مستودع الوكلاء بصنعاء وسنرد عليك اليوم عبر واتساب بإذن الله.",
    createdAt: "2026-03-15T08:30:00Z"
  },
  {
    id: "sp-3",
    productName: "بطارية Anker Prime 27650mAh Power Bank (250W)",
    quantity: 1,
    neededBy: "تاريخ محدد: 20 مارس",
    notes: "أحتاجها للابتوب أعمال خارجي.",
    phone: "733456789",
    status: "بانتظار الرد",
    adminReply: "",
    createdAt: "2026-03-14T17:00:00Z"
  },
  {
    id: "sp-4",
    productName: "سماعات Sony WH-1000XM5 Wireless Noise Canceling باللون الفضي",
    quantity: 1,
    neededBy: "هذا الأسبوع",
    notes: "أريد النسخة العالمية الأصلية.",
    phone: "774321654",
    status: "بانتظار الرد",
    adminReply: "",
    createdAt: "2026-03-15T11:20:00Z"
  },
  {
    id: "sp-5",
    productName: "شاشة أصلية كاملة مع الفريم لجهاز Xiaomi 13 Pro AMOLED",
    quantity: 1,
    neededBy: "اليوم",
    notes: "أصلية وكالة فقط خلع جهاز أو شاشة وكيل.",
    phone: "711987654",
    status: "غير متوفر",
    adminReply: "نعتذر منك حالياً غير متوفرة في السوق المحلي وسنبلغك فور توفر دفعة جديدة.",
    createdAt: "2026-03-10T14:00:00Z"
  }
];

export const initialMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "maint-1",
    customerName: "زياد ناصر العنسي",
    phone: "770998877",
    deviceModel: "iPhone 14 Pro Max",
    issue: "منفذ الشحن لا يستجيب ويحتاج تنظيف أو تغيير فلاتة شحن أصلية.",
    status: "جاهز للاستلام",
    receivedAt: "2026-03-13T10:00:00Z",
    deliveredAt: "2026-03-15T12:00:00Z",
    cost: 5000,
    notes: "تم تغيير الفلاتة الأصلية وفحص سرعة الشحن بنجاح."
  },
  {
    id: "maint-2",
    customerName: "عبدالملك سعيد البركاني",
    phone: "773322110",
    deviceModel: "Samsung Galaxy S23 Ultra",
    issue: "كسر في الزجاج الخارجي لعدسات الكاميرا الخلفية مع بقاء الحساسات سليمة.",
    status: "جاري الإصلاح",
    receivedAt: "2026-03-14T15:30:00Z",
    cost: 4500,
    notes: "تم تجهيز عدسات Lens Shield الياقوتية الأصلية للتركيب."
  },
  {
    id: "maint-3",
    customerName: "رامي فضل الصوفي",
    phone: "739988776",
    deviceModel: "iPad Air 5th Gen (M1)",
    issue: "البطارية تفرغ بسرعة وتهبط فجأة من 40% إلى الصفر.",
    status: "قيد الفحص",
    receivedAt: "2026-03-15T09:15:00Z",
    notes: "قيد الفحص بجهاز التيستر لاختبار صحة الخلايا الداخلية."
  },
  {
    id: "maint-4",
    customerName: "أشرف قاسم الوادعي",
    phone: "714455667",
    deviceModel: "Redmi Note 12 Pro",
    issue: "صوت سماعة الأذن ضعيف جداً ومكتوم أثناء المكالمات.",
    status: "تم التسليم",
    receivedAt: "2026-03-11T11:00:00Z",
    deliveredAt: "2026-03-11T16:00:00Z",
    cost: 2000,
    notes: "تم تنظيف الشبكة الصوتية بالموجات الصوتية واستعادة 100% من النقاء."
  }
];

export const initialReviews: Review[] = [
  { id: "rev-1", productId: "prod-1", customerName: "أبو صقر السنحاني", rating: 5, comment: "شاحن ممتاز جداً شحن لي الآيفون بسرعة خيالية وبدون أي سخونة، خامات تيماكس ما عليها كلام.", createdAt: "2026-03-05T12:00:00Z" },
  { id: "rev-2", productId: "prod-2", customerName: "معاذ الحزمي", rating: 5, comment: "أفضل رأس GaN جربته في اليمن، يشحن جهازيين بنفس الوقت بكفاءة عالية، شكراً لوكالة WAKNOVA.", createdAt: "2026-03-12T14:30:00Z" },
  { id: "rev-3", productId: "prod-3", customerName: "عادل باحارثة", rating: 5, comment: "بطارية عملاقة حقيقية والشاشة الرقمية تعطي النسبة بالضبط، خدمتني بالسفر خدمة العمر.", createdAt: "2026-02-28T09:15:00Z" },
  { id: "rev-4", productId: "prod-8", customerName: "فارس الأثوري", rating: 5, comment: "سماعات كينج تل برو العزل فيها بطل والمايك واضح جداً في المكالمات بالسيارة والشوارع.", createdAt: "2026-03-14T18:20:00Z" },
  { id: "rev-5", productId: "prod-12", customerName: "مطيع المخلافي", rating: 5, comment: "حماية الشاشة ناعمة جداً في اللمس ومقاومة للبصمات، وسعرها ممتاز مقارنة بجودتها.", createdAt: "2026-03-08T16:45:00Z" }
];
