import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import emailVerificationService from "../../services/emailVerificationService";

const EmailVerification = ({ email, onVerificationSuccess, onResend }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Normalize email for display
  const normalizedEmail = email; // Use original email

  useEffect(() => {
    // Auto-send verification email when component mounts
    sendVerificationEmail();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await emailVerificationService.sendVerificationEmail(
        normalizedEmail
      );

      if (result.success) {
        setMessage(
          "تم إرسال بريد التأكيد بنجاح. يرجى التحقق من بريدك الإلكتروني."
        );
        setCountdown(60); // 60 seconds cooldown
      } else {
        setError(result.message || "فشل في إرسال بريد التأكيد");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "حدث خطأ أثناء إرسال بريد التأكيد"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const result = await emailVerificationService.resendVerificationEmail(
        normalizedEmail
      );

      if (result.success) {
        setMessage("تم إعادة إرسال بريد التأكيد بنجاح.");
        setCountdown(60); // 60 seconds cooldown
        if (onResend) onResend();
      } else {
        setError(result.message || "فشل في إعادة إرسال بريد التأكيد");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "حدث خطأ أثناء إعادة إرسال بريد التأكيد"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await emailVerificationService.checkVerificationStatus(
        normalizedEmail
      );

      if (result.success && result.data.isEmailVerified) {
        setMessage("تم تأكيد البريد الإلكتروني بنجاح!");
        if (onVerificationSuccess) {
          onVerificationSuccess(result.data);
        }
      } else {
        setError(
          "البريد الإلكتروني لم يتم تأكيده بعد. يرجى النقر على الرابط في بريدك الإلكتروني."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "حدث خطأ أثناء التحقق من حالة التأكيد"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#c8a45e] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiMail className="w-8 h-8 text-[#c8a45e]" />
        </div>
        <h2 className="text-2xl font-bold text-[#09142b] mb-2">
          تأكيد البريد الإلكتروني
        </h2>
        <p className="text-[#6b7280] text-sm">تم إرسال رابط التأكيد إلى</p>
        <p className="text-[#09142b] font-semibold mt-1">{email}</p>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FiCheckCircle className="w-5 h-5 text-green-600 ml-2" />
          <p className="text-green-800 text-sm">{message}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-600 ml-2" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-[#09142b] mb-2">خطوات التأكيد:</h3>
        <ol className="text-sm text-[#6b7280] space-y-1 list-decimal list-inside">
          <li>تحقق من بريدك الإلكتروني</li>
          <li>ابحث عن رسالة من SOS Law</li>
          <li>انقر على رابط التأكيد</li>
          <li>ارجع إلى هذه الصفحة واضغط "تحقق من التأكيد"</li>
        </ol>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckVerification}
          disabled={isLoading}
          className="w-full bg-[#c8a45e] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-[#b8944a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <FiRefreshCw className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <FiCheckCircle className="w-5 h-5 ml-2" />
          )}
          تحقق من التأكيد
        </button>

        <button
          onClick={handleResend}
          disabled={isResending || countdown > 0}
          className="w-full bg-gray-100 text-[#6b7280] py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isResending ? (
            <FiRefreshCw className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <FiMail className="w-5 h-5 ml-2" />
          )}
          {countdown > 0 ? `إعادة إرسال (${countdown}ث)` : "إعادة إرسال"}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#6b7280]">
          لم تستلم البريد؟ تحقق من مجلد الرسائل المزعجة
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
