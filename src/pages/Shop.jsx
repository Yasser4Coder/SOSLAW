import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import shopBg from "../assets/bgs/shop-bg.jpg";
import {
  FiBookOpen,
  FiFileText,
  FiDownload,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiHelpCircle,
  FiMessageCircle,
  FiLoader,
} from "react-icons/fi";
import * as shopService from "../services/shopService";

const PRODUCT_CATEGORIES = [
  { id: "all", i18nKey: "shopAll", fallback: "كل المنتجات" },
  { id: "print", i18nKey: "shopPrintBooks", fallback: "كتب ورقية" },
  { id: "digital", i18nKey: "shopDigitalBooks", fallback: "كتب رقمية (PDF)" },
  { id: "tools", i18nKey: "shopTools", fallback: "أدوات وموارد" },
];

const Shop = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "ar";
  const isRTL = currentLanguage === "ar";
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shopProducts"],
    queryFn: () => shopService.getProducts(),
  });

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>
          {t("shopPageTitle", "متجر SOS Law - كتب وأدوات قانونية")}
        </title>
        <meta
          name="description"
          content={t(
            "shopPageDesc",
            "متجر SOS Law يوفر كتبًا وأدلة ونماذج قانونية موثوقة لمساعدتك على فهم القانون وتطبيقه بثقة."
          )}
        />
        <html lang={currentLanguage} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <main className="min-h-screen bg-[#f5f5f5]">
        {/* Hero */}
        <section className="relative text-white py-16 md:py-20 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{ backgroundImage: `url(${shopBg})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#09142b]/80" aria-hidden />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`max-w-3xl ${
                isRTL ? "text-right ml-auto" : "text-left mr-auto"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-[#e7cfa7] mb-4">
                {t("shopHeroEyebrow", "متجر SOS Law")}
              </p>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
                {t(
                  "shopHeroTitle",
                  "كتب قانونية وكتب ريادة وتكوين لمستقبلك المهني"
                )}
              </h1>
              <p className="text-[#e7cfa7] text-base md:text-lg leading-relaxed mb-6">
                {t(
                  "shopHeroSubtitle",
                  "اختر من بين كتب مطبوعة و رقمية ونماذج جاهزة تم إعدادها من طرف فريق SOS Law لتناسب احتياجات الطلبة، المهنيين ورواد الأعمال."
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#shop-products"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-[#c8a45e] text-[#09142b] font-semibold hover:bg-[#b48b5a] transition-colors duration-200 cursor-pointer"
                >
                  <FiBookOpen className="ml-2" />
                  {t("shopHeroPrimaryCta", "استكشف المنتجات")}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-xl border border-[#e7cfa7] text-[#e7cfa7] hover:bg-white hover:text-[#09142b] transition-colors duration-200 cursor-pointer"
                >
                  <FiMessageCircle className="ml-2" />
                  {t("shopHeroSecondaryCta", "تواصل معنا للاستفسار")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products + filters */}
        <section
          id="shop-products"
          className="py-14 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#09142b] text-white border-[#09142b]"
                      : "bg-white text-[#09142b] border-[#e5e7eb] hover:border-[#c8a45e] hover:text-[#c8a45e]"
                  }`}
                >
                  {t(cat.i18nKey, cat.fallback)}
                </button>
              );
            })}
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <FiLoader className="w-10 h-10 animate-spin text-[#09142b]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product) => {
                const imgs = shopService.normalizeShopImages(product.images);
                const imgSrc = imgs[0] ? shopService.getShopImageUrl(imgs[0]) : null;
                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden relative"
                  >
                    {product.badge && (
                      <span className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold rounded-lg bg-red-600 text-white shadow">
                        {product.badge}
                      </span>
                    )}
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={product.titleAr}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[#faf6f0] text-[#09142b] border border-[#e7cfa7]">
                          {product.category === "print" &&
                            t("shopBadgePrint", "كتاب ورقي")}
                          {product.category === "digital" &&
                            t("shopBadgeDigital", "كتاب رقمي")}
                          {product.category === "tools" &&
                            t("shopBadgeTools", "أدوات وموارد")}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {product.originalPrice != null && Number(product.originalPrice) > Number(product.price) && (
                            <span className="text-sm text-red-600 line-through font-medium">
                              {product.originalPrice} {product.currency}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-[#c8a45e]">
                            {product.price} {product.currency}
                          </span>
                        </div>
                      </div>
                      <h2 className="font-bold text-lg text-[#09142b] mb-2 leading-snug">
                        {product.titleAr}
                      </h2>
                      <p className="text-sm text-[#4b5563] leading-relaxed mb-4">
                        {product.descAr || ""}
                      </p>
                      <ul className="space-y-1 text-xs text-[#6b7280]">
                        {(Array.isArray(product.meta) ? product.meta : []).map((item) => (
                          <li key={item} className="flex items-center gap-1">
                            <FiCheckCircle className="text-[#c8a45e]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 pb-6 mt-auto">
                      <Link
                        to={`/shop/${product.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#09142b] text-white text-sm font-semibold hover:bg-[#1b2742] transition-colors duration-200 cursor-pointer"
                      >
                        <FiFileText className="ml-2" />
                        {t("shopOrderButton", "اطلب هذا المنتج")}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Trust strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#e7cfa7] p-5 flex items-start gap-3">
              <FiShield className="text-[#c8a45e] mt-1 w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm text-[#09142b] mb-1">
                  {t("shopTrustSecureTitle", "محتوى قانوني موثوق")}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {t(
                    "shopTrustSecureDesc",
                    "جميع المنتجات تم إعدادها ومراجعتها من طرف فريق SOS Law لضمان الدقة القانونية."
                  )}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#e7cfa7] p-5 flex items-start gap-3">
              <FiDownload className="text-[#c8a45e] mt-1 w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm text-[#09142b] mb-1">
                  {t("shopTrustDeliveryTitle", "وصول فوري للنسخ الرقمية")}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {t(
                    "shopTrustDeliveryDesc",
                    "المنتجات الرقمية تصلك عبر البريد الإلكتروني بعد تأكيد الطلب."
                  )}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#e7cfa7] p-5 flex items-start gap-3">
              <FiTruck className="text-[#c8a45e] mt-1 w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm text-[#09142b] mb-1">
                  {t("shopTrustSupportTitle", "توصيل ودعم بعد البيع")}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {t(
                    "shopTrustSupportDesc",
                    "للكتب الورقية، نوفر لك تفاصيل التوصيل بعد الطلب، مع إمكانية التواصل مع فريقنا لأي استفسار."
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Mini FAQ */}
          <section className="bg-white rounded-2xl border border-[#e5e7eb] p-6 md:p-8">
            <div className="flex items-start gap-3 mb-4">
              <FiHelpCircle className="text-[#c8a45e] mt-1 w-6 h-6" />
              <div>
                <h2 className="font-bold text-lg text-[#09142b] mb-1">
                  {t("shopFaqTitle", "أسئلة شائعة حول المتجر")}
                </h2>
                <p className="text-sm text-[#6b7280]">
                  {t(
                    "shopFaqSubtitle",
                    "بعض الإجابات السريعة على أهم الأسئلة قبل إتمام طلبك."
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#09142b]">
              <div>
                <h3 className="font-semibold mb-1">
                  {t("shopFaqQ1", "كيف أستلم الكتاب أو الملف بعد الشراء؟")}
                </h3>
                <p className="text-[#4b5563]">
                  {t(
                    "shopFaqA1",
                    "المنتجات الرقمية تُرسل إلى بريدك الإلكتروني، وبالنسبة للكتب الورقية يتواصل معك فريقنا لتأكيد تفاصيل التوصيل."
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {t("shopFaqQ2", "ما هي طرق الدفع المتاحة؟")}
                </h3>
                <p className="text-[#4b5563]">
                  {t(
                    "shopFaqA2",
                    "يمكنك الدفع عبر التحويل البنكي أو الطرق المتاحة حاليًا لدى SOS Law، وسيتم توضيحها لك بعد إرسال طلب الشراء."
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {t("shopFaqQ3", "هل يمكنني طرح أسئلة قبل الشراء؟")}
                </h3>
                <p className="text-[#4b5563]">
                  {t(
                    "shopFaqA3",
                    "نعم، يمكنك دائمًا التواصل معنا عبر صفحة الاتصال لطرح أي سؤال قبل إتمام الطلب."
                  )}
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default Shop;

