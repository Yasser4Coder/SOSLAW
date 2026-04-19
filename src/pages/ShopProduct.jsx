import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiChevronRight,
  FiCheckCircle,
  FiShield,
  FiCreditCard,
  FiLock,
  FiShoppingCart,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import * as shopService from "../services/shopService";
import toast from "react-hot-toast";

const ShopProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    quantity: 1,
  });
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["shopProduct", productId],
    queryFn: () => shopService.getProductByIdOrSlug(productId),
    enabled: !!productId,
  });

  if (isError || (product === null && !isLoading)) {
    navigate("/shop", { replace: true });
    return null;
  }

  if (isLoading || !product) {
    return (
      <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <FiLoader className="w-10 h-10 animate-spin text-[#09142b]" />
      </main>
    );
  }

  const rawImages = shopService.normalizeShopImages(product.images);
  const images =
    rawImages.length > 0
      ? rawImages.map((p) => shopService.getShopImageUrl(p)).filter(Boolean)
      : [];
  const title = product.titleAr;
  const description = product.descAr || "";
  const longDescription = product.longDescAr || description;

  const categoryLabel =
    product.category === "print"
      ? t("shopBadgePrint", "كتاب ورقي")
      : product.category === "digital"
        ? t("shopBadgeDigital", "كتاب رقمي")
        : t("shopBadgeTools", "أدوات وموارد");

  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (!checkoutForm.clientName?.trim() || !checkoutForm.clientEmail?.trim() || !checkoutForm.clientPhone?.trim()) {
      toast.error("يرجى تعبئة الاسم، البريد والهاتف");
      return;
    }
    setCheckoutSubmitting(true);
    try {
      const result = await shopService.createCheckout({
        productId: product.id,
        quantity: Math.max(1, Number(checkoutForm.quantity) || 1),
        clientName: checkoutForm.clientName.trim(),
        clientEmail: checkoutForm.clientEmail.trim(),
        clientPhone: checkoutForm.clientPhone.trim(),
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      toast.success(result.message || "تم تسجيل الطلب. سنتواصل معك قريباً.");
      setCheckoutOpen(false);
    } catch (err) {
      toast.error(err.message || "فشل إنشاء الطلب");
    } finally {
      setCheckoutSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{title} | {t("shop", "المتجر")} - SOS Law</title>
        <meta name="description" content={description} />
      </Helmet>

      <main className="min-h-screen bg-[#faf6f0]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#e7cfa7] py-3">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              className="flex items-center gap-2 text-sm text-[#4b5563]"
              aria-label="Breadcrumb"
            >
              <Link
                to="/shop"
                className="hover:text-[#c8a45e] transition-colors"
              >
                {t("shop", "المتجر")}
              </Link>
              <FiChevronRight
                className={`w-4 h-4 text-[#c8a45e] ${isRTL ? "rotate-180" : ""}`}
              />
              <span className="text-[#09142b] font-medium truncate max-w-[200px] sm:max-w-none">
                {title}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Image gallery */}
            <div className={`space-y-4 ${isRTL ? "lg:order-2" : "lg:order-1"}`}>
              <div className="rounded-2xl border border-[#e7cfa7] bg-white overflow-hidden shadow-sm aspect-[4/3]">
                {images[selectedImageIndex] ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    لا توجد صورة
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#c8a45e] ring-2 ring-[#c8a45e]/30"
                          : "border-[#e5e7eb] hover:border-[#e7cfa7]"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className={`space-y-6 ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#faf6f0] text-[#09142b] border border-[#e7cfa7]">
                    {categoryLabel}
                  </span>
                  {product.badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#09142b] leading-tight mb-2">
                  {title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.originalPrice != null && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-lg text-red-600 line-through font-medium">
                      {product.originalPrice} {product.currency}
                    </span>
                  )}
                  <p className="text-xl font-semibold text-[#c8a45e]">
                    {product.price} {product.currency}
                  </p>
                </div>
              </div>

              <p className="text-[#4b5563] leading-relaxed">
                {description}
              </p>

              <ul className="space-y-2">
                {(Array.isArray(product.meta) ? product.meta : []).map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#09142b]"
                  >
                    <FiCheckCircle className="text-[#c8a45e] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Trust */}
              <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                <FiShield className="text-[#c8a45e]" />
                <span>
                  {t(
                    "shopTrustSecureDesc",
                    "جميع المنتجات تم إعدادها ومراجعتها من طرف فريق SOS Law لضمان الدقة القانونية."
                  )}
                </span>
              </div>

              {/* E-payment explanation */}
              <div className="rounded-xl border border-[#e7cfa7] bg-white p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#09142b] font-semibold">
                  <FiCreditCard className="text-[#c8a45e]" />
                  {t("shopProductEpaymentTitle", "الدفع الإلكتروني الآمن")}
                </div>
                <p className="text-sm text-[#4b5563] leading-relaxed">
                  {t(
                    "shopProductEpaymentDesc",
                    "يمكنك الدفع بكل أمان عبر البطاقة الذهبية أو بطاقة CIB (الدفع الإلكتروني CIB e-payment). يتم تأمين المعاملة ولا نخزن بيانات بطاقتك. بعد إتمام الطلب سنرسل لك رابط الدفع أو نتواصل معك لتأكيد التفاصيل."
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <FiLock className="text-[#c8a45e]" />
                  {t("shopProductEpaymentSecure", "معاملة آمنة ومشفرة")}
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742] transition-colors shadow-md"
              >
                <FiShoppingCart className="w-5 h-5" />
                {t("shopProductOrderNow", "اطلبه الآن")}
              </button>
            </div>
          </div>

          {/* Checkout modal */}
          {checkoutOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#09142b]">
                    {t("shopProductOrderNow", "اطلبه الآن")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiX size={22} />
                  </button>
                </div>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      value={checkoutForm.clientName}
                      onChange={(e) =>
                        setCheckoutForm((f) => ({ ...f, clientName: e.target.value }))
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      value={checkoutForm.clientEmail}
                      onChange={(e) =>
                        setCheckoutForm((f) => ({ ...f, clientEmail: e.target.value }))
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      value={checkoutForm.clientPhone}
                      onChange={(e) =>
                        setCheckoutForm((f) => ({ ...f, clientPhone: e.target.value }))
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={checkoutForm.quantity}
                      onChange={(e) =>
                        setCheckoutForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="flex-1 px-4 py-2 border rounded-xl"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutSubmitting}
                      className="flex-1 px-4 py-2 bg-[#09142b] text-white rounded-xl hover:bg-[#1b2742] disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {checkoutSubmitting ? (
                        <FiLoader className="w-5 h-5 animate-spin" />
                      ) : (
                        t("shopProductOrderNow", "اطلبه الآن")
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Long description */}
          <section className="mt-12 md:mt-16">
            <h2 className="text-xl font-bold text-[#09142b] mb-4">
              {t("shopProductAboutTitle", "عن هذا المنتج")}
            </h2>
            <div className="rounded-2xl border border-[#e7cfa7] bg-white p-6 md:p-8">
              <p className="text-[#4b5563] leading-relaxed whitespace-pre-line">
                {longDescription}
              </p>
            </div>
          </section>

          {/* Back to shop */}
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#09142b] font-medium hover:text-[#c8a45e] transition-colors"
            >
              <FiChevronRight
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
              />
              {t("shopBackToShop", "العودة إلى المتجر")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShopProduct;
