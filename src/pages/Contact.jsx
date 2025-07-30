import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  FiMail,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const PRIMARY = "#09142b";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9999999999995!2d3.058756315258!3d36.7537689799627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fadf6e7b7b7b7%3A0x7b7b7b7b7b7b7b7b!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1680000000000!5m2!1sen!2sdz";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const title = t(
    "contactSeoTitle",
    "Contact SOSLAW | Legal Consultation Services"
  );
  const desc = t(
    "contactSeoDesc",
    "Contact SOSLAW team for legal consultations - our location, contact information, and quick contact form."
  );
  const url = "https://soslaw.com/contact";
  const image = "/logo.svg";
  const isRTL = i18n.language === "ar";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setTimeout(() => {
      if (form.name && form.email && form.message) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] flex flex-col items-center w-full">
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={desc} />
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      {/* Hero Section */}
      <section className="w-full bg-[#09142b] py-16 px-4 md:px-8 text-center">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-[#c8a45e] mb-4 drop-shadow-lg"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("contactPageTitle")}
        </h1>
        <p
          className="text-[#faf6f0] text-lg md:text-xl max-w-2xl mx-auto mb-2"
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
              <FiMapPin className="text-[#c8a45e] text-2xl" />
              <span className="font-bold">
                {t("contactLocationTitle", "Our Location")}
              </span>
            </div>
            <p className="text-[#09142b] text-base font-medium opacity-90 mb-2">
              {t("contactLocationAddress", "Algiers, Algeria")}
            </p>
            <div className="flex items-center gap-2 text-[#09142b]">
              <FiPhone className="text-[#c8a45e] text-xl" />
              <span className="font-semibold">
                {t("contactPhone", "Phone")}:{" "}
              </span>
              <span dir="ltr">+213 555 123 456</span>
            </div>
            <div className="flex items-center gap-2 text-[#09142b]">
              <FiMail className="text-[#c8a45e] text-xl" />
              <span className="font-semibold">
                {t("contactEmailInfo", "Email")}:{" "}
              </span>
              <span dir="ltr">info@soslaw.com</span>
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
                className="font-semibold text-[#09142b] flex items-center gap-2"
              >
                <FiUser className="text-[#c8a45e]" /> {t("contactName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8]"
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
                className="font-semibold text-[#09142b] flex items-center gap-2"
              >
                <FiMail className="text-[#c8a45e]" /> {t("contactEmail")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8]"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder={t("contactEmail")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-semibold text-[#09142b] flex items-center gap-2"
              >
                <FiMessageCircle className="text-[#c8a45e]" />{" "}
                {t("contactMessage")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="rounded-lg border border-[#e7cfa7] px-4 py-3 focus:ring-2 focus:ring-[#c8a45e] focus:outline-none text-[#09142b] bg-white placeholder-[#b8b8b8] resize-none"
                value={form.message}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder={t("contactMessage")}
              />
            </div>
            <button
              type="submit"
              className={`mt-2 w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8a45e] ${
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
                <FiCheckCircle className="text-green-600 text-xl" />
                <span>{t("contactSuccess")}</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-2">
                <FiAlertCircle className="text-red-600 text-xl" />
                <span>{t("contactError")}</span>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
