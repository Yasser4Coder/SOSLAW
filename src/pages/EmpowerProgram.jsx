import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiPhoneCall } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const EmpowerProgram = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      <Helmet>
        <title>برنامج SOS Law للتكوين والتمكين</title>
        <meta
          name="description"
          content="برنامج تكويني متكامل يجمع بين المهارات الشخصية، ريادة الأعمال، الجانب القانوني، التسويق والعمل الجماعي، مع فرصة الانضمام كسفير للمؤسسة."
        />
        <html lang={i18n.language || "ar"} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <main className="min-h-screen bg-[#faf6f0]" dir={isRTL ? "rtl" : "ltr"}>
        <section className="bg-[#09142b] text-white py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <p className="text-sm font-semibold tracking-wide text-[#e7cfa7] mb-3">
              🎓 برنامج SOS Law للتكوين والتمكين
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              من متدرب إلى سفير للمؤسسة
            </h1>
            <p className="text-[#e7cfa7] text-base md:text-lg max-w-3xl leading-relaxed mb-7">
              هذا البرنامج ليس مجرد دورات… بل تجربة عملية تؤهلك لسوق العمل وتفتح لك آفاقًا جديدة.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/empower-program/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c8a45e] text-[#09142b] font-semibold hover:bg-[#b48b5a]"
              >
                سجل الآن
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <a
                href="tel:0550069695"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e7cfa7] text-[#e7cfa7] hover:bg-white hover:text-[#09142b]"
              >
                <FiPhoneCall className="w-5 h-5" />
                0550069695
              </a>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#e7cfa7] p-6">
              <h2 className="text-xl font-bold text-[#09142b] mb-3">فكرة البرنامج</h2>
              <p className="text-[#4b5563] leading-relaxed">
                برنامج تكويني متكامل يجمع بين المهارات الشخصية، ريادة الأعمال، الجانب القانوني، التسويق والعمل الجماعي — مع
                فرصة حقيقية للانضمام كسفير للمؤسسة.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#e7cfa7] p-6">
              <h2 className="text-xl font-bold text-[#09142b] mb-3">الأهداف</h2>
              <ul className="text-[#4b5563] leading-relaxed space-y-2">
                <li>✔ تطوير مهارات التواصل والإلقاء</li>
                <li>✔ تمكين الشباب في ريادة الأعمال</li>
                <li>✔ تبسيط الجانب القانوني للمشاريع</li>
                <li>✔ تعزيز روح العمل الجماعي</li>
                <li>✔ إعداد سفراء قادرين على تمثيل المؤسسة</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-[#e7cfa7] p-6">
              <h2 className="text-xl font-bold text-[#09142b] mb-3">معلومات سريعة</h2>
              <div className="space-y-3 text-sm text-[#4b5563]">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#c8a45e]" />
                  <span>عن بعد (Google Meet / Telegram) + أونلاين</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#c8a45e]" />
                  <span>بداية من 18 أفريل 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#c8a45e]" />
                  <span>الفئة المستهدفة: الطلبة والشباب المهتمين بالتطوير وريادة الأعمال</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="bg-white rounded-3xl border border-[#e7cfa7] p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#09142b] mb-6">محتوى البرنامج التدريبي</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#09142b] mb-3">المرحلة الأولى: التكوين الأساسي</h3>
                  <ol className="space-y-3 text-[#4b5563] leading-relaxed">
                    <li>
                      <strong>1. دورة الإلقاء والتواصل الفعال</strong>
                      <div className="text-sm mt-1">التحكم في الخوف • فن التحدث أمام الجمهور • تقنيات الإقناع</div>
                    </li>
                    <li>
                      <strong>2. دورة مدخل إلى ريادة الأعمال</strong>
                      <div className="text-sm mt-1">من الفكرة إلى المشروع • نموذج العمل • أخطاء المبتدئين</div>
                    </li>
                    <li>
                      <strong>3. دورة في الجانب القانوني</strong>
                      <div className="text-sm mt-1">كيف تبدأ مشروعك قانونيًا • أهم القوانين للمشاريع • حماية الفكرة</div>
                    </li>
                    <li>
                      <strong>4. إدارة المشاريع الرقمية</strong>
                      <div className="text-sm mt-1">بناء مشروع أونلاين • أدوات العمل الرقمي • تنظيم العمل</div>
                    </li>
                    <li>
                      <strong>5. المبيعات عبر الهاتف</strong>
                      <div className="text-sm mt-1">تقنيات الإقناع • التعامل مع العملاء • إغلاق الصفقات</div>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#09142b] mb-3">المرحلة الثانية: الانتقاء</h3>
                  <ul className="text-[#4b5563] leading-relaxed space-y-2">
                    <li>✔ تقييم المشاركين وتقديم الشهادات</li>
                    <li>✔ اختيار أفضل العناصر</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#09142b] mb-3">المرحلة الثالثة: برنامج السفراء</h3>
                  <ol className="space-y-3 text-[#4b5563] leading-relaxed" start={6}>
                    <li>
                      <strong>6. العمل ضمن فريق</strong>
                      <div className="text-sm mt-1">القيادة • العمل الجماعي • إدارة المهام</div>
                    </li>
                    <li>
                      <strong>7. دورة التسويق</strong>
                      <div className="text-sm mt-1">التسويق الرقمي • بناء جمهور • الترويج للخدمات</div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-[#09142b]/5 border border-[#09142b]/10 p-6">
                <h3 className="text-xl font-bold text-[#09142b] mb-3">مزايا البرنامج</h3>
                <ul className="text-[#4b5563] leading-relaxed space-y-2">
                  <li>✔ شهادات مشاركة</li>
                  <li>✔ تكوين تطبيقي حقيقي</li>
                  <li>✔ فرصة الانضمام كسفير</li>
                  <li>✔ تطوير مهارات شخصية ومهنية</li>
                </ul>
                <h4 className="text-lg font-bold text-[#09142b] mt-6 mb-2">مزايا السفراء</h4>
                <ul className="text-[#4b5563] leading-relaxed space-y-2">
                  <li>تمثيل مؤسسة SOS Law</li>
                  <li>الترويج لخدمات المؤسسة</li>
                  <li>نسبة أرباح من المبيعات</li>
                  <li>مرافقة لأفكارهم ومشاريعهم</li>
                  <li>تكوين إضافي مجاني</li>
                  <li>بناء شبكة علاقات</li>
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/empower-program/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
                >
                  سجل الآن
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <a
                  href="https://wa.me/213550069695"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#09142b] text-[#09142b] font-semibold hover:bg-[#09142b]/5"
                >
                  تواصل واتساب
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EmpowerProgram;

