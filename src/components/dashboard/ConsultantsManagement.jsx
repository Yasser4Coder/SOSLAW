import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUserPlus,
  FiUser,
  FiStar,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import consultantService from "../../services/consultantService";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";

const ConsultantsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openActionsId, setOpenActionsId] = useState(null);
  const searchInputRef = useRef(null);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    nameFr: "",
    titleAr: "",
    titleEn: "",
    titleFr: "",
    specializationAr: "",
    specializationEn: "",
    specializationFr: "",
    experienceAr: "",
    experienceEn: "",
    experienceFr: "",
    status: "active",
    rating: 0.0,
    consultations: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500);
    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, debouncedSearchTerm]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const {
    data: consultantsData,
    isLoading: isLoadingConsultants,
    error: consultantsError,
    refetch: refetchConsultants,
  } = useQuery({
    queryKey: [
      "consultants",
      selectedFilter,
      currentPage,
      itemsPerPage,
      debouncedSearchTerm.trim() || null,
    ],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return consultantService.getAllConsultants({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        language: "ar",
        limit: itemsPerPage,
        offset: offset,
        ...(debouncedSearchTerm.trim() ? { search: debouncedSearchTerm.trim() } : {}),
      });
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !isSearching,
  });

  const { data: statsData } = useQuery({
    queryKey: ["consultantStats"],
    queryFn: consultantService.getConsultantStats,
    staleTime: 5 * 60 * 1000,
    enabled: !debouncedSearchTerm || debouncedSearchTerm.trim().length === 0,
  });

  // Create consultant mutation
  const createConsultantMutation = useMutation({
    mutationFn: (data) =>
      consultantService.createConsultant(data.consultantData, data.imageFile),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم إضافة المستشار الجديد بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة المستشار");
    },
  });

  // Update consultant mutation
  const updateConsultantMutation = useMutation({
    mutationFn: (data) =>
      consultantService.updateConsultant(
        data.id,
        data.consultantData,
        data.imageFile
      ),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم تحديث بيانات المستشار بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث المستشار");
    },
  });

  // Delete consultant mutation
  const deleteConsultantMutation = useMutation({
    mutationFn: consultantService.deleteConsultant,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      setShowDeleteConfirm(false);
      setConsultantToDelete(null);
      await new Promise((r) => setTimeout(r, 300));
      await refetchConsultants();
      toast.success("تم حذف المستشار بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف المستشار");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: consultantService.toggleConsultantStatus,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      await refetchConsultants();
      toast.success("تم تغيير حالة المستشار بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة المستشار");
    },
  });

  // Extract consultants from API response (search is done on the server)
  const consultants = consultantsData?.data?.consultants || [];
  const totalConsultants = consultantsData?.data?.total || 0;

  const stats = statsData?.data || {};
  const totalCount = stats.totalConsultants ?? 0;
  const activeCount = stats.activeConsultants ?? 0;
  const inactiveCount = totalCount - activeCount;

  // Table columns
  const columns = [
    {
      key: "name",
      label: "الاسم",
      sortable: true,
      render: (value, consultant) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={consultant.imageUrl}
            alt={consultant.name}
            name={consultant.name}
            size="md"
            className="shrink-0"
            fallbackBg="gradient"
          />
          <div className="min-w-0">
            <div className="font-medium text-slate-800 truncate">{consultant.name}</div>
            <div className="text-sm text-slate-500 truncate">{consultant.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "التخصص",
      sortable: true,
      render: (value) => <span className="text-slate-800">{value || "—"}</span>,
    },
    {
      key: "experience",
      label: "الخبرة",
      sortable: true,
      render: (value) => <span className="text-slate-800">{value || "—"}</span>,
    },
    {
      key: "rating",
      label: "التقييم",
      sortable: true,
      render: (value, consultant) => (
        <div className="flex items-center gap-1">
          <FiStar className="text-amber-500 shrink-0" size={14} />
          <span className="text-sm font-medium text-slate-800">{consultant.rating ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "consultations",
      label: "الاستشارات",
      sortable: true,
      render: (value) => <span className="text-slate-800">{value ?? "—"}</span>,
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      headerClassName: "min-w-[9rem] w-[9rem]",
      cellClassName: "min-w-[9rem] w-[9rem]",
      render: (value, consultant) => (
        <span
          className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer ${
            consultant.status === "active"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
          onClick={(e) => { e.stopPropagation(); handleToggleStatus(consultant.id); }}
          title="انقر لتغيير الحالة"
        >
          {consultant.status === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: (_, consultant) => {
        const isOpen = openActionsId === consultant.id;
        return (
          <div className="relative flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionsId(isOpen ? null : consultant.id);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-[#09142b] hover:bg-slate-100 transition-colors"
              title="الإجراءات"
            >
              <FiChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenActionsId(null)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 top-full mt-1 z-20 min-w-[180px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                  <button
                    onClick={() => {
                      handleViewConsultant(consultant);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEye className="w-4 h-4" /> عرض
                  </button>
                  <button
                    onClick={() => {
                      handleEditConsultant(consultant);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" /> تعديل
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleDeleteConsultant(consultant.id);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsImageLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setIsImageLoading(false);
      };
      reader.onerror = () => {
        setIsImageLoading(false);
        toast.error("فشل في قراءة الصورة");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate required fields for all languages
    const requiredFields = [
      "nameAr",
      "nameEn",
      "nameFr",
      "titleAr",
      "titleEn",
      "titleFr",
      "specializationAr",
      "specializationEn",
      "specializationFr",
      "experienceAr",
      "experienceEn",
      "experienceFr",
    ];

    // Validate rating and consultations
    if (formData.rating < 0 || formData.rating > 5) {
      toast.error("التقييم يجب أن يكون بين 0 و 5");
      return;
    }

    if (formData.consultations < 0) {
      toast.error("عدد الاستشارات يجب أن يكون 0 أو أكثر");
      return;
    }

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Validate image for new consultants
    if (!isEditing && !imageFile) {
      toast.error("يرجى اختيار صورة للمستشار الجديد");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateConsultantMutation.mutateAsync({
          id: selectedConsultant.id,
          consultantData: formData,
          imageFile: imageFile || null,
        });
      } else {
        await createConsultantMutation.mutateAsync({
          consultantData: formData,
          imageFile,
        });
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit consultant
  const handleEditConsultant = async (consultant) => {
    if (isSubmitting) return;

    try {
      // Fetch consultant with all languages
      const response = await consultantService.getConsultantByIdAllLanguages(
        consultant.id
      );
      const consultantData = response.data;

      setSelectedConsultant(consultant);
      setFormData({
        nameAr: consultantData.ar.name,
        nameEn: consultantData.en.name,
        nameFr: consultantData.fr.name,
        titleAr: consultantData.ar.title,
        titleEn: consultantData.en.title,
        titleFr: consultantData.fr.title,
        specializationAr: consultantData.ar.specialization,
        specializationEn: consultantData.en.specialization,
        specializationFr: consultantData.fr.specialization,
        experienceAr: consultantData.ar.experience,
        experienceEn: consultantData.en.experience,
        experienceFr: consultantData.fr.experience,
        status: consultantData.status,
        rating: parseFloat(consultantData.rating) || 0.0,
        consultations: parseInt(consultantData.consultations) || 0,
      });
      setImagePreview(consultantData.imageUrl);
      setImageFile(null);
      setIsEditing(true);
      setShowAddForm(true);
    } catch {
      toast.error("فشل في تحميل بيانات المستشار للتعديل");
    }
  };

  // Handle delete consultant
  const handleDeleteConsultant = (consultantId) => {
    if (isSubmitting) return;
    setConsultantToDelete(consultantId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (consultantToDelete) {
      deleteConsultantMutation.mutate(consultantToDelete);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (consultantId) => {
    if (isSubmitting) return;
    await toggleStatusMutation.mutateAsync(consultantId);
  };

  // Handle view consultant
  const handleViewConsultant = (consultant) => {
    if (isSubmitting) return;
    setSelectedConsultant(consultant);
    setShowViewModal(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedConsultant(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      nameFr: "",
      titleAr: "",
      titleEn: "",
      titleFr: "",
      specializationAr: "",
      specializationEn: "",
      specializationFr: "",
      experienceAr: "",
      experienceEn: "",
      experienceFr: "",
      status: "active",
      rating: 0.0,
      consultations: 0,
    });
    setImageFile(null);
    setImagePreview("");
    setIsImageLoading(false);
    setIsSubmitting(false);
  };

  // Loading state
  if (isLoadingConsultants) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-11 w-28 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="h-14 bg-white rounded-xl border border-slate-200" />
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-12 bg-slate-50 border-b border-slate-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (consultantsError) {
    if (consultantsError.response?.status === 401) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#09142b] mb-1">مطلوب تسجيل الدخول</h3>
          <p className="text-slate-600 text-sm mb-6">يجب تسجيل الدخول لعرض المستشارين</p>
          <a
            href="/auth"
            className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors"
          >
            تسجيل الدخول
          </a>
        </div>
      );
    }
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center"
        dir="rtl"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#09142b] mb-1">حدث خطأ أثناء تحميل البيانات</h3>
        <p className="text-slate-600 text-sm">
          {consultantsError.message || "خطأ في الاتصال بالخادم"}
        </p>
      </div>
    );
  }

  const statusTabs = [
    { value: "all", label: "الكل", count: totalCount, icon: FiUser },
    { value: "active", label: "نشط", count: activeCount, icon: FiEye },
    { value: "inactive", label: "غير نشط", count: inactiveCount, icon: FiEdit },
  ];

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleImmediateSearch = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] tracking-tight">
            إدارة المستشارين
          </h1>
          <p className="text-slate-600 mt-1">
            عرض وإدارة المستشارين وإضافة أو تعديل البيانات
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors shadow-sm"
        >
          <FiUserPlus className="w-5 h-5" />
          إضافة مستشار جديد
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const isActive = selectedFilter === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#09142b] text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`tabular-nums ${isActive ? "text-white/90" : "text-slate-400"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="بحث في المستشارين... (Ctrl+F)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImmediateSearch();
              }
              if (e.key === "Escape") handleSearchClear();
            }}
            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border bg-white transition-colors placeholder:text-slate-400 ${
              isSearching
                ? "border-[#c8a45e] bg-amber-50/30"
                : "border-slate-200 focus:border-[#09142b] focus:ring-2 focus:ring-[#09142b]/10"
            }`}
            autoComplete="off"
          />
          {searchTerm && !isSearching && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          {debouncedSearchTerm && totalConsultants > 0 && (
            <p className="absolute -bottom-5 right-0 text-xs text-slate-500">
              {totalConsultants} نتيجة
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:border-[#09142b]"
          >
            <option value={5}>5 لكل صفحة</option>
            <option value={10}>10 لكل صفحة</option>
            <option value={25}>25 لكل صفحة</option>
            <option value={50}>50 لكل صفحة</option>
          </select>
        </div>
      </div>

      {/* Table / Card container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {consultants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FiUserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#09142b] mb-1">لا يوجد مستشارون</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {debouncedSearchTerm || selectedFilter !== "all"
                ? "لا توجد نتائج تطابق البحث أو الفلاتر. جرّب تغيير المعايير."
                : "لم يتم إضافة أي مستشارين بعد. استخدم زر \"إضافة مستشار جديد\" للبدء."}
            </p>
          </div>
        ) : (
          <>
            {/* Card list: mobile */}
            <div className="lg:hidden p-4 space-y-4">
              {consultants.map((consultant) => {
                const isOpen = openActionsId === consultant.id;
                const statusClass =
                  consultant.status === "active"
                    ? "text-green-700 bg-green-50 border-green-200"
                    : "text-red-700 bg-red-50 border-red-200";
                return (
                  <div
                    key={consultant.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={consultant.imageUrl}
                          alt={consultant.name}
                          name={consultant.name}
                          size="md"
                          className="shrink-0"
                          fallbackBg="gradient"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{consultant.name}</p>
                          <p className="text-sm text-slate-500 truncate">{consultant.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer ${statusClass}`}
                          onClick={() => handleToggleStatus(consultant.id)}
                        >
                          {consultant.status === "active" ? "نشط" : "غير نشط"}
                        </span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionsId(isOpen ? null : consultant.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                          >
                            <FiChevronDown className={`w-4 h-4 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenActionsId(null)}
                                aria-hidden="true"
                              />
                              <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleViewConsultant(consultant);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEye className="w-4 h-4" /> عرض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleEditConsultant(consultant);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEdit className="w-4 h-4" /> تعديل
                                </button>
                                <hr className="my-1 border-slate-100" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteConsultant(consultant.id);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <FiTrash2 className="w-4 h-4" /> حذف
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">التخصص</span>
                      <span className="text-slate-800 truncate">{consultant.specialization || "—"}</span>
                      <span className="text-slate-500">الخبرة</span>
                      <span className="text-slate-800">{consultant.experience || "—"}</span>
                      <span className="text-slate-500">التقييم</span>
                      <span className="text-slate-800 flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5 text-amber-500" />
                        {consultant.rating ?? "—"}
                      </span>
                      <span className="text-slate-500">الاستشارات</span>
                      <span className="text-slate-800">{consultant.consultations ?? "—"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewConsultant(consultant)}
                      className="mt-3 w-full py-2 rounded-xl bg-[#09142b] text-white text-sm font-medium hover:bg-[#0b1a36] transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                );
              })}
              {totalConsultants > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    السابق
                  </button>
                  <span className="text-sm text-slate-600">
                    {currentPage} / {Math.ceil(totalConsultants / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(totalConsultants / itemsPerPage)}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(totalConsultants / itemsPerPage), p + 1)
                      )
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </div>

            {/* Table: desktop */}
            <div className="hidden lg:block overflow-x-visible">
              <DataTable
                data={consultants}
                columns={columns}
                searchTerm={searchTerm}
                noHorizontalScroll
                pagination={{
                  current: currentPage,
                  limit: itemsPerPage,
                  total: totalConsultants,
                  offset: (currentPage - 1) * itemsPerPage,
                  onPageChange: (offset) =>
                    setCurrentPage(Math.floor(offset / itemsPerPage) + 1),
                  onItemsPerPageChange: setItemsPerPage,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setConsultantToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا المستشار؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={deleteConsultantMutation.isPending}
      />

      {/* View Consultant Modal */}
      {showViewModal && selectedConsultant && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">تفاصيل المستشار</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedConsultant(null);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <Avatar
                  src={selectedConsultant.imageUrl}
                  alt={selectedConsultant.name}
                  name={selectedConsultant.name}
                  size="xl"
                  className="mb-4"
                  fallbackBg="gradient"
                />
                <h3 className="text-lg font-semibold text-slate-800">{selectedConsultant.name}</h3>
                <p className="text-slate-600 text-sm mt-1">{selectedConsultant.title}</p>
                <p className="text-slate-700 text-sm mt-2">{selectedConsultant.specialization}</p>
                <p className="text-slate-500 text-sm mt-1">{selectedConsultant.experience}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FiStar className="text-amber-500" size={16} />
                    {selectedConsultant.rating ?? "—"}
                  </span>
                  <span className="text-slate-600">الاستشارات: {selectedConsultant.consultations ?? "—"}</span>
                </div>
                <span
                  className={`inline-flex mt-3 px-3 py-1 rounded-lg text-xs font-medium ${
                    selectedConsultant.status === "active"
                      ? "text-green-700 bg-green-50 border border-green-200"
                      : "text-red-700 bg-red-50 border border-red-200"
                  }`}
                >
                  {selectedConsultant.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditConsultant(selectedConsultant);
                  }}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors flex items-center gap-2"
                >
                  <FiEdit size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedConsultant(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#09142b]">
                  {isEditing ? "تعديل المستشار" : "إضافة مستشار جديد"}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              {/* Multi-language form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Arabic Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    البيانات بالعربية
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      name="titleAr"
                      value={formData.titleAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التخصص
                    </label>
                    <input
                      type="text"
                      name="specializationAr"
                      value={formData.specializationAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الخبرة
                    </label>
                    <input
                      type="text"
                      name="experienceAr"
                      value={formData.experienceAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* English Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    English Data
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      value={formData.titleEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specializationEn"
                      value={formData.specializationEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experienceEn"
                      value={formData.experienceEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* French Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    Données en Français
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nameFr"
                      value={formData.nameFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      name="titleFr"
                      value={formData.titleFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spécialisation
                    </label>
                    <input
                      type="text"
                      name="specializationFr"
                      value={formData.specializationFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expérience
                    </label>
                    <input
                      type="text"
                      name="experienceFr"
                      value={formData.experienceFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التقييم
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاستشارات
                  </label>
                  <input
                    type="number"
                    name="consultations"
                    value={formData.consultations}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الصورة
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isEditing}
                  />
                  {isImageLoading && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <FiLoader className="animate-spin ml-2" size={14} />
                      جاري معالجة الصورة...
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#09142b] hover:bg-[#0b1a36] text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin w-4 h-4" />
                      جاري الإرسال...
                    </>
                  ) : isEditing ? (
                    "تحديث المستشار"
                  ) : (
                    "إضافة المستشار"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantsManagement;
