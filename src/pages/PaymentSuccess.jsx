import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import API_BASE_URL from "../config/api.js";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const requestIdFromUrl = searchParams.get("requestId");
  const checkoutId = searchParams.get("checkout_id");
  const [receiptRef, setReceiptRef] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "failed"
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!checkoutId || confirmedRef.current) return;
    confirmedRef.current = true;
    fetch(`${API_BASE_URL}/api/v1/chargily/confirm-redirect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(requestIdFromUrl && { requestId: Number(requestIdFromUrl) }),
        checkout_id: checkoutId,
        status: "success",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success === true) {
          setStatus("success");
          if (data.receiptToken) setReceiptRef(data.receiptToken);
          else if (data.requestId) setReceiptRef(String(data.requestId));
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [checkoutId, requestIdFromUrl]);

  const displayRequestId = receiptRef || requestIdFromUrl;

  // Loading: verifying with backend/Chargily
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <FiLoader className="w-10 h-10 text-slate-500 animate-spin" />
          </div>
          <h1 className="text-xl font-bold text-[#09142b] mb-2">جاري التحقق من الدفع...</h1>
          <p className="text-slate-600">يرجى الانتظار.</p>
        </div>
      </div>
    );
  }

  // Backend/Chargily says payment did not succeed
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <FiXCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#09142b] mb-2">الدفع لم يتم</h1>
          <p className="text-slate-600 mb-6">
            لم نتمكن من تأكيد إتمام الدفع. إذا قمت بالدفع، تحقق من طلباتك أو تواصل معنا.
          </p>
          <div className="space-y-3">
            <Link
              to="/service-requests"
              className="block w-full py-3 px-4 rounded-xl bg-[#09142b] text-white font-medium hover:bg-[#0b1a36] transition-colors"
            >
              طلباتي
            </Link>
            <Link
              to="/"
              className="block w-full py-3 px-4 rounded-xl border border-[#09142b] text-[#09142b] font-medium hover:bg-[#09142b]/5 transition-colors"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Confirmed success
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#09142b] mb-2">تم الدفع بنجاح</h1>
        <p className="text-slate-600 mb-6">
          تم استلام دفعتك. سنراجع طلبك ونبدأ العمل عليه في أقرب وقت.
        </p>
        <div className="space-y-3">
          {displayRequestId && (
            <Link
              to={`/payment-details/${encodeURIComponent(displayRequestId)}`}
              className="block w-full py-3 px-4 rounded-xl bg-[#09142b] text-white font-medium hover:bg-[#0b1a36] transition-colors"
            >
              عرض تفاصيل الطلب
            </Link>
          )}
          <Link
            to="/service-requests"
            className="block w-full py-3 px-4 rounded-xl border border-[#09142b] text-[#09142b] font-medium hover:bg-[#09142b]/5 transition-colors"
          >
            طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
