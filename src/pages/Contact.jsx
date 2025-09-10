import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SEOHead from "../components/SEOHead";
import { useContactInfo } from "../hooks/useContactInfo";
import {
  FiMail,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import contactRequestService from "../services/contactRequestService";
import toast from "react-hot-toast";

const PRIMARY = "#09142b";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9999999999995!2d3.058756315258!3d36.7537689799627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fadf6e7b7b7b7%3A0x7b7b7b7b7b7b7b7b!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1680000000000!5m2!1sen!2sdz";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { getContactPhone, getContactEmail, getMainAddress } = useContactInfo();
  const title = t(
    "contactSeoTitle",
    "تواصل معنا | SOSLAW - منصة الاستشارات القانونية"
  );
  const desc = t(
    "contactSeoDesc",
    "تواصل مع فريق SOSLAW للحصول على استشارتك القانونية. نحن متاحون لمساعدتك في جميع القضايا القانونية. استشارتك القانونية أينما كنت."
  );
  const keywords =
    "تواصل معنا, استشارة قانونية, محامي, قانون, خدمات قانونية, SOSLAW, الجزائر, استشارة أونلاين";

  // Structured data for Contact page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تواصل معنا - SOSLAW",
    description: desc,
    url: "https://soslaw.com/contact",
    mainEntity: {
      "@type": "LegalService",
      name: "SOSLAW",
      telephone: "+213-XXX-XXX-XXX",
      email: "info@soslaw.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "DZ",
        addressLocality: "الجزائر",
        addressRegion: "الجزائر",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+213-XXX-XXX-XXX",
        contactType: "customer service",
        availableLanguage: "Arabic",
      },
    },
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Validate required fields
      if (!form.name || !form.email || !form.message) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        setStatus("error");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        toast.error("يرجى إدخال بريد إلكتروني صحيح");
        setStatus("error");
        return;
      }

      // Send the request to the backend
      await contactRequestService.createContactRequest({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone ? form.phone.trim() : null,
        subject: form.subject ? form.subject.trim() : null,
        message: form.message.trim(),
      });

      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact request:", error);
      toast.error("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] flex flex-col items-center w-full">
      <SEOHead
        title={title}
        description={desc}
        keywords={keywords}
        canonical="/contact"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="w-full bg-[#09142b] py-16 px-4 md:px-8 text-center">
        <h1
          className={`font-extrabold text-[#c8a45e] mb-4 drop-shadow-lg ${
            isRTL ? "text-3xl md:text-5xl" : "text-4xl md:text-5xl"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("contactPageTitle")}
        </h1>
        <p
          className={`text-[#faf6f0] max-w-2xl mx-auto mb-2 ${
            isRTL ? "text-sm md:text-xl" : "text-lg md:text-xl"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("contactPageSubtitle")}
        </p>
      </section>

      {/* Main Content Split Layout */}
      <section
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-12 px-4 md:px-0"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Left: Map & Info */}
        <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#e7cfa7] bg-white">
            <iframe
              title="SOSLAW Location"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] md:h-[340px]"
            ></iframe>
          </div>
          <div className="bg-[#faf6f0] rounded-2xl shadow-md border border-[#e7cfa7] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#09142b]">
              <FiMapPin
                className={`text-[#c8a45e] ${
                  isRTL ? "text-xl md:text-2xl" : "text-2xl"
                }`}
              />
              <span
                className={`font-bold ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t("contactLocationTitle", "Our Location")}
              </span>
            </div>
            <p
              className={`text-[#09142b] font-medium opacity-90 mb-2 ${
                isRTL ? "text-sm md:text-base" : "text-base"
              }`}
            >
              {getMainAddress()}
            </p>
            <div className="flex items-center gap-2 text-[#09142b]">
              <FiPhone
                className={`text-[#c8a45e] ${
                  isRTL ? "text-lg md:text-xl" : "text-xl"
                }`}
              />
              <span
                className={`font-semibold ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t("contactPhone", "Phone")}:{" "}
              </span>
              <span
                dir="ltr"
                className={`${isRTL ? "text-sm md:text-base" : "text-base"}`}
              >
                {getContactPhone()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#09142b]">
              <FiMail
                className={`text-[#c8a45e] ${
                  isRTL ? "text-lg md:text-xl" : "text-xl"
                }`}
              />
              <span
                className={`font-semibold ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t("contactEmailInfo", "Email")}:{" "}
              </span>
              <span
                dir="ltr"
                className={`${isRTL ? "text-sm md:text-base" : "text-base"}`}
              >
                {getContactEmail()}
              </span>
            </div>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className="flex-1 flex flex-col justify-center min-w-[320px]">
          <form
            className={`w-full max-w-xl bg-white rounded-3xl shadow-xl border border-[#e7cfa7] p-10 flex flex-col gap-6 ${
              isRTL ? "text-right" : "text-left"
            }`}
            onSubmit={handleSubmit}
            dir={isRTL ? "rtl" : "ltr"}
            autoComplete="off"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className={`font-semibold text-[#09142b] flex items-center gap-2 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiUser
                  className={`text-[#c8a45e] ${isRTL ? "text-lg" : "text-xl"}`}
                />{" "}
                {t("contactName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder={t("contactName")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className={`font-semibold text-[#09142b] flex items-center gap-2 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiMail
                  className={`text-[#c8a45e] ${isRTL ? "text-lg" : "text-xl"}`}
                />{" "}
                {t("contactEmail")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder={t("contactEmail")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className={`font-semibold text-[#09142b] flex items-center gap-2 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiPhone
                  className={`text-[#c8a45e] ${isRTL ? "text-lg" : "text-xl"}`}
                />{" "}
                {t("contactPhone", "رقم الهاتف")}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder={t("contactPhone", "رقم الهاتف")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className={`font-semibold text-[#09142b] flex items-center gap-2 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiMessageCircle
                  className={`text-[#c8a45e] ${isRTL ? "text-lg" : "text-xl"}`}
                />{" "}
                {t("contactSubject", "الموضوع")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className={`rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
                value={form.subject}
                onChange={handleChange}
                disabled={loading}
                placeholder={t("contactSubject", "الموضوع")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className={`font-semibold text-[#09142b] flex items-center gap-2 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiMessageCircle
                  className={`text-[#c8a45e] ${isRTL ? "text-lg" : "text-xl"}`}
                />{" "}
                {t("contactMessage")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] resize-none ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
                value={form.message}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder={t("contactMessage")}
              />
            </div>
            <button
              type="submit"
              className={`mt-2 w-full py-3 rounded-lg font-bold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8a45e] ${
                isRTL ? "text-sm md:text-lg" : "text-lg"
              } ${
                loading
                  ? "bg-[#b8b8b8] text-white cursor-not-allowed"
                  : "bg-[#09142b] text-[#c8a45e] hover:bg-[#0a1a2f] hover:text-white"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                t("contactSend")
              )}
            </button>
            {status === "success" && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-2">
                <FiCheckCircle
                  className={`text-green-600 ${
                    isRTL ? "text-lg md:text-xl" : "text-xl"
                  }`}
                />
                <span
                  className={`${isRTL ? "text-sm md:text-base" : "text-base"}`}
                >
                  {t("contactSuccess")}
                </span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-2">
                <FiAlertCircle
                  className={`text-red-600 ${
                    isRTL ? "text-lg md:text-xl" : "text-xl"
                  }`}
                />
                <span
                  className={`${isRTL ? "text-sm md:text-base" : "text-base"}`}
                >
                  {t("contactError")}
                </span>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
