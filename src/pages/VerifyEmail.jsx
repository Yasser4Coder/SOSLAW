import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import emailVerificationService from "../services/emailVerificationService";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setError("رمز التأكيد غير صحيح");
      setIsLoading(false);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const result = await emailVerificationService.verifyEmail(
        verificationToken
      );

      if (result.success) {
        setIsSuccess(true);
        setMessage(
          "تم تأكيد البريد الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول."
        );

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/auth", {
            state: { message: "تم تأكيد البريد الإلكتروني بنجاح!" },
          });
        }, 3000);
      } else {
        setError(result.message || "فشل في تأكيد البريد الإلكتروني");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "حدث خطأ أثناء تأكيد البريد الإلكتروني"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/auth", {
      state: { message: "تم تأكيد البريد الإلكتروني بنجاح!" },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-[#c8a45e] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiRefreshCw className="w-8 h-8 text-[#c8a45e] animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-[#09142b] mb-2">
            جاري تأكيد البريد الإلكتروني...
          </h2>
          <p className="text-[#6b7280]">
            يرجى الانتظار بينما نؤكد بريدك الإلكتروني
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>تأكيد البريد الإلكتروني | SOSLAW</title>
        <meta name="description" content="تأكيد البريد الإلكتروني لـ SOSLAW" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#e7cfa7] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center relative z-10">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#09142b] mb-2">
                تم التأكيد بنجاح!
              </h2>
              <p className="text-[#6b7280] mb-6">{message}</p>
              <button
                onClick={handleGoToLogin}
                className="w-full bg-[#c8a45e] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-[#b8944a]"
              >
                الذهاب إلى تسجيل الدخول
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#09142b] mb-2">
                فشل في التأكيد
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-gray-100 text-[#6b7280] py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200"
              >
                العودة إلى صفحة تسجيل الدخول
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
