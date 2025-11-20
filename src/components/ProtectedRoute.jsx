import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useTranslation } from "react-i18next";
import EmailVerificationBanner from "./EmailVerificationBanner";
import emailVerificationService from "../services/emailVerificationService";

const ProtectedRoute = ({
  children,
  requireEmailVerification = false,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { i18n } = useTranslation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If email verification is required but user hasn't verified
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <EmailVerificationBanner
            onClose={() => window.history.back()}
            onResend={async () => {
              try {
                await emailVerificationService.sendVerificationEmail(
                  user.email
                );
                // You might want to show a success message here
              } catch (error) {
                console.error("Failed to resend verification email:", error);
              }
            }}
          />
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {(() => {
                const currentLang = i18n.language;
                const path = location.pathname;

                if (path.includes("/request-service")) {
                  return currentLang === "ar"
                    ? "تحتاج إلى تأكيد بريدك الإلكتروني لطلب الخدمات"
                    : currentLang === "fr"
                    ? "Vous devez vérifier votre email pour demander des services"
                    : "You need to verify your email to request services";
                }
                if (path.includes("/contact")) {
                  return currentLang === "ar"
                    ? "تحتاج إلى تأكيد بريدك الإلكتروني للتواصل معنا"
                    : currentLang === "fr"
                    ? "Vous devez vérifier votre email pour nous contacter"
                    : "You need to verify your email to contact us";
                }
                if (path.includes("/join-team")) {
                  return currentLang === "ar"
                    ? "تحتاج إلى تأكيد بريدك الإلكتروني للانضمام إلى فريقنا"
                    : currentLang === "fr"
                    ? "Vous devez vérifier votre email pour rejoindre notre équipe"
                    : "You need to verify your email to join our team";
                }
                return "";
              })()}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              {i18n.language === "ar"
                ? "العودة"
                : i18n.language === "fr"
                ? "Retour"
                : "Go Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
