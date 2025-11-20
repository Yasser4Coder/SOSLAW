import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiFileText,
  FiCheck,
  FiMail,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";

const participationRoles = [
  "أستاذ باحث",
  "طالب جامعي",
  "مهني / صاحب مؤسسة ناشئة",
  "صاحب فكرة مشروع",
  "ممثل هيئة أو مؤسسة",
  "متطوع / عضو لجنة التنظيم",
  "إعلامي",
  "ممثل نادي جامعي",
  "صنف آخر (يرجى التوضيح)",
];

const participationTypes = [
  { value: "scientific", label: "مداخلة علمية (باحث / أستاذ / طالب)" },
  { value: "attendance", label: "حضور عام ومتابعة الجلسات" },
  { value: "partnership", label: "مساهمة أو شراكة مؤسساتية" },
  { value: "media", label: "تغطية إعلامية" },
  { value: "volunteer", label: "تطوع ومرافقة تنظيمية" },
  { value: "universityClub", label: "نادي جامعي" },
  { value: "exhibitor", label: "المشاركة في مسابقة أحسن عرض مشروع" },
];

const scientificTracks = [
  "الإطار القانوني لريادة الأعمال في الجزائر",
  "حماية الابتكار والملكية الفكرية",
  "العقود والشراكات في المؤسسات الناشئة",
  "التحديات القانونية في الواقع الميداني",
  "نحو اقتصاد المعرفة: تجارب وطنية في دعم الإبداع",
];

const partnershipOptions = [
  "دعم لوجستي / مادي",
  "مرافقة مؤسساتية / تدريبية",
  "مشاركة بخبراء أو محاضرين",
  "تغطية إعلامية",
  "أخرى (يرجى التوضيح)",
];

const awarenessOptions = [
  "عبر وسائل التواصل الاجتماعي",
  "عبر الجامعة أو الكلية",
  "من صديق أو زميل",
  "أخرى",
];

const NationalConferenceRegistration = () => {
  const [participationType, setParticipationType] = useState("");
  const [partnershipType, setPartnershipType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [role, setRole] = useState("");
  const [roleOtherDetail, setRoleOtherDetail] = useState("");
  const [awarenessSource, setAwarenessSource] = useState("");
  const [awarenessSourceOther, setAwarenessSourceOther] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scientificTrack, setScientificTrack] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!agreed) {
      setFormStatus({
        type: "error",
        message: "يرجى الموافقة على صحة المعلومات قبل الإرسال.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName")?.toString().trim(),
      role,
      roleOtherDetail: role === "صنف آخر (يرجى التوضيح)" ? roleOtherDetail.trim() : undefined,
      organization: formData.get("organization")?.toString().trim(),
      email: formData.get("email")?.toString().trim().toLowerCase(),
      phone: formData.get("phone")?.toString().trim(),
      wilaya: formData.get("wilaya")?.toString().trim(),
      participationType,
      generalNotes: formData.get("generalNotes")?.toString().trim() || undefined,
      awarenessSource,
      awarenessSourceOther:
        awarenessSource === "أخرى" ? awarenessSourceOther.trim() || undefined : undefined,
    };

    if (participationType === "scientific") {
      payload.scientific = {
        paperTitle: formData.get("paperTitle")?.toString().trim(),
        scientificTrack,
        abstract: formData.get("abstract")?.toString().trim() || undefined,
      };
    }

    if (participationType === "partnership") {
      payload.partnership = {
        partnershipType: partnershipType,
        partnershipNotes: formData.get("partnershipNotes")?.toString().trim() || undefined,
      };
    }

    if (participationType === "universityClub") {
      const clubName = formData.get("clubName")?.toString().trim();
      const clubUniversity = formData.get("clubUniversity")?.toString().trim();

      payload.club = {
        clubName,
        university: clubUniversity,
      };
    }

    if (participationType === "exhibitor") {
      const projectName = formData.get("projectName")?.toString().trim();
      const projectSummary = formData.get("projectSummary")?.toString().trim();
      const projectUniversity = formData.get("projectUniversity")?.toString().trim();
      const projectHasLabel = formData.get("projectHasLabel")?.toString().trim();
      const projectType = formData.get("projectType")?.toString().trim();

      payload.project = {
        projectName,
        projectSummary,
        university: projectUniversity,
        hasLabel: projectHasLabel,
        projectType,
      };
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    try {
      setIsSubmitting(true);
      setFormStatus(null);
      const response = await fetch(
        `${apiBase}api/v1/national-conference/registrations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "خطأ غير متوقع" }));

        if (response.status === 409) {
          throw new Error(
            errorData.message || "تم استخدام هذا البريد الإلكتروني للتسجيل مسبقًا. يرجى التواصل مع اللجنة لتعديل بياناتك."
          );
        }

        throw new Error(errorData.message || "تعذر إرسال الاستمارة، يرجى المحاولة لاحقًا.");
      }

      setFormStatus({
        type: "success",
        message: "تم تسجيل مشاركتك بنجاح. سيتم التواصل معك قريبًا من اللجنة التنظيمية.",
      });
      form.reset();
      setParticipationType("");
      setPartnershipType("");
      setAgreed(false);
      setRole("");
      setRoleOtherDetail("");
      setAwarenessSource("");
      setAwarenessSourceOther("");
      setScientificTrack("");
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error.message || "تعذر إرسال الاستمارة، يرجى المحاولة لاحقًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#faf6f0] min-h-screen py-16 md:py-20" dir="rtl">
      <Helmet>
        <title>استمارة المشاركة | الملتقى الوطني الثالث - ريادة الأعمال والقانون</title>
        <meta
          name="description"
          content="سجل مشاركتك في الملتقى الوطني الثالث حول ريادة الأعمال والقانون، المنظم من طرف كلية الحقوق والعلوم السياسية – جامعة أمحمد بوقرة بومرداس."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <section className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] text-white text-sm font-semibold shadow-lg">
            استمارة المشاركة في الملتقى الوطني الثالث
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#09142b] leading-tight">
            ريادة الأعمال والقانون: تكامل لبناء اقتصاد المعرفة
          </h1>
          <p className="mt-3 text-lg text-[#b48b5a] font-semibold">
            تحت شعار: &quot;جيلٌ ريادي... بفكرٍ قانوني ورؤيةٍ معرفية&quot;
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiCalendar className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">التاريخ</div>
                <div className="text-sm text-[#4b5563]">من 07 إلى 09 ديسمبر 2025</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiMapPin className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">المكان</div>
                <div className="text-sm text-[#4b5563]">
                  مركب القاعات – كلية الحقوق والعلوم السياسية، جامعة أمحمد بوقرة بومرداس
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiUsers className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">الفئات المستهدفة</div>
                <div className="text-sm text-[#4b5563]">
                  الباحثون، الطلبة الجامعيون، رواد الأعمال، أصحاب المؤسسات الناشئة، الطلبة حاملو الأفكار والمشاريع، الفاعلون الاقتصاديون، الشركاء المؤسساتيون، الإعلاميون، المتطوعون
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#09142b]/10 bg-white/90 p-6 shadow-md text-right">
            <h2 className="text-xl font-semibold text-[#09142b] mb-3">لمحة عن الملتقى</h2>
            <p className="text-[#4b5563] leading-relaxed">
              يسرّ كلية الحقوق والعلوم السياسية – جامعة أمحمد بوقرة بومرداس بالتعاون مع النادي العلمي الثقافي
              "السنهوري" دعوة الباحثين، الطلبة الجامعيين، روّاد الأعمال، أصحاب المؤسسات الناشئة، الطلبة حاملي
              الأفكار والمشاريع، الفاعلين الاقتصاديين، الشركاء المؤسساتيين، المتطوعين، والإعلاميين للمشاركة في
              فعاليات الملتقى الوطني الثالث حول ريادة الأعمال والقانون. يهدف الحدث إلى
               تعزيز التكامل بين الفكر القانوني والمبادرة الاقتصادية لبناء اقتصاد المعرفة. يرجى ملء هذه الاستمارة
               بدقة لتسجيل المشاركة وفق الفئة المناسبة.
            </p>
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur rounded-3xl border border-[#e7cfa7] shadow-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                  <FiFileText className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#09142b]">القسم الأول: المعلومات الشخصية</h3>
                  <p className="text-sm text-[#6b7280]">
                    يرجى إدخال بياناتك وفق الصفة التي تمثلها في الملتقى.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="fullName">
                    الاسم واللقب الكامل
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="مثال: محمد بن أحمد"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="role">
                    الصفة
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    value={role}
                    onChange={(event) => {
                      const value = event.target.value;
                      setRole(value);
                      if (value !== "صنف آخر (يرجى التوضيح)") {
                        setRoleOtherDetail("");
                      }
                    }}
                  >
                    <option value="" disabled>
                      اختر الصفة التي تمثلك
                    </option>
                    {participationRoles.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </div>

                {role === "صنف آخر (يرجى التوضيح)" && (
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="roleOtherDetail">
                      يرجى التوضيح
                    </label>
                    <input
                      id="roleOtherDetail"
                      name="roleOtherDetail"
                      type="text"
                      required
                      value={roleOtherDetail}
                      onChange={(event) => setRoleOtherDetail(event.target.value)}
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: مستشار قانوني مستقل"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="organization">
                    المؤسسة / الجهة
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="مثال: جامعة أمحمد بوقرة"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-[#c8a45e]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-10 pr-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="wilaya">
                    الولاية
                  </label>
                  <input
                    id="wilaya"
                    name="wilaya"
                    type="text"
                    required
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="مثال: بومرداس"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="phone">
                    رقم الهاتف (واتساب)
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-[#c8a45e]" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-10 pr-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: 0550 000 000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                  <FiCheck className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#09142b]">القسم الثاني: نوع المشاركة</h3>
                  <p className="text-sm text-[#6b7280]">
                    اختر نوع المشاركة الذي يعكس مساهمتك في الملتقى.
                  </p>
                </div>
              </div>

              <select
                name="participationType"
                required
                value={participationType}
                onChange={(event) => {
                  const value = event.target.value;
                  setParticipationType(value);
                  if (value !== "scientific") {
                    setScientificTrack("");
                  }
                }}
                className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
              >
                <option value="" disabled>
                  اختر نوع المشاركة
                </option>
                {participationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Section 3 - Scientific */}
            {participationType === "scientific" && (
              <div className="rounded-3xl border border-[#c8a45e]/40 bg-[#faf6f0]/80 p-6">
                <h3 className="text-xl font-semibold text-[#09142b] mb-3">
                  القسم الثالث: معلومات المداخلة العلمية
                </h3>
                <div className="mb-5 rounded-2xl border border-[#c8a45e]/40 bg-white/80 p-4 text-sm text-[#4b5563] shadow-inner">
                  يرجى إرسال نص المداخلة كاملاً إلى البريد الإلكتروني <a href="mailto:sanhouri@soslawdz.com" className="font-semibold text-[#c8a45e] hover:underline">sanhouri@soslawdz.com</a> بعد تعبئة هذا القسم.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="paperTitle">
                      عنوان المداخلة
                    </label>
                    <input
                      id="paperTitle"
                      name="paperTitle"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="أدخل عنوان المداخلة المقترح"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="scientificTrack">
                      المحور
                    </label>
                    <select
                      id="scientificTrack"
                      name="scientificTrack"
                      required
                      value={scientificTrack}
                      onChange={(event) => setScientificTrack(event.target.value)}
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    >
                      <option value="" disabled>
                        اختر المحور المناسب
                      </option>
                      {scientificTracks.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="abstract">
                    ملخص المداخلة (اختياري – في حدود 300 كلمة)
                  </label>
                  <textarea
                    id="abstract"
                    name="abstract"
                    rows={6}
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="اكتب ملخص المداخلة إن رغبت بذلك..."
                  />
                </div>
              </div>
            )}

            {/* Section 4 - Partnerships */}
            {participationType === "partnership" && (
              <div className="rounded-3xl border border-[#09142b]/10 bg-[#09142b]/5 p-6">
                <h3 className="text-xl font-semibold text-[#09142b] mb-3">
                  القسم الرابع: طبيعة المساهمة أو الشراكة
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="partnershipType">
                    اختر طبيعة المساهمة
                  </label>
                  <select
                    id="partnershipType"
                    name="partnershipType"
                    required
                    value={partnershipType}
                    onChange={(event) => setPartnershipType(event.target.value)}
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      اختر طبيعة المساهمة
                    </option>
                    {partnershipOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="partnershipNotes">
                    ملاحظات أو مقترحات التعاون
                  </label>
                  <textarea
                    id="partnershipNotes"
                    name="partnershipNotes"
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="أضف تفاصيل إضافية حول المساهمة أو الشراكة المقترحة..."
                  />
                </div>
              </div>
            )}

            {/* Section 4b - University Club */}
            {participationType === "universityClub" && (
              <div className="rounded-3xl border border-[#09142b]/10 bg-[#09142b]/5 p-6">
                <h3 className="text-xl font-semibold text-[#09142b] mb-3">
                  القسم الرابع: بيانات النادي الجامعي
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="clubName">
                      اسم النادي
                    </label>
                    <input
                      id="clubName"
                      name="clubName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: النادي العلمي الثقافي السنهوري"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="clubUniversity">
                      الجامعة
                    </label>
                    <input
                      id="clubUniversity"
                      name="clubUniversity"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: جامعة أمحمد بوقرة بومرداس"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 4c - Project competition (exhibitor) */}
            {participationType === "exhibitor" && (
              <div className="rounded-3xl border border-[#09142b]/10 bg-[#09142b]/5 p-6">
                <h3 className="text-xl font-semibold text-[#09142b] mb-3">
                  القسم الرابع: بيانات المشروع المشارك في المسابقة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="projectName">
                      اسم المشروع
                    </label>
                    <input
                      id="projectName"
                      name="projectName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="اكتب اسم المشروع"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-[#09142b]"
                      htmlFor="projectUniversity"
                    >
                      الجامعة
                    </label>
                    <input
                      id="projectUniversity"
                      name="projectUniversity"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: جامعة أمحمد بوقرة بومرداس"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="projectSummary">
                    شرح ملخص عن المشروع
                  </label>
                  <textarea
                    id="projectSummary"
                    name="projectSummary"
                    rows={4}
                    required
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="قدّم ملخصًا مختصرًا عن فكرة المشروع وأهدافه..."
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-[#09142b]"
                      htmlFor="projectHasLabel"
                    >
                      حاصل على وسم لابل
                    </label>
                    <select
                      id="projectHasLabel"
                      name="projectHasLabel"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    >
                      <option value="" disabled>
                        اختر
                      </option>
                      <option value="نعم">نعم</option>
                      <option value="لا">لا</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="projectType">
                      نوع المشروع
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    >
                      <option value="" disabled>
                        اختر نوع المشروع
                      </option>
                      <option value="منتج">منتج</option>
                      <option value="خدمة">خدمة</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5 */}
            <div className="rounded-3xl border border-[#e7cfa7] bg-[#faf6f0]/70 p-6">
              <h3 className="text-xl font-semibold text-[#09142b] mb-3">القسم الخامس: الملاحظات العامة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="generalNotes">
                    ملاحظات أو اقتراحات تخص الملتقى (اختياري)
                  </label>
                  <textarea
                    id="generalNotes"
                    name="generalNotes"
                    rows={4}
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    placeholder="شاركنا أي اقتراحات أو ملاحظات..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="awarenessSource">
                    كيف سمعت عن الملتقى؟
                  </label>
                  <select
                    id="awarenessSource"
                    name="awarenessSource"
                    required
                    value={awarenessSource}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAwarenessSource(value);
                      if (value !== "أخرى") {
                        setAwarenessSourceOther("");
                      }
                    }}
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                  >
                    <option value="" disabled>
                      اختر الإجابة المناسبة
                    </option>
                    {awarenessOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {awarenessSource === "أخرى" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#09142b]" htmlFor="awarenessSourceOther">
                      يرجى التوضيح
                    </label>
                    <input
                      id="awarenessSourceOther"
                      name="awarenessSourceOther"
                      type="text"
                      required
                      value={awarenessSourceOther}
                      onChange={(event) => setAwarenessSourceOther(event.target.value)}
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: من نشرة إخبارية"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 6 */}
            <div className="rounded-3xl border border-[#e7cfa7] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#09142b] mb-3">القسم السادس: تأكيد المشاركة</h3>
              <p className="text-sm text-[#4b5563] leading-relaxed mb-4">
                أُقرّ بأنّ المعلومات المقدمة صحيحة، وأوافق على استلام إشعاريات الملتقى عبر البريد الإلكتروني.
              </p>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#09142b]">
                <input
                  type="checkbox"
                  className="rounded border-[#c8a45e] text-[#c8a45e] focus:ring-[#c8a45e]"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  required
                />
                أوافق على الشروط المذكورة أعلاه.
              </label>
            </div>

            {/* Status message */}
            {formStatus && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  formStatus.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white font-bold shadow-xl transition-transform duration-300 ${
                  isSubmitting ? "opacity-60" : "hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال الاستمارة"}
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default NationalConferenceRegistration;

