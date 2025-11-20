import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiMail, FiX, FiAlertCircle } from "react-icons/fi";

const EmailVerificationBanner = ({ onClose, onResend }) => {
  const { t, i18n } = useTranslation();
  const [isResending, setIsResending] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Cooldown timer effect
  useEffect(() => {
    let interval;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await onResend();
      // Start 5-minute cooldown (300 seconds)
      setCooldownTime(300);
      setCanResend(false);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getMessage = () => {
    const currentLang = i18n.language;

    switch (currentLang) {
      case "ar":
        return {
          title: "تحقق من بريدك الإلكتروني",
          message:
            "يرجى تأكيد بريدك الإلكتروني للوصول إلى جميع خدماتنا القانونية",
          resend: "إعادة إرسال",
          close: "إغلاق",
        };
      case "fr":
        return {
          title: "Vérifiez votre email",
          message:
            "Veuillez confirmer votre adresse email pour accéder à tous nos services juridiques",
          resend: "Renvoyer",
          close: "Fermer",
        };
      default: // 'en'
        return {
          title: "Verify Your Email",
          message:
            "Please confirm your email address to access all our legal services",
          resend: "Resend",
          close: "Close",
        };
    }
  };

  const messages = getMessage();

  return (
    <div className="bg-gradient-to-r from-[#c8a45e] to-[#b8944a] text-white p-4 rounded-lg shadow-lg mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 space-x-reverse">
          <FiAlertCircle className="w-6 h-6 text-white mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg px-4 mb-1">
              {messages.title}
            </h3>
            <p className="text-sm opacity-90 mb-3 px-4">{messages.message}</p>
            <div className="flex gap-4 space-x-4 space-x-reverse">
              <button
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isResending
                  ? "..."
                  : !canResend
                  ? `${messages.resend} (${formatTime(cooldownTime)})`
                  : messages.resend}
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                {messages.close}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors ml-2 cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
