import React, { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import API_BASE_URL from "../config/api.js";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId");
  const checkoutId = searchParams.get("checkout_id");
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!checkoutId || confirmedRef.current) return;
    confirmedRef.current = true;
    fetch(`${API_BASE_URL}/api/v1/chargily/confirm-redirect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(requestId && { requestId: Number(requestId) }),
        checkout_id: checkoutId,
        status: "failure",
      }),
    }).catch(() => {});
  }, [checkoutId, requestId]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <FiAlertCircle className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#09142b] mb-2">
          لم يتم إتمام الدفع
        </h1>
        <p className="text-slate-600 mb-6">
          تم إلغاء العملية أو فشل الدفع. لم يتم حفظ الطلب. يمكنك تقديم طلب جديد عند الاستعداد.
        </p>
        <div className="space-y-3">
          <Link
            to="/request-service/legal-consultation"
            className="block w-full py-3 px-4 rounded-xl bg-[#c8a45e] text-[#09142b] font-medium hover:bg-[#b8944f] transition-colors"
          >
            طلب استشارة جديدة
          </Link>
          <Link
            to="/service-requests"
            className="block w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
