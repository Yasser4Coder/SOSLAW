import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiImage,
} from "react-icons/fi";
import * as courseService from "../../services/courseService";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const TYPES = [
  { id: "training", label: "دورة تدريبية" },
  { id: "voice", label: "دورة صوتية" },
  { id: "conference", label: "مؤتمر" },
  { id: "general", label: "عام" },
];

const emptyForm = () => ({
  titleAr: "",
  summaryAr: "",
  bodyAr: "",
  type: "training",
  image: "",
  isFree: true,
  price: "",
  currency: "DZD",
  dateLabel: "",
  timeLabel: "",
  locationLabel: "",
  registrationUrl: "",
  isActive: true,
  orderIndex: 0,
});

const CoursesManagement = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [uploading, setUploading] = useState(false);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: () => courseService.adminListCourses(),
  });

  const createMut = useMutation({
    mutationFn: (body) => courseService.adminCreateCourse(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
      toast.success("تم إضافة الدورة");
      closeForm();
    },
    onError: (e) => toast.error(e.message || "فشل الإضافة"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }) => courseService.adminUpdateCourse(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
      toast.success("تم التحديث");
      closeForm();
    },
    onError: (e) => toast.error(e.message || "فشل التحديث"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => courseService.adminDeleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["publicCourses"] });
      toast.success("تم الحذف");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message || "فشل الحذف"),
  });

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm());
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      titleAr: c.titleAr || "",
      summaryAr: c.summaryAr || "",
      bodyAr: c.bodyAr || "",
      type: c.type || "general",
      image: c.image || "",
      isFree: c.isFree !== false,
      price: c.price != null ? String(c.price) : "",
      currency: c.currency || "DZD",
      dateLabel: c.dateLabel || "",
      timeLabel: c.timeLabel || "",
      locationLabel: c.locationLabel || "",
      registrationUrl: c.registrationUrl || "",
      isActive: c.isActive !== false,
      orderIndex: c.orderIndex ?? 0,
    });
    setShowForm(true);
  }

  async function onPickImage(e) {
    const file = e.target?.files?.[0];
    if (!file?.type?.startsWith("image/")) return;
    setUploading(true);
    try {
      const path = await courseService.adminUploadCourseImage(file);
      setForm((f) => ({ ...f, image: path }));
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error(err.message || "فشل الرفع");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function submit(e) {
    e.preventDefault();
    const body = {
      ...form,
      price: form.isFree ? null : Number(form.price) || 0,
      orderIndex: Number(form.orderIndex) || 0,
    };
    if (editing) updateMut.mutate({ id: editing.id, body });
    else createMut.mutate(body);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الدورات والتكوين</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(emptyForm());
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-[#09142b] text-white rounded-lg"
        >
          <FiPlus className="ml-2" />
          إضافة دورة
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-[#09142b]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">العنوان</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">النوع</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">السعر</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">نشط</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-3 py-2 text-sm font-medium">{c.titleAr}</td>
                  <td className="px-3 py-2 text-sm">{TYPES.find((t) => t.id === c.type)?.label}</td>
                  <td className="px-3 py-2 text-sm">{c.isFree ? "مجاني" : `${c.price} ${c.currency}`}</td>
                  <td className="px-3 py-2 text-sm">{c.isActive ? "نعم" : "لا"}</td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => openEdit(c)} className="p-1 text-[#09142b]">
                      <FiEdit2 />
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(c)} className="p-1 text-red-600 mr-1">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editing ? "تعديل الدورة" : "دورة جديدة"}</h2>
              <button type="button" onClick={closeForm}>
                <FiX size={22} />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 text-sm">
              <div>
                <label className="block font-medium mb-1">العنوان (عربي) *</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={form.titleAr}
                  onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">النوع</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">ملخص قصير</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  value={form.summaryAr}
                  onChange={(e) => setForm((f) => ({ ...f, summaryAr: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">وصف كامل</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={4}
                  value={form.bodyAr}
                  onChange={(e) => setForm((f) => ({ ...f, bodyAr: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))}
                  />
                  تسجيل مجاني
                </label>
              </div>
              {!form.isFree && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium mb-1">السعر</label>
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">العملة</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={form.currency}
                      onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block font-medium mb-1">التاريخ (نص)</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={form.dateLabel}
                  onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
                  placeholder="مثال: 14 فيفري 2026"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">الوقت (نص)</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={form.timeLabel}
                  onChange={(e) => setForm((f) => ({ ...f, timeLabel: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">المكان (نص)</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={form.locationLabel}
                  onChange={(e) => setForm((f) => ({ ...f, locationLabel: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">رابط التسجيل (اختياري)</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  dir="ltr"
                  value={form.registrationUrl}
                  onChange={(e) => setForm((f) => ({ ...f, registrationUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">صورة الغلاف</label>
                {form.image && (
                  <img
                    src={courseService.getCourseImageUrl(form.image)}
                    alt=""
                    className="h-20 object-cover rounded mb-1"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded cursor-pointer">
                  <FiImage />
                  {uploading ? "..." : "رفع صورة"}
                  <input type="file" accept="image/*" className="hidden" onChange={onPickImage} disabled={uploading} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                  منشور
                </label>
                <div>
                  <label className="block font-medium mb-1">ترتيب</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={form.orderIndex}
                    onChange={(e) => setForm((f) => ({ ...f, orderIndex: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 border rounded py-2">
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending || updateMut.isPending}
                  className="flex-1 bg-[#09142b] text-white rounded py-2"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        title="حذف الدورة"
        message={`حذف «${deleteTarget?.titleAr}»؟`}
        type="danger"
        isLoading={deleteMut.isPending}
      />
    </div>
  );
};

export default CoursesManagement;
