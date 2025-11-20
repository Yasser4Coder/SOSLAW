import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import passwordResetService from "../services/passwordResetService";
import Logo from "../components/Logo";

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send password reset email mutation
  const sendResetEmailMutation = useMutation({
    mutationFn: passwordResetService.sendPasswordResetEmail,
    onSuccess: (data) => {
      setMessage(data.message);
      setIsSubmitted(true);
      setError("");
      setCountdown(300); // 5 minutes cooldown (300 seconds)
    },
    onError: (error) => {
      setError(
        error.response?.data?.message ||
          t(
            "forgotPasswordError",
            "Failed to send reset email. Please try again."
          )
      );
      setMessage("");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t("emailRequired", "Email is required"));
      return;
    }
    sendResetEmailMutation.mutate(email);
  };

  const handleResend = () => {
    if (email && countdown === 0) {
      sendResetEmailMutation.mutate(email);
    }
  };

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("forgotPasswordTitle", "Forgot Password - SOS Law")}</title>
        <meta
          name="description"
          content={t(
            "forgotPasswordDescription",
            "Reset your password for SOS Law account"
          )}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <Logo size="large" />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#e7cfa7] p-8">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-4">
                    <FiMail className="w-8 h-8 text-white" />
                  </div>
                  <h1
                    className={`font-bold text-[#09142b] mb-2 ${
                      isRTL ? "text-2xl md:text-3xl" : "text-3xl"
                    }`}
                  >
                    {t("forgotPasswordTitle", "Forgot Password?")}
                  </h1>
                  <p
                    className={`text-[#6b7280] ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t(
                      "forgotPasswordDescription",
                      "Enter your email address and we'll send you a link to reset your password."
                    )}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      className={`block text-[#09142b] font-semibold mb-2 ${
                        isRTL ? "text-sm md:text-base" : "text-base"
                      }`}
                    >
                      {t("email", "Email Address")} *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        placeholder={t(
                          "emailPlaceholder",
                          "Enter your email address"
                        )}
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sendResetEmailMutation.isPending}
                    className="w-full bg-[#c8a45e] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#b8944a] focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {sendResetEmailMutation.isPending
                      ? t("sending", "Sending...")
                      : t("sendResetLink", "Send Reset Link")}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-6">
                  <Link
                    to="/auth"
                    className={`inline-flex items-center gap-2 text-[#c8a45e] hover:text-[#b8944a] transition-colors ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    {t("backToLogin", "Back to Login")}
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1
                    className={`font-bold text-[#09142b] mb-2 ${
                      isRTL ? "text-2xl md:text-3xl" : "text-3xl"
                    }`}
                  >
                    {t("emailSent", "Email Sent!")}
                  </h1>
                  <p
                    className={`text-[#6b7280] mb-6 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {message ||
                      t(
                        "resetEmailSent",
                        "We've sent a password reset link to your email address."
                      )}
                  </p>

                  {/* Resend Button */}
                  <button
                    onClick={handleResend}
                    disabled={sendResetEmailMutation.isPending || countdown > 0}
                    className="w-full bg-[#c8a45e] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#b8944a] focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-4"
                  >
                    {sendResetEmailMutation.isPending
                      ? t("sending", "Sending...")
                      : countdown > 0
                      ? t("resendCooldown", "Resend Email ({{time}})", {
                          time: `${Math.floor(countdown / 60)}:${(
                            countdown % 60
                          )
                            .toString()
                            .padStart(2, "0")}`,
                        })
                      : t("resendEmail", "Resend Email")}
                  </button>

                  {/* Back to Login */}
                  <Link
                    to="/auth"
                    className={`inline-flex items-center gap-2 text-[#c8a45e] hover:text-[#b8944a] transition-colors ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    {t("backToLogin", "Back to Login")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
