import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleGoogleAuth = () => {
    // Handle Google authentication here
    console.log("Google authentication initiated");
  };

  return (
    <>
      <Helmet>
        <title>
          {isLogin
            ? t("authLoginTitle", "تسجيل الدخول")
            : t("authRegisterTitle", "إنشاء حساب")}{" "}
          | SOSLAW
        </title>
        <meta
          name="description"
          content={t(
            "authMetaDesc",
            "سجل دخولك أو أنشئ حسابك الجديد في SOSLAW للوصول إلى خدماتنا القانونية المتكاملة"
          )}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] py-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#e7cfa7] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isLogin
              ? t("authLoginTitle", "تسجيل الدخول")
              : t("authRegisterTitle", "إنشاء حساب")}
          </h1>
          <p className="text-[#e7cfa7] text-lg md:text-xl max-w-2xl mx-auto">
            {isLogin
              ? t(
                  "authLoginDesc",
                  "سجل دخولك للوصول إلى خدماتنا القانونية المتكاملة"
                )
              : t(
                  "authRegisterDesc",
                  "أنشئ حسابك الجديد واستفد من خبرتنا القانونية"
                )}
          </p>
        </div>
      </section>

      {/* Auth Form Section */}
      <section className="w-full bg-[#faf6f0] py-16 px-4 md:px-8">
        <div className="max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="bg-white rounded-2xl p-2 mb-8 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-[#09142b] text-white shadow-md"
                    : "text-[#6b7280] hover:text-[#09142b]"
                }`}
              >
                {t("authLogin", "تسجيل الدخول")}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-[#09142b] text-white shadow-md"
                    : "text-[#6b7280] hover:text-[#09142b]"
                }`}
              >
                {t("authRegister", "إنشاء حساب")}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e7cfa7]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Authentication Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-[#e7cfa7] rounded-xl font-semibold text-[#09142b] hover:bg-[#faf6f0] transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <FcGoogle size={20} />
                  <span>
                    {isLogin
                      ? t("authGoogleSignIn", "تسجيل الدخول بحساب Google")
                      : t("authGoogleSignUp", "إنشاء حساب بحساب Google")}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e7cfa7]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6b7280]">
                      {t("authOrDivider", "أو")}
                    </span>
                  </div>
                </div>
              </div>

              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("authFullName", "الاسم الكامل")}
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "authFullNamePlaceholder",
                          "أدخل اسمك الكامل"
                        )}
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("authPhone", "رقم الهاتف")}
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "authPhonePlaceholder",
                          "أدخل رقم هاتفك"
                        )}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-[#09142b] font-semibold mb-2">
                  {t("authEmail", "البريد الإلكتروني")}
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    placeholder={t(
                      "authEmailPlaceholder",
                      "أدخل بريدك الإلكتروني"
                    )}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#09142b] font-semibold mb-2">
                  {t("authPassword", "كلمة المرور")}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    placeholder={t(
                      "authPasswordPlaceholder",
                      "أدخل كلمة المرور"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-[#09142b] font-semibold mb-2">
                    {t("authConfirmPassword", "تأكيد كلمة المرور")}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "authConfirmPasswordPlaceholder",
                        "أعد إدخال كلمة المرور"
                      )}
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#1a2a4a] hover:to-[#09142b] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLogin
                  ? t("authLoginButton", "تسجيل الدخول")
                  : t("authRegisterButton", "إنشاء حساب")}
              </button>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-center">
                  <a
                    href="#"
                    className="text-[#c8a45e] hover:text-[#09142b] font-medium transition-colors"
                  >
                    {t("authForgotPassword", "نسيت كلمة المرور؟")}
                  </a>
                </div>
              )}

              {/* Terms and Conditions (Register only) */}
              {!isLogin && (
                <div className="text-center text-sm text-[#6b7280]">
                  <p>
                    {t("authTermsText", "بإنشاء الحساب، أنت توافق على")}{" "}
                    <a
                      href="#"
                      className="text-[#c8a45e] hover:text-[#09142b] font-medium"
                    >
                      {t("authTermsLink", "الشروط والأحكام")}
                    </a>{" "}
                    {t("authAnd", "و")}{" "}
                    <a
                      href="#"
                      className="text-[#c8a45e] hover:text-[#09142b] font-medium"
                    >
                      {t("authPrivacyLink", "سياسة الخصوصية")}
                    </a>
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-[#6b7280]">
              {isLogin ? (
                <>
                  {t("authNoAccount", "ليس لديك حساب؟")}{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#c8a45e] hover:text-[#09142b] font-semibold transition-colors"
                  >
                    {t("authCreateAccount", "أنشئ حسابك الآن")}
                  </button>
                </>
              ) : (
                <>
                  {t("authHaveAccount", "لديك حساب بالفعل؟")}{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#c8a45e] hover:text-[#09142b] font-semibold transition-colors"
                  >
                    {t("authSignIn", "سجل دخولك")}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Auth;
