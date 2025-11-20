import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import passwordResetService from "../services/passwordResetService";
import Logo from "../components/Logo";

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Verify token mutation
  const verifyTokenMutation = useMutation({
    mutationFn: passwordResetService.verifyResetToken,
    onSuccess: () => {
      setIsTokenValid(true);
      setError("");
    },
    onError: (error) => {
      setIsTokenValid(false);
      setError(
        error.response?.data?.message ||
          t("invalidToken", "Invalid or expired reset token")
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }) =>
      passwordResetService.resetPassword(token, newPassword),
    onSuccess: (data) => {
      setMessage(data.message);
      setTimeout(() => {
        navigate("/auth", {
          state: {
            message: t(
              "passwordResetSuccess",
              "Password reset successfully! Please login with your new password."
            ),
          },
        });
      }, 2000);
    },
    onError: (error) => {
      setError(
        error.response?.data?.message ||
          t("resetPasswordError", "Failed to reset password. Please try again.")
      );
    },
  });

  // Verify token on component mount
  useEffect(() => {
    if (token) {
      verifyTokenMutation.mutate(token);
    } else {
      setIsTokenValid(false);
      setError(t("noToken", "No reset token provided"));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError(t("passwordRequired", "Password is required"));
      return;
    }

    if (newPassword.length < 6) {
      setError(
        t("passwordMinLength", "Password must be at least 6 characters")
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch", "Passwords do not match"));
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword });
  };

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a45e] mx-auto mb-4"></div>
          <p className="text-[#6b7280]">
            {t("verifyingToken", "Verifying reset token...")}
          </p>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <Logo size="large" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-[#e7cfa7] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-bold text-[#09142b] mb-2 text-2xl">
              {t("invalidToken", "Invalid Token")}
            </h1>
            <p className="text-[#6b7280] mb-6">{error}</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-[#c8a45e] hover:text-[#b8944a] transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              {t("requestNewReset", "Request New Reset Link")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("resetPasswordTitle", "Reset Password - SOS Law")}</title>
        <meta
          name="description"
          content={t(
            "resetPasswordDescription",
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-4">
                <FiLock className="w-8 h-8 text-white" />
              </div>
              <h1
                className={`font-bold text-[#09142b] mb-2 ${
                  isRTL ? "text-2xl md:text-3xl" : "text-3xl"
                }`}
              >
                {t("resetPasswordTitle", "Reset Password")}
              </h1>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t(
                  "resetPasswordDescription",
                  "Enter your new password below."
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  className={`block text-[#09142b] font-semibold mb-2 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  {t("newPassword", "New Password")} *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t(
                      "newPasswordPlaceholder",
                      "Enter new password"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  className={`block text-[#09142b] font-semibold mb-2 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  {t("confirmPassword", "Confirm Password")} *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t(
                      "confirmPasswordPlaceholder",
                      "Confirm new password"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#09142b] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-[#c8a45e] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#b8944a] focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {resetPasswordMutation.isPending
                  ? t("resetting", "Resetting...")
                  : t("resetPassword", "Reset Password")}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
