import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import api from "../services/api";

const ShopOrderResult = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const isSuccess = window.location.pathname.toLowerCase().includes("success");
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderId) {
      setStatus("done");
      setMessage(isSuccess ? "لم يتم العثور على رقم الطلب." : "لم يتم العثور على رقم الطلب.");
      return;
    }
    const statusValue = isSuccess ? "success" : "failure";
    api
      .post("/api/v1/chargily/confirm-redirect", {
        orderId,
        status: statusValue,
      })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setStatus("done");
          setMessage(
            isSuccess
              ? "تم تأكيد الدفع بنجاح. سنتواصل معك قريباً بخصوص الطلب."
              : "تم تسجيل فشل الدفع أو إلغاؤه."
          );
        } else {
          setStatus("error");
          setMessage(data.message || "حدث خطأ أثناء التأكيد.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || err.message || "حدث خطأ في الاتصال.");
      });
  }, [orderId, isSuccess]);

  return (
    <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#e7cfa7] p-8 text-center">
        {status === "loading" && (
          <>
            <FiLoader className="w-16 h-16 mx-auto text-[#09142b] animate-spin mb-4" />
            <p className="text-[#4b5563]">جاري التأكيد...</p>
          </>
        )}
        {status === "done" && (
          <>
            {isSuccess ? (
              <FiCheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            ) : (
              <FiXCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            )}
            <h1 className="text-xl font-bold text-[#09142b] mb-2">
              {isSuccess ? "شكراً لك" : "لم يتم إتمام الدفع"}
            </h1>
            <p className="text-[#4b5563] mb-6">{message}</p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-4">رقم الطلب: {orderId}</p>
        )}
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
            >
              العودة إلى المتجر
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <FiXCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-[#09142b] mb-2">حدث خطأ</h1>
            <p className="text-[#4b5563] mb-6">{message}</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
            >
              العودة إلى المتجر
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default ShopOrderResult;
