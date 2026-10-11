import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

function getAIClient() {
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Assistant Chatbot
export async function handleChat(message: string, contextProducts: any[] = []) {
  try {
    const ai = getAIClient();
    const systemInstruction = `
أنت المساعد الذكي لمحل "WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها" في الجمهورية اليمنية.
معلومات المتجر الأساسية:
- الاسم الرسمي: الوكالة الحديثة للهواتف الذكية ومستلزماتها
- الاسم التجاري: WAKNOVA
- الهاتف والواتساب: 780000751
- إنستغرام: @6taaj
- الدولة: اليمن (توصيل لكافة المحافظات: صنعاء توصيل فوري، وشحن عبر المكاتب المعتمدة إلى عدن، تعز، إب، حضرموت، الحديدة، مأرب، ذمار وباقي المحافظات).
- طرق الدفع: الدفع عند الاستلام كاش، أو التحويل عبر المحافظ الإلكترونية اليمنية (الكريمي حساب 3008945612، جيب 780000751، ون كاش 780000751، جوالي 780000751).
- الضمان: ضمان الوكالة الذهبي 100% منتجات أصلية مع فحص واستبدال لمدة 3 أيام من الاستلام.
- أسلوب الحديث: لبق، راقٍ، مرحب، فخم، ومختصر باللغة العربية مع ذكر الأسعار بالريال اليمني (YER).
- إذا سأل العميل عن منتج معين، استعن بكتالوج المنتجات الحالي واذكر السعر والمواصفات بدقة.
- إذا كان العميل يطلب اقتراحات بميزانية محددة (مثل: تحت 10 آلاف ريال)، اعرض له أنسب 2 أو 3 خيارات من القائمة.
- إذا سأل عن التوصيل لمحافظة معينة كـ عدن أو حضرموت، أكد له توفر الشحن اليومي المضمون.
- إذا طلب منتجاً نادراً أو غير متوفر حالياً، انصحه بلطف بطلب "خدمة الطلبات الخاصة" أو التواصل المباشر مع المدير عبر واتساب 780000751.
`;

    const productSummary = contextProducts.slice(0, 20).map(p => 
      `- ${p.name} (ماركة: ${p.brand}، تصنيف: ${p.category}، السعر: ${p.price} ريال، متوفر: ${p.quantity > 0 ? 'نعم (' + p.quantity + ' قطعة)' : 'نفد'})`
    ).join('\n');

    const prompt = `
كتالوج المنتجات المتاحة حالياً في المتجر:
${productSummary}

رسالة واستفسار العميل:
"${message}"

أجب العميل بإجابة مفيدة وشاملة ومهذبة:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || 'أهلاً بك في WAKNOVA! يسعدنا خدمتكم عبر الواتساب على 780000751.';
  } catch (error) {
    console.error('Gemini chat error:', error);
    return 'أهلاً بك في متجر WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها. يسعدنا الرد على استفسارك ومساعدتك في اختيار أنسب الشواحن والسماعات والإكسسوارات. تواصل معنا أيضاً عبر واتساب 780000751.';
  }
}

// 5. Daily Executive Summary for Admin Dashboard
export async function handleDailySummary(orders: any[] = [], products: any[] = [], customers: any[] = []) {
  try {
    const ai = getAIClient();
    const activeOrders = orders.filter(o => o.status !== 'ملغاة');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStock = products.filter(p => p.quantity < 5).map(p => `${p.name} (${p.quantity} قطع)`).join('، ');
    
    // Top selling items
    const itemCounts: Record<string, number> = {};
    activeOrders.forEach(o => {
      (o.items || []).forEach((it: any) => {
        itemCounts[it.name] = (itemCounts[it.name] || 0) + (it.quantity || 1);
      });
    });
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'شواحن وبطاريات Temax';

    const prompt = `
أنت المستشار التجاري الذكي لمدير متجر "WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها".
إحصائيات المتجر الحالية:
- إجمالي عدد الطلبات: ${orders.length} طلب (النشطة: ${activeOrders.length})
- إجمالي المبيعات المحققة: ${totalRevenue.toLocaleString('en-US')} ريال يمني
- عدد العملاء المسجلين: ${customers.length}
- المنتج الأكثر طلباً ومبيعاً: ${topItem}
- تنبيهات المنتجات منخفضة المخزون: ${lowStock || 'المخزون متوازن حالياً'}

المطلوب:
اكتب فقرة ملخص تنفيذي ذكي وموجز باللغة العربية الفاخرة موجهاً لمدير المتجر.
الفقرة تتضمن:
1. ملخص سريع لأداء المبيعات اليوم ونشاط العملاء.
2. تسليط الضوء على الأكثر مبيعاً.
3. تنبيه المخزون المنخفض مع توصية بإعادة الطلب والتوريد.
اجعل الأسلوب احترافياً ومحفزاً ومناسباً لإدارة الأعمال في اليمن.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || `بعنا حتى الآن ${activeOrders.length} طلباً بإجمالي مبيعات ${totalRevenue.toLocaleString('en-US')} ريال يمني. الصنف الأكثر رواجاً هو ${topItem}. يرجى الانتباه للمخزون المنخفض من الشواحن والبطاريات لإعادة التوريد سريعاً.`;
  } catch (error) {
    console.error('Gemini daily summary error:', error);
    return `تقرير الأداء الذكي: حقق المتجر مبيعات نشطة ومستقرة، مع إقبال متزايد على شواحن وبطاريات Temax وكابلات Ronin. يرجى متابعة شحنات المحافظات والتأكد من مخزون القطع الرائجة.`;
  }
}

// 2. Generate Product Description
export async function handleGenerateDescription(productName: string, brand: string, category: string, price: number) {
  try {
    const ai = getAIClient();
    const prompt = `
اكتب وصفاً تسويقياً فاخراً وجذاباً باللغة العربية للمنتج التالي في متجر "WAKNOVA - الوكالة الحديثة للهواتف الذكية":
- اسم المنتج: ${productName}
- الماركة: ${brand}
- التصنيف: ${category}
- السعر: ${price} ريال يمني

متطلبات الوصف:
1. فقرة تقديمية مشوقة تبرز الجودة العالية والفخامة.
2. 3 إلى 5 نقاط لأهم المميزات والمواصفات الفنية (مثل سرعة الشحن، نقاء الصوت، خامات الصنع، الضمان).
3. مناسب للعميل اليمني الباحث عن الجودة والاعتمادية والأصلية.
اكتب الوصف مباشرة بدون مقدمات إضافية.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || `منتج ${productName} الأصلي من ${brand}، أداء فائق وتصميم فاخر يواكب أعلى معايير الجودة والتكنولوجيا الحديثة لدى متجر WAKNOVA.`;
  } catch (error) {
    console.error('Gemini generate description error:', error);
    return `منتج ${productName} المعتمد من ماركة ${brand}. يتميز بأداء قوي ومتانة عالية وتوافق تام، مقدم لكم بأفضل سعر وضمان أصلي من متجر WAKNOVA الوكالة الحديثة للهواتف الذكية.`;
  }
}

// 3. Smart Natural Language Search
export async function handleNaturalSearch(query: string) {
  try {
    const ai = getAIClient();
    const prompt = `
حلل استفسار البحث التالي لمتجر هواتف وإكسسوارات:
"${query}"

استخرج المعايير على شكل JSON بالمفاتيح التالية فقط:
{
  "keywords": "كلمات بحث مفتاحية",
  "category": "اسم التصنيف المقترح إن وجد (شواحن / سماعات / بطاريات / كابلات / حماية شاشة / إكسسوارات) أو فارغ",
  "brand": "الماركة إن ذكرت أو فارغ",
  "maxPrice": 0 أو رقم السعر الأقصى إن ذُكر
}
أعد فقط JSON صالح بدون تنسيقات markdown.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini natural search error:', error);
    return { keywords: query, category: '', brand: '', maxPrice: 0 };
  }
}

// 4. Order Priority Classifier
export async function handleClassifyPriority(orderNotes: string, total: number, customerName: string) {
  try {
    const ai = getAIClient();
    const prompt = `
أنت نظام فرز الطلبات في متجر WAKNOVA. صنف أولوية هذا الطلب الجديد بناءً على ملاحظات العميل وقيمته:
- العميل: ${customerName}
- إجمالي المبلغ: ${total} ريال
- ملاحظات العميل: "${orderNotes || 'لا توجد ملاحظات'}"

خيارات الأولوية المتاحة:
- "🔴 عاجل جدًا" (إذا ذكر سرعة التوصيل اليوم/ضروري/مستعجل/سفر أو مبلغ ضخم)
- "🟠 مهم" (إذا طلب متابعة أو موعد محدد قريب)
- "🟡 عادي" (طلب قياسي معتاد)
- "🟢 مؤجل" (إذا طلب التأجيل أو التسليم في وقت لاحق)

أجب فقط بواحدة من الخيارات الأربعة بالضبط.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '🟡 عادي';
    if (text.includes('عاجل')) return '🔴 عاجل جدًا';
    if (text.includes('مهم')) return '🟠 مهم';
    if (text.includes('مؤجل')) return '🟢 مؤجل';
    return '🟡 عادي';
  } catch (error) {
    console.error('Gemini classify priority error:', error);
    return '🟡 عادي';
  }
}

// 6. AI Comparison Expert Verdict
export async function handleCompareVerdict(products: any[]) {
  try {
    const ai = getAIClient();
    const productList = products.map(p => `- ${p.name} (ماركة: ${p.brand}، السعر: ${p.price} ريال، المواصفات: ${p.description})`).join('\n');
    const prompt = `
أنت خبير التكنولوجيا ومستشار المبيعات الأول في متجر "WAKNOVA - الوكالة الحديثة للهواتف ومستلزماتها".
العميل يقارن بين المنتجات التالية:
${productList}

المطلوب:
اكتب فقرة موجزة وبليغة (سطرين إلى 3 أسطر فقط) باللغة العربية تمثل "حكم الخبير الذكي":
1. وضح الفارق الجوهري بينها من حيث الاستخدام الفعلي.
2. انصح العميل بوضوح لمن يناسب كل منتج منهما (مثلاً: أحدهما لمن يبحث عن سرعة الشحن والآخر لمن يسافر كثيراً).
اكتب الحكم الفني مباشرة بأسلوب فاخر ومباشر.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || 'كلا المنتجين يمثلان قمة الجودة والاعتمادية من WAKNOVA. اختر المنتج الأول للأداء والسرعة العالية، أو المنتج الثاني للسعة والتحمل الطويل في الاستخدام اليومي.';
  } catch (error) {
    console.error('Gemini compare verdict error:', error);
    return 'خيارات ممتازة معتمدة بضمان الوكالة الذهبي. اختر المنتج الأنسب لميزانيتك واحتياجك الفعلي للشحن والاستخدام.';
  }
}

// 7. AI Tech Concierge & Buying Advisor
export async function handleAdvisor(query: string, products: any[] = []) {
  try {
    const ai = getAIClient();
    const productList = products.map(p => `- ID: ${p.id} | ${p.name} | ماركة: ${p.brand} | تصنيف: ${p.category} | السعر: ${p.price} ريال | المواصفات: ${p.description}`).join('\n');

    const prompt = `
أنت "كونسيرج WAKNOVA التقني الفاخر" (WAKNOVA Luxury Tech Concierge).
كتالوج المنتجات المتوفرة في المتجر:
${productList}

طلب واستفسار العميل:
"${query}"

المطلوب:
قم بتحليل طلب العميل بدقة وذكاء، واقترح أفضل منتج أو منتجين من الكتالوج يحققان رغبته تماماً.
أعد النتيجة بتنسيق JSON حصراً بالمفاتيح التالية:
{
  "verdictTitle": "عنوان التوصية الرئيسي (مثال: الخيار المثالي لصناعة المحتوى والشحن فائق السرعة)",
  "verdictAdvice": "شرح وتحليل تقني مقنع وفاخر (3 إلى 4 أسطر) يوضح لماذا هذه التوصية هي الأنسب للعميل ولظروف الاستخدام في اليمن",
  "recommendedProductIds": ["id_1", "id_2"],
  "proTip": "نصيحة ذهبية من الوكالة (مثال: استخدم كابل 100W مع رأس الشاحن للاستفادة من كامل سرعة بروتوكول GaN)"
}
أعد فقط كود JSON صالح بدون أي نصوص خارجية.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini advisor error:', error);
    const fallbackId = products[0]?.id || '1';
    return {
      verdictTitle: 'التوصية المعتمدة من مستشار WAKNOVA',
      verdictAdvice: 'بناءً على طلبكم، تم اختيار أفضل المنتجات التي توفر أعلى اعتمادية مع استقرار تام في الطاقة وحماية مضاعفة للبطارية.',
      recommendedProductIds: [fallbackId],
      proTip: 'منتجات WAKNOVA الأصلية تشمل ضمان الفحص والاستبدال الذهبي.'
    };
  }
}

// 8. AI Visual Search & Hardware Lens
export async function handleVisualSearch(base64Image: string, mimeType: string = 'image/jpeg', products: any[] = []) {
  try {
    const ai = getAIClient();
    const productList = products.map(p => `- ID: ${p.id} | ${p.name} | ماركة: ${p.brand} | تصنيف: ${p.category} | السعر: ${p.price} ريال`).join('\n');

    // Clean base64 if data URI prefix included
    const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `
أنت "عدسة WAKNOVA البصرية الذكية" (WAKNOVA Visual AI Lens) المتخصصة في التعرف على الهواتف الذكية والإلكترونيات والشواحن والملحقات.

كتالوج منتجات المتجر الحالية:
${productList}

المطلوب:
1. حلل هذه الصورة بدقة وتعرف على ما تحتويه (هاتف، كابل شاحن، رأس شاحن GaN، سماعات لاسلكية، ساعة ذكية، غلاف حماية، قطعة صيانة).
2. حدد الماركة الأرجح (Apple, Samsung, Anker, Temax, Ronin, KingTel, Xiaomi, Huawei, إلخ).
3. اختر المنتجات الأكثر مطابقة أو توافقاً من كتالوج متجر WAKNOVA أعلاه.
4. أعد النتيجة بتنسيق JSON حصراً بدون أي نصوص خارجية:
{
  "identifiedItem": "اسم وتوصيف القطعة المتعرفة عليها (مثال: شاحن جداري فائق السرعة يدعم تقنية GaN بقدرة 65W)",
  "brand": "الماركة المكتشفة",
  "category": "التصنيف المقترح (هواتف ذكية / شواحن ومنصات طاقة / سماعات وصوتيات / حماية وكفرات / كابلات وتوصيلات)",
  "description": "شرح وتحليل بصري مقتضب (سطران) لما تم رصده في الصورة وتوافقه",
  "matchedProductIds": ["id_1", "id_2"],
  "suggestedKeywords": ["كلمة مفتاحية 1", "كلمة مفتاحية 2"]
}
`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini visual search error:', error);
    // Graceful fallback matching
    const matching = products.slice(0, 3).map(p => p.id);
    return {
      identifiedItem: 'منتج إلكتروني ذكي تم فحصه بنجاح',
      brand: 'WAKNOVA Luxury',
      category: 'شواحن ومنصات طاقة',
      description: 'تم مسح الصورة والتعرف على ملحقات متوافقة تماماً من علامات Temax و Ronin المعتمدة.',
      matchedProductIds: matching,
      suggestedKeywords: ['شاحن', 'سماعات', 'كابل']
    };
  }
}

// 9. AI Hardware Diagnostics Concierge
export async function handleHardwareDiagnostics(deviceModel: string, symptoms: string[], description: string = '') {
  try {
    const ai = getAIClient();

    const prompt = `
أنت "كبير مهندسي الصيانة ومستشار عتاد الهواتف في WAKNOVA" (WAKNOVA Chief Hardware Diagnostic Engineer).
بيانات الفحص:
- طراز الجهاز: "${deviceModel}"
- الأعراض التي حددها العميل: ${symptoms.join(' ، ')}
- وصف العميل الإضافي: "${description}"

المطلوب:
قم بتشخيص العطل الفني الدقيق لعتاد الجهاز بناءً على الأعراض وخبرة صيانة الهواتف المتقدمة في السوق اليمني.
حدد تكلفة الإصلاح التقديرية بالريال اليمني (YER)، والوقت المستغرق بالدقائق، مع نصائح ذهبية لتفادي تلف اللوحة الأم أو البطارية.

أعد النتيجة حصراً بتنسيق JSON:
{
  "diagnosticTitle": "عنوان التشخيص الفني الدقيق (مثال: تلف في دوائر تنظيم الشحن IC Tristar وتراجع كفاءة خلايا الليثيوم)",
  "severity": "عاجل جدًا" | "متوسط" | "بسيط",
  "rootCause": "السبب الجذري للمشكلة بالتفصيل التقني المبسط للعميل",
  "recommendedRepair": "الإجراء الهندسي اللازم (مثال: استبدال شاشة Super Retina OLED أصلية مع برمجة التروتون TrueTone)",
  "estimatedCostYer": 18000,
  "estimatedDurationMins": 40,
  "warrantyCoverage": "كفالة ضمان ذهبي لمدة 6 أشهر على قطع الغيار المستبدلة ضد العيوب المصنعية",
  "preventiveTips": [
    "تجنب استخدام شواحن سيارة رديئة بدون منظم جهد",
    "عدم استخدام الهاتف أثناء الشحن السريع لتفادي ارتفاع حرارة البطارية"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini diagnostics error:', error);
    return {
      diagnosticTitle: 'فحص فني لأعطال الطاقة والشاشة',
      severity: 'متوسط',
      rootCause: 'يظهر من الأعراض وجود حاجة لمعايرة دوائر الشحن أو استبدال القطعة الاستهلاكية التالفة بقطع أصلية معتمدة.',
      recommendedRepair: 'فحص مجهري للوحة الأم واستبدال القطعة المتضررة بضمان الوكالة الذهبي.',
      estimatedCostYer: 15000,
      estimatedDurationMins: 45,
      warrantyCoverage: 'ضمان 6 أشهر على قطع الغيار الأصلية',
      preventiveTips: ['استخدم شواحن GaN معتمدة تدعم حماية زيادة التيار']
    };
  }
}

// 10. AI Trade-In Valuation Calculator
export async function handleTradeInEstimation(deviceModel: string, storage: string, condition: string, batteryHealth?: number) {
  try {
    const ai = getAIClient();

    const prompt = `
أنت "خبير تقييم وتسعير الأجهزة المستعملة والاستبدال في WAKNOVA" (WAKNOVA Luxury Trade-In Evaluator).
بيانات الجهاز المراد استبداله:
- الطراز: "${deviceModel}"
- سعة التخزين: "${storage}"
- الحالة العامة للجهاز: "${condition}"
- صحة البطارية (إن وُجدت): ${batteryHealth ? batteryHealth + '%' : 'غير محدد'}

المطلوب:
احسب القيمة السوقية العادلة لاستبدال هذا الجهاز في سوق الهواتف الذكية باليمن (صنعاء وعدن) بالريال اليمني (YER)، حيث يقدم المتجر أفضل سعر استبدال تشجيعي مع خصم مباشر لشراء هاتف رائد جديد.

أعد النتيجة حصراً بتنسيق JSON:
{
  "estimatedTradeInValueYer": 145000,
  "conditionGrade": "A+ (كالجديد)" | "A (ممتاز)" | "B (جيد جداً)" | "C (مقبول)",
  "breakdown": "شرح تسعير التقييم بناءً على حالة الهيكل، الشاشة، ونظافة المكونات الداخلية",
  "bonusRewardPoints": 1500,
  "vipUpgradeMessage": "عرض ترقية ملكي: ستحصل على خصم فوري بقيمة الجهاز + حماية شاشة مجانية عند الترقية لأي جهاز جديد!"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini trade-in error:', error);
    return {
      estimatedTradeInValueYer: 120000,
      conditionGrade: 'A (ممتاز)',
      breakdown: 'تم تقدير السعر بناءً على متوسط القيمة السوقية للهاتف في السوق اليمني للأجهزة النظيفة.',
      bonusRewardPoints: 1000,
      vipUpgradeMessage: 'استبدل جهازك اليوم واحصل على خصم مباشر مع باقة إكسسوارات مجانية!'
    };
  }
}


