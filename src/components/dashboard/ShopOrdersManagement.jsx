import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiShoppingCart,
  FiFilter,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import * as shopService from "../../services/shopService";

const STATUS_LABELS = {
  pending_payment: "في انتظار الدفع",
  paid: "مدفوع",
  failed: "فشل",
  cancelled: "ملغى",
};

const STATUS_CLASS = {
  pending_payment: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const ShopOrdersManagement = () => {
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminShopOrders", statusFilter],
    queryFn: () =>
      shopService.adminListOrders({
        status: statusFilter || undefined,
        limit: 100,
      }),
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">مبيعات المتجر</h1>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">كل الحالات</option>
            <option value="pending_payment">في انتظار الدفع</option>
            <option value="paid">مدفوع</option>
            <option value="failed">فشل</option>
            <option value="cancelled">ملغى</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-[#09142b]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المنتج
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    العميل
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <FiShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      لا توجد طلبات حتى الآن.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.product?.titleAr || `#${order.productId}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          الكمية: {order.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <FiUser size={14} />
                          {order.clientName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <FiMail size={12} />
                          {order.clientEmail}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FiPhone size={12} />
                          {order.clientPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {order.amount} {order.currency}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            STATUS_CLASS[order.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status === "paid" && <FiCheckCircle size={12} />}
                          {order.status === "failed" && <FiXCircle size={12} />}
                          {order.status === "pending_payment" && <FiClock size={12} />}
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("ar-DZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {total > 0 && (
            <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 border-t">
              إجمالي النتائج: {total}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopOrdersManagement;
