import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  FiCheck,
  FiX,
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

  // Handle email verification resend
  const handleEmailVerificationResend = () => {
    setFormError("");
    setMessage("تم إعادة إرسال بريد التأكيد.");
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

      {/* Main Auth Container */}
      <div className="min-h-screen bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-[#e7cfa7] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c8a45e] bg-opacity-20 rounded-full blur-3xl"></div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding & Info */}
            <div className="text-center lg:text-right text-white space-y-8">
              <div className="space-y-4">
                <div className="flex justify-center lg:justify-start">
                  <Logo size="large" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  {isLogin
                    ? t("authLoginTitle", "مرحباً بعودتك")
                    : t("authRegisterTitle", "انضم إلينا اليوم")}
                </h1>
                <p className="text-xl text-[#e7cfa7] max-w-md mx-auto lg:mx-0">
                  {isLogin
                    ? t(
                        "authLoginDesc",
                        "سجل دخولك للوصول إلى خدماتنا القانونية المتكاملة"
                      )
                    : t(
                        "authRegisterDesc",
                        "ابدأ رحلتك القانونية معنا واستفد من خبرتنا الواسعة"
                      )}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-center lg:justify-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-[#c8a45e] rounded-full"></div>
                  <span className="text-[#e7cfa7]">
                    استشارات قانونية متخصصة
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-[#c8a45e] rounded-full"></div>
                  <span className="text-[#e7cfa7]">مكتبة قانونية شاملة</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-[#c8a45e] rounded-full"></div>
                  <span className="text-[#e7cfa7]">
                    دعم فني على مدار الساعة
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#09142b] mb-2">
                  {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h2>
                <p className="text-[#6b7280]">
                  {isLogin
                    ? "أدخل بياناتك للوصول إلى حسابك"
                    : "املأ البيانات التالية لإنشاء حسابك"}
                </p>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <FiX className="w-5 h-5 text-red-600 ml-2" />
                  <p className="text-red-800 text-sm">{formError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-[#09142b] font-semibold mb-2 text-right">
                        {t("authFullName", "الاسم الكامل")}
                      </label>
                      <div className="relative">
                        <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pr-10 pl-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 text-right ${
                            hasFieldError("fullName")
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 focus:border-[#c8a45e]"
                          }`}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      {getFieldError("fullName") && (
                        <p className="text-red-500 text-sm mt-1 text-right">
                          {getFieldError("fullName")}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[#09142b] font-semibold mb-2 text-right">
                        <span className="inline-block">رقم الهاتف</span>
                        <span className="text-sm text-[#6b7280] mr-2">
                          (الجزائر فقط)
                        </span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full pr-10 pl-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 text-right ${
                            hasFieldError("phoneNumber")
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 focus:border-[#c8a45e]"
                          }`}
                          placeholder="0555123456"
                        />
                      </div>
                      {getFieldError("phoneNumber") && (
                        <p className="text-red-500 text-sm mt-1 text-right">
                          {getFieldError("phoneNumber")}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[#09142b] font-semibold mb-2 text-right">
                    {t("authEmail", "البريد الإلكتروني")}
                  </label>
                  <div className="relative">
                    <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pr-10 pl-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 text-right ${
                        hasFieldError("email")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-[#c8a45e]"
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {getFieldError("email") && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {getFieldError("email")}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[#09142b] font-semibold mb-2 text-right">
                    {t("authPassword", "كلمة المرور")}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pr-10 pl-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 text-right ${
                        hasFieldError("password")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-[#c8a45e]"
                      }`}
                      placeholder="أدخل كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {getFieldError("password") && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {getFieldError("password")}
                    </p>
                  )}
                </div>

                {/* Confirm Password - Only for registration */}
                {!isLogin && (
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2 text-right">
                      {t("authConfirmPassword", "تأكيد كلمة المرور")}
                    </label>
                    <div className="relative">
                      <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pr-10 pl-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 text-right ${
                          hasFieldError("confirmPassword")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-[#c8a45e]"
                        }`}
                        placeholder="أعد إدخال كلمة المرور"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {getFieldError("confirmPassword") && (
                      <p className="text-red-500 text-sm mt-1 text-right">
                        {getFieldError("confirmPassword")}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#c8a45e] to-[#b8944a] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-[#b8944a] hover:to-[#c8a45e] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 space-x-reverse shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}</span>
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Forgot Password Link - Only show for login */}
                {isLogin && (
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-[#c8a45e] hover:text-[#09142b] font-medium transition-colors text-sm"
                    >
                      {t("forgotPassword", "نسيت كلمة المرور؟")}
                    </Link>
                  </div>
                )}

                {/* Toggle between login/register */}
                <div className="text-center">
                  <p className="text-[#6b7280]">
                    {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#c8a45e] hover:text-[#09142b] font-semibold transition-colors cursor-pointer"
                    >
                      {isLogin ? "أنشئ حسابك الآن" : "سجل دخولك"}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
