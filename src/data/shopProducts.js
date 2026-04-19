/**
 * Shared shop products data for Shop listing and ShopProduct detail page.
 * Each product can have multiple images (images[0] is main/thumbnail).
 */
export const PRODUCT_CATEGORIES = [
  { id: "all", i18nKey: "shopAll", fallback: "كل المنتجات" },
  { id: "print", i18nKey: "shopPrintBooks", fallback: "كتب ورقية" },
  { id: "digital", i18nKey: "shopDigitalBooks", fallback: "كتب رقمية (PDF)" },
  { id: "tools", i18nKey: "shopTools", fallback: "أدوات وموارد" },
];

export const PRODUCTS = [
  {
    id: "civil-procedure-guide",
    category: "print",
    titleKey: "shopProductCivilTitle",
    titleFallback: "دليل الإجراءات المدنية في الجزائر",
    descKey: "shopProductCivilDesc",
    descFallback:
      "كتاب عملي يشرح أهم مراحل وإجراءات التقاضي أمام المحاكم الجزائرية بأسلوب مبسط وخطوات واضحة.",
    longDescKey: "shopProductCivilLongDesc",
    longDescFallback:
      "هذا الدليل يقدّم لك شرحًا منظّمًا لجميع مراحل الدعوى المدنية في الجزائر، من رفع الدعوى حتى التنفيذ. يتضمن أمثلة عملية ونماذج جاهزة لمساعدة المحامين والمتدربين وأي شخص يريد فهم الإجراءات المدنية. تمت مراجعته من طرف فريق SOS Law لضمان مطابقته للتشريع المعمول به.",
    price: "3,500 دج",
    meta: ["320 صفحة", "لغة: العربية", "مستوى: ممارس"],
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "contracts-templates-pack",
    category: "digital",
    titleKey: "shopProductContractsTitle",
    titleFallback: "باقة نماذج العقود الأساسية",
    descKey: "shopProductContractsDesc",
    descFallback:
      "مجموعة نماذج عقود جاهزة (عمل، كراء، شراكة وغيرها) قابلة للتعديل بصيغة Word وPDF.",
    longDescKey: "shopProductContractsLongDesc",
    longDescFallback:
      "تشمل الباقة أكثر من 15 نموذج عقد مصاغًا وفق القانون الجزائري وقابلًا للتعديل: عقود العمل، الإيجار، الشراكة، البيع، والخدمات. كل نموذج مرفق بملاحظات توجيهية لاستخدامه بشكل صحيح. مناسبة للمحامين، رواد الأعمال، والإدارات.",
    price: "2,200 دج",
    meta: ["15 نموذجًا", "صيغة: PDF + Word", "تحميل فوري"],
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "startup-legal-checklist",
    category: "digital",
    titleKey: "shopProductStartupTitle",
    titleFallback: "دليل قانوني للمؤسسات الناشئة",
    descKey: "shopProductStartupDesc",
    descFallback:
      "قائمة تحقق عملية تغطي أهم الجوانب القانونية التي يحتاجها رائد الأعمال عند إنشاء مشروعه.",
    longDescKey: "shopProductStartupLongDesc",
    longDescFallback:
      "دليل مختصر يوضح الخطوات القانونية الأساسية لتأسيس وإدارة المؤسسة الناشئة في الجزائر: اختيار الشكل القانوني، التسجيل، العقود الأساسية، الملكية الفكرية، والامتثال الضريبي. مصمم لرواد الأعمال غير القانونيين مع لغة مبسطة ونصائح عملية.",
    price: "1,800 دج",
    meta: ["40 صفحة", "لغة: العربية", "مستوى: مبتدئ–متوسط"],
    image:
      "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "family-law-guide",
    category: "print",
    titleKey: "shopProductFamilyTitle",
    titleFallback: "مرشد مبسط في قانون الأسرة",
    descKey: "shopProductFamilyDesc",
    descFallback:
      "شرح مبسط لأهم أحكام قانون الأسرة الجزائري مع أمثلة عملية وأسئلة شائعة.",
    longDescKey: "shopProductFamilyLongDesc",
    longDescFallback:
      "مرشد موجه للجمهور العام والمهنيين يشرح أحكام قانون الأسرة الجزائري في الزواج، الطلاق، النفقة، الحضانة، والإرث. يتضمن أسئلة شائعة وإجابات واضحة ونماذج مفيدة. يساعدك على فهم حقوقك وواجباتك دون تعقيد.",
    price: "2,900 دج",
    meta: ["250 صفحة", "لغة: العربية", "مستوى: عام"],
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "legal-writing-kit",
    category: "tools",
    titleKey: "shopProductWritingTitle",
    titleFallback: "حقيبة الصياغة القانونية",
    descKey: "shopProductWritingDesc",
    descFallback:
      "قوالب ورسائل جاهزة تساعدك على صياغة المراسلات القانونية بطريقة احترافية وواضحة.",
    longDescKey: "shopProductWritingLongDesc",
    longDescFallback:
      "مجموعة قوالب لرسائل إنذار، شكاوى، مذكرات، ومراسلات إدارية وقضائية، مع تعليمات استخدام لكل نموذج. مناسبة للمحامين والمؤسسات والأفراد الذين يحتاجون إلى صياغة قانونية سليمة دون الحاجة دائمًا إلى استشارة مسبقة.",
    price: "2,000 دج",
    meta: ["ملفات رقمية", "تحديثات مستقبلية", "تحميل فوري"],
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&auto=format&fit=crop&q=80",
    ],
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
