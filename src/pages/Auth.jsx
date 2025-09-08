import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useLogin, useRegister } from "../hooks/useAuthMutations";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, error, clearError } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });

  // Use custom hooks for mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Memoize the redirect logic to prevent infinite re-renders
  const handleRedirect = useCallback(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || "/";

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate(from);
      }
    }
  }, [isAuthenticated, user, navigate, location.state?.from?.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Clear form error when switching between login/register
  useEffect(() => {
    setFormError("");
    setFieldErrors({});
    clearError();
  }, [isLogin, clearError]);

  // Clear form error when auth error changes
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error when user starts typing
    if (formError) {
      setFormError("");
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        // Login
        const result = await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          setFormError(result.error);
        }
      } else {
        // Register
        const result = await registerMutation.mutateAsync({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          setFormError(result.error);
        }
      }
    } catch (error) {
      // Handle backend validation errors
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const newFieldErrors = {};
        error.response.data.errors.forEach((err) => {
          if (err.field && err.message) {
            newFieldErrors[err.field] = err.message;
          }
        });
        setFieldErrors(newFieldErrors);

        // Set general error message if there's one
        if (error.response.data.message) {
          setFormError(error.response.data.message);
        }
      } else {
        setFormError(error.message || "An error occurred");
      }
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || "";
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName) => {
    return !!fieldErrors[fieldName];
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

          {/* General Error Message */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {formError}
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e7cfa7]">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                          hasFieldError("fullName")
                            ? "border-red-300 focus:ring-red-500"
                            : "border-[#e7cfa7]"
                        }`}
                        placeholder={t(
                          "authFullNamePlaceholder",
                          "أدخل اسمك الكامل"
                        )}
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                    {hasFieldError("fullName") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("fullName")}
                      </p>
                    )}
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
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                          hasFieldError("phoneNumber")
                            ? "border-red-300 focus:ring-red-500"
                            : "border-[#e7cfa7]"
                        }`}
                        placeholder={t(
                          "authPhonePlaceholder",
                          "أدخل رقم هاتفك"
                        )}
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                    {hasFieldError("phoneNumber") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("phoneNumber")}
                      </p>
                    )}
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                      hasFieldError("email")
                        ? "border-red-300 focus:ring-red-500"
                        : "border-[#e7cfa7]"
                    }`}
                    placeholder={t(
                      "authEmailPlaceholder",
                      "أدخل بريدك الإلكتروني"
                    )}
                    required
                    disabled={isLoading}
                  />
                </div>
                {hasFieldError("email") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("email")}
                  </p>
                )}
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                      hasFieldError("password")
                        ? "border-red-300 focus:ring-red-500"
                        : "border-[#e7cfa7]"
                    }`}
                    placeholder={t(
                      "authPasswordPlaceholder",
                      "أدخل كلمة المرور"
                    )}
                    required
                    disabled={isLoading}
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
                {hasFieldError("password") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("password")}
                  </p>
                )}
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                        hasFieldError("confirmPassword")
                          ? "border-red-300 focus:ring-red-500"
                          : "border-[#e7cfa7]"
                      }`}
                      placeholder={t(
                        "authConfirmPasswordPlaceholder",
                        "أعد إدخال كلمة المرور"
                      )}
                      required={!isLogin}
                      disabled={isLoading}
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
                  {hasFieldError("confirmPassword") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("confirmPassword")}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform shadow-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white hover:from-[#1a2a4a] hover:to-[#09142b] hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin
                      ? t("authLoggingIn", "جاري تسجيل الدخول...")
                      : t("authCreatingAccount", "جاري إنشاء الحساب...")}
                  </div>
                ) : isLogin ? (
                  t("authLoginButton", "تسجيل الدخول")
                ) : (
                  t("authRegisterButton", "إنشاء حساب")
                )}
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
