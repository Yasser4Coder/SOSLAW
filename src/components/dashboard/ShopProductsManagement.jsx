import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiImage,
  FiX,
  FiLoader,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import * as shopService from "../../services/shopService";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "print", label: "كتاب ورقي" },
  { id: "digital", label: "كتاب رقمي (PDF)" },
  { id: "tools", label: "أدوات وموارد" },
];

const ShopProductsManagement = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    titleAr: "",
    titleEn: "",
    titleFr: "",
    descAr: "",
    longDescAr: "",
    price: "",
    originalPrice: "",
    badge: "",
    currency: "DZD",
    category: "print",
    meta: [],
    images: [],
    isActive: true,
    orderIndex: 0,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["adminShopProducts"],
    queryFn: () => shopService.adminListProducts(),
  });

  const createMutation = useMutation({
    mutationFn: (body) => shopService.adminCreateProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminShopProducts"] });
      toast.success("تم إضافة المنتج بنجاح");
      closeForm();
    },
    onError: (e) => toast.error(e.message || "فشل في الإضافة"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => shopService.adminUpdateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminShopProducts"] });
      toast.success("تم تحديث المنتج بنجاح");
      closeForm();
    },
    onError: (e) => toast.error(e.message || "فشل في التحديث"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => shopService.adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminShopProducts"] });
      toast.success("تم حذف المنتج");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message || "فشل في الحذف"),
  });

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      slug: "",
      titleAr: "",
      titleEn: "",
      titleFr: "",
      descAr: "",
      longDescAr: "",
      price: "",
      originalPrice: "",
      badge: "",
      currency: "DZD",
      category: "print",
      meta: [],
      images: [],
      isActive: true,
      orderIndex: 0,
    });
  }

  function openEdit(product) {
    setEditingProduct(product);
    setFormData({
      slug: product.slug || "",
      titleAr: product.titleAr || "",
      titleEn: product.titleEn || "",
      titleFr: product.titleFr || "",
      descAr: product.descAr || "",
      longDescAr: product.longDescAr || "",
      price: product.price != null ? String(product.price) : "",
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
      badge: product.badge || "",
      currency: product.currency || "DZD",
      category: product.category || "print",
      meta: Array.isArray(product.meta) ? [...product.meta] : [],
      images: shopService.normalizeShopImages(product.images),
      isActive: product.isActive !== false,
      orderIndex: product.orderIndex ?? 0,
    });
    setShowForm(true);
  }

  async function handleImageSelect(e) {
    const file = e.target?.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة صالحة");
      return;
    }
    setUploadingImage(true);
    try {
      const path = await shopService.adminUploadShopImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), path],
      }));
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error(err.message || "فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function removeImage(index) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function moveImage(index, direction) {
    const arr = [...(formData.images || [])];
    const next = direction === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= arr.length) return;
    [arr[index], arr[next]] = [arr[next], arr[index]];
    setFormData((prev) => ({ ...prev, images: arr }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      orderIndex: Number(formData.orderIndex) || 0,
    };
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const metaLines = Array.isArray(formData.meta) ? formData.meta.join("\n") : "";
  const images = formData.images || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة منتجات المتجر</h1>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              slug: "",
              titleAr: "",
              titleEn: "",
              titleFr: "",
              descAr: "",
              longDescAr: "",
              price: "",
              originalPrice: "",
              badge: "",
              currency: "DZD",
              category: "print",
              meta: [],
              images: [],
              isActive: true,
              orderIndex: 0,
            });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1b2742]"
        >
          <FiPlus className="ml-2" />
          إضافة منتج
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-[#09142b]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">صورة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفئة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    لا توجد منتجات. أضف منتجاً من الزر أعلاه.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const thumb = shopService.normalizeShopImages(p.images)[0];
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        {thumb ? (
                          <img
                            src={shopService.getShopImageUrl(thumb)}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.titleAr}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {CATEGORIES.find((c) => c.id === p.category)?.label || p.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.price} {p.currency}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-[#09142b] hover:bg-gray-100 rounded"
                          title="تعديل"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded mr-1"
                          title="حذف"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button type="button" onClick={closeForm} className="p-1 hover:bg-gray-100 rounded">
                <FiX size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {editingProduct && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">الرابط (slug)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">يُعرض للقراءة فقط. الرابط يُولَّد تلقائياً من العنوان عند الإضافة.</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (عربي) *</label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData((p) => ({ ...p, titleAr: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف المختصر (عربي)</label>
                <textarea
                  value={formData.descAr}
                  onChange={(e) => setFormData((p) => ({ ...p, descAr: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف الطويل (عربي)</label>
                <textarea
                  value={formData.longDescAr}
                  onChange={(e) => setFormData((p) => ({ ...p, longDescAr: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر الحالي *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="يُعرض مشطوباً بجانب السعر الحالي"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شارة العرض (اختياري)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="مثال: عرض رمضان، خصم 20%"
                  maxLength={80}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الصور</label>
                <p className="text-xs text-gray-500 mb-2">
                  الصورة الأولى = صورة المصغرة (قائمة المتجر). جميع الصور تظهر في صفحة تفاصيل المنتج. استخدم الأسهم لترتيب الصور.
                </p>
                <div className="flex flex-wrap gap-3 mb-2">
                  {images.map((path, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={shopService.getShopImageUrl(path)}
                        alt=""
                        className="w-20 h-20 object-cover rounded border-2 border-gray-200"
                      />
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#09142b] text-white text-[10px] text-center py-0.5 rounded-b">
                          مصغرة
                        </span>
                      )}
                      <div className="absolute -top-1 -right-1 flex gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveImage(i, "up")}
                          disabled={i === 0}
                          className="bg-white border rounded p-0.5 shadow hover:bg-gray-50 disabled:opacity-40"
                          title="للأعلى"
                        >
                          <FiArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, "down")}
                          disabled={i === images.length - 1}
                          className="bg-white border rounded p-0.5 shadow hover:bg-gray-50 disabled:opacity-40"
                          title="للأسفل"
                        >
                          <FiArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="bg-red-500 text-white rounded p-0.5"
                          title="حذف"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  <FiImage className="ml-2" />
                  {uploadingImage ? "جاري الرفع..." : "إضافة صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بيانات إضافية (سطر لكل بند)</label>
                <p className="text-xs text-gray-500 mb-1">
                  اكتب كل معلومة في سطر منفصل؛ يمكنك استخدام مسافات وفواصل داخل السطر.
                </p>
                <textarea
                  value={metaLines}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      meta: e.target.value
                        ? e.target.value
                            .split(/\r?\n/)
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : [],
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                  rows={4}
                  placeholder={"320 صفحة\nلغة: العربية\nمستوى: ممارس"}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  <span className="text-sm">منتج نشط (يظهر في المتجر)</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm">ترتيب:</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData((p) => ({ ...p, orderIndex: e.target.value }))}
                    className="w-20 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={closeForm} className="px-4 py-2 border rounded-lg">
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1b2742] disabled:opacity-50"
                >
                  {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف المنتج "${deleteTarget?.titleAr}"؟`}
        confirmText="حذف"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ShopProductsManagement;
