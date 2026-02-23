import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/useAuth.js";
import { useLogin, useRegister } from "../hooks/useAuthMutations";
import EmailVerification from "../components/auth/EmailVerification";
import Logo from "../components/Logo";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiX,
  FiHome,
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
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      if (
        user.role === "admin" ||
        user.role === "consultant" ||
        user.role === "support"
      ) {
        navigate("/dashboard");
      } else {
        navigate(from);
      }
    }
  }, [isAuthenticated, user, navigate, location.state?.from?.pathname]);

  // Handle email verification success
  const handleEmailVerificationSuccess = (verificationData) => {
    setShowEmailVerification(false);
    setPendingEmail("");
    // User can now login
    setIsLogin(true);
    setFormError("");
    // Redirect to home with verification success message
    navigate("/", {
      state: {
        message:
          "تم تأكيد البريد الإلكتروني بنجاح! يمكنك الآن استخدام جميع خدماتنا.",
      },
    });
  };

  const handleEmailVerificationResend = () => {
    setFormError("");
    toast.success("تم إعادة إرسال بريد التأكيد.");
  };

  // Redirect if already authenticated
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Clear errors when switching between login/register
  useEffect(() => {
    setFormError("");
    setFieldErrors({});
    clearError();
  }, [isLogin, clearError]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("جميع الحقول مطلوبة");
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!formData.fullName || !formData.phoneNumber) {
        setFormError("جميع الحقول مطلوبة");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setFieldErrors({ confirmPassword: "كلمة المرور غير متطابقة" });
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Login
        const result = await loginMutation.mutateAsync({
          email: formData.email, // Use original email
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
          email: formData.email, // Use original email
          password: formData.password,
        });

        if (result.success) {
          // Show email verification step
          setPendingEmail(formData.email);
          setShowEmailVerification(true);
        } else {
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
          newFieldErrors[err.field] = err.message;
        });
        setFieldErrors(newFieldErrors);
      } else {
        setFormError(
          error.response?.data?.message ||
            (isLogin ? "فشل في تسجيل الدخول" : "فشل في إنشاء الحساب")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || "";
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName) => {
    return !!fieldErrors[fieldName];
  };

  // If email verification is showing, show that instead
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] flex items-center justify-center px-4 py-8">
        <EmailVerification
          email={pendingEmail}
          onVerificationSuccess={handleEmailVerificationSuccess}
          onResend={handleEmailVerificationResend}
        />
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border bg-white py-3.5 text-slate-800 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40 focus:border-[#c8a45e] text-right";
  const inputError = "border-red-400 bg-red-50/50";
  const inputNormal = "border-slate-200 pr-11 pl-4";

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

      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#09142b]"
        dir="rtl"
      >
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#c8a45e] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1e3a5f] rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Back to home */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition"
          >
            <FiHome className="h-4 w-4" />
            العودة للرئيسية
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white shadow-2xl overflow-hidden">
            {/* Tab switcher */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-[#09142b] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-[#09142b] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            <div className="p-8 sm:p-12">
              <div className="mb-6 flex justify-center">
                <Logo size="large" />
              </div>
              <p className="text-center text-slate-600 text-sm mb-6">
                {isLogin
                  ? "أدخل بريدك وكلمة المرور للوصول إلى حسابك"
                  : "املأ البيانات لإنشاء حسابك والاستفادة من الخدمات"}
              </p>

              {formError && (
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
                  <FiX className="h-5 w-5 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {t("authFullName", "الاسم الكامل")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`${inputBase} ${hasFieldError("fullName") ? inputError : inputNormal}`}
                          placeholder="الاسم الكامل"
                        />
                      </div>
                      {getFieldError("fullName") && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError("fullName")}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        رقم الهاتف <span className="text-slate-400 text-xs">(الجزائر)</span>{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`${inputBase} ${hasFieldError("phoneNumber") ? inputError : inputNormal}`}
                          placeholder="0555123456"
                        />
                      </div>
                      {getFieldError("phoneNumber") && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError("phoneNumber")}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t("authEmail", "البريد الإلكتروني")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${inputBase} ${hasFieldError("email") ? inputError : inputNormal}`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {getFieldError("email") && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError("email")}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t("authPassword", "كلمة المرور")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${inputBase} ${hasFieldError("password") ? inputError : inputNormal}`}
                      placeholder="كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "إخفاء" : "إظهار"}
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {getFieldError("password") && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError("password")}</p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {t("authConfirmPassword", "تأكيد كلمة المرور")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`${inputBase} ${hasFieldError("confirmPassword") ? inputError : inputNormal}`}
                        placeholder="أعد إدخال كلمة المرور"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                        aria-label={showConfirmPassword ? "إخفاء" : "إظهار"}
                      >
                        {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                    {getFieldError("confirmPassword") && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError("confirmPassword")}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#09142b] py-4 font-semibold text-white shadow-lg transition hover:bg-[#0b1a36] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}</span>
                      <FiArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                {isLogin && (
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-[#c8a45e] hover:text-[#09142b] transition"
                    >
                      {t("forgotPassword", "نسيت كلمة المرور؟")}
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
