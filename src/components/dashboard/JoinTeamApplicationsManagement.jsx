import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFilter,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiPlus,
  FiTag,
  FiHash,
  FiAlertTriangle,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiGlobe,
  FiRefreshCw,
} from "react-icons/fi";
import DataTable from "./DataTable";
import joinTeamApplicationService from "../../services/joinTeamApplicationService";
import toast from "react-hot-toast";

const JoinTeamApplicationsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    status: "pending",
    adminNotes: "",
  });

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في الطلبات"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch applications with React Query - only filter by status, not search
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    error: applicationsError,
  } = useQuery({
    queryKey: ["joinTeamApplications", selectedFilter],
    queryFn: () => {
      return joinTeamApplicationService.getAllApplications({
        status: selectedFilter,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch application statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["joinTeamApplicationStats"],
    queryFn: joinTeamApplicationService.getApplicationStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: joinTeamApplicationService.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplications"] });
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplicationStats"] });
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error) => {
      console.error("Delete application error:", error);
      toast.error(error.message || "فشل في حذف الطلب");
    },
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }) =>
      joinTeamApplicationService.updateApplicationStatus(
        id,
        status,
        adminNotes
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplications"] });
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplicationStats"] });
      toast.success("تم تحديث حالة الطلب بنجاح");
      setShowStatusModal(false);
      setStatusFormData({ status: "pending", adminNotes: "" });
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث حالة الطلب");
    },
  });

  // Extract applications from API response - following the same pattern as other components
  const allApplications = applicationsData?.data?.data?.applications || [];
  const totalApplications = applicationsData?.data?.data?.total || 0;

  // Filter applications based on search term (client-side filtering)
  const applications = React.useMemo(() => {
    if (!searchTerm.trim()) return allApplications;

    const searchLower = searchTerm.toLowerCase().trim();

    return allApplications.filter((application) => {
      return (
        (application.fullName &&
          application.fullName.toLowerCase().includes(searchLower)) ||
        (application.email &&
          application.email.toLowerCase().includes(searchLower)) ||
        (application.phoneNumber &&
          application.phoneNumber.toLowerCase().includes(searchLower)) ||
        (application.role?.titleAr &&
          application.role.titleAr.toLowerCase().includes(searchLower)) ||
        (application.city &&
          application.city.toLowerCase().includes(searchLower)) ||
        (application.country &&
          application.country.toLowerCase().includes(searchLower))
      );
    });
  }, [allApplications, searchTerm]);

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "reviewed":
        return "تم المراجعة";
      case "shortlisted":
        return "القائمة المختصرة";
      case "rejected":
        return "مرفوض";
      case "accepted":
        return "مقبول";
      default:
        return status;
    }
  };

  // Table columns
  const columns = [
    {
      key: "applicant",
      label: "معلومات مقدم الطلب",
      sortable: true,
      render: (value, application) => (
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiMail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {application.fullName}
            </p>
            <p className="text-xs text-gray-500">{application.email}</p>
            <p className="text-xs text-gray-500">{application.phoneNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "الدور المطلوب",
      sortable: true,
      render: (value, application) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {application.role?.titleAr || "غير محدد"}
          </p>
          <p className="text-xs text-gray-500">
            {application.role?.slug || ""}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      label: "الموقع",
      sortable: true,
      render: (value, application) => (
        <div className="flex items-center space-x-1 space-x-reverse">
          <FiMapPin className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-600">
            {application.city}, {application.country}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, application) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
            application.status
          )}`}
        >
          {getStatusText(application.status)}
        </span>
      ),
    },
    {
      key: "submittedAt",
      label: "تاريخ التقديم",
      sortable: true,
      render: (value, application) => (
        <div className="flex items-center space-x-1 space-x-reverse">
          <FiCalendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (value, application) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleViewDetails(application)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="عرض التفاصيل"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUpdateStatus(application)}
            className="text-green-600 hover:text-green-900 transition-colors"
            title="تحديث الحالة"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <a
            href={application.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-900 transition-colors"
            title="تحميل السيرة الذاتية"
          >
            <FiDownload className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleDelete(application.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Handle view details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  // Handle update status
  const handleUpdateStatus = (application) => {
    setSelectedApplication(application);
    setStatusFormData({
      status: application.status,
      adminNotes: application.adminNotes || "",
    });
    setShowStatusModal(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteApplicationMutation.mutate(applicationToDelete);
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  // Handle status form submission
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedApplication.id,
        status: statusFormData.status,
        adminNotes: statusFormData.adminNotes,
      });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // Handle status form input change
  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoadingApplications || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <div className="mr-4 text-gray-600">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (applicationsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600">{applicationsError.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            إدارة طلبات الانضمام للفريق
          </h2>
          <p className="text-sm text-gray-600">
            إجمالي الطلبات: {totalApplications}
          </p>
        </div>
      </div>

      {/* Statistics */}
      {statsData?.data?.data ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiList className="w-8 h-8 text-blue-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.totalApplications || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiLoader className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.pendingApplications || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">مقبول</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.acceptedApplications || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FiTag className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">القائمة المختصرة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.shortlistedApplications || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiXCircle className="w-8 h-8 text-red-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">مرفوض</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.rejectedApplications || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-center">
            <FiLoader className="animate-spin w-6 h-6 text-blue-600 ml-2" />
            <span className="text-gray-600">جاري تحميل الإحصائيات...</span>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200">
            <p className="text-sm text-blue-800 text-right">
              نتائج البحث: {applications.length} من {allApplications.length} طلب
              {searchTerm && (
                <span className="text-blue-600 font-medium">
                  {" "}
                  - "{searchTerm}"
                </span>
              )}
            </p>
          </div>
        )}
        {selectedFilter !== "all" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg transition-all duration-200">
            <p className="text-sm text-green-800 text-right">
              المرشحات النشطة:
              <span className="text-green-600 font-medium">
                {" "}
                الحالة: {getStatusText(selectedFilter)}
              </span>
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
          <div className="flex-1 relative w-full">
            <FiSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                searchTerm ? "text-blue-500" : "text-gray-400"
              }`}
              size={16}
            />
            <input
              type="text"
              placeholder="البحث في الطلبات... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
              title="البحث في الطلبات - استخدم Ctrl+F للوصول السريع"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                title="مسح البحث"
              >
                ✕
              </button>
            )}
            {searchTerm && (
              <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {applications.length} من {allApplications.length}
              </div>
            )}
            {searchTerm && (
              <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
            {searchTerm && (
              <div className="absolute left-24 top-1/2 transform -translate-y-1/2 text-xs text-blue-500 font-medium">
                بحث...
              </div>
            )}
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="reviewed">تم المراجعة</option>
            <option value="shortlisted">القائمة المختصرة</option>
            <option value="rejected">مرفوض</option>
            <option value="accepted">مقبول</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedFilter("all");
            }}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      {applications.length === 0 && !isLoadingApplications ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FiMail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد طلبات توظيف
          </h3>
          <p className="text-gray-500">
            لم يتم تقديم أي طلبات توظيف بعد. ستظهر هنا عندما يتم تقديم طلبات
            جديدة.
          </p>
        </div>
      ) : (
        <DataTable
          data={applications}
          columns={columns}
          totalItems={totalApplications}
          isLoading={isLoadingApplications}
        />
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                تفاصيل طلب الانضمام
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  المعلومات الشخصية
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      الاسم الكامل
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      رقم الهاتف
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      تاريخ الميلاد
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.dateOfBirth
                        ? new Date(
                            selectedApplication.dateOfBirth
                          ).toLocaleDateString()
                        : "غير محدد"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  معلومات العنوان
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      العنوان
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.address}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      المدينة
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.city}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      البلد
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  المعلومات المهنية
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      الدور المطلوب
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.role?.titleAr || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      الخبرة
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.experience}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      التعليم
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.education}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      المهارات
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.skills}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  معلومات إضافية
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      الدافع للانضمام
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.motivation}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      الراتب المتوقع
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.expectedSalary || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      تاريخ التوفر
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.availability
                        ? new Date(
                            selectedApplication.availability
                          ).toLocaleDateString()
                        : "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      معلومات إضافية
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.additionalInfo ||
                        "لا توجد معلومات إضافية"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">الروابط</h4>
              <div className="flex space-x-4 space-x-reverse">
                {selectedApplication.linkedin && (
                  <a
                    href={selectedApplication.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FiMail className="w-4 h-4 ml-1" />
                    LinkedIn
                  </a>
                )}
                {selectedApplication.website && (
                  <a
                    href={selectedApplication.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FiGlobe className="w-4 h-4 ml-1" />
                    الموقع الشخصي
                  </a>
                )}
                <a
                  href={selectedApplication.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  <FiFileText className="w-4 h-4 ml-1" />
                  تحميل السيرة الذاتية
                </a>
              </div>
            </div>

            {/* Admin Notes */}
            {selectedApplication.adminNotes && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  ملاحظات الإدارة
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {selectedApplication.adminNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                تحديث حالة الطلب
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة الجديدة
                </label>
                <select
                  name="status"
                  value={statusFormData.status}
                  onChange={handleStatusInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">في الانتظار</option>
                  <option value="reviewed">تم المراجعة</option>
                  <option value="shortlisted">القائمة المختصرة</option>
                  <option value="rejected">مرفوض</option>
                  <option value="accepted">مقبول</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات الإدارة
                </label>
                <textarea
                  name="adminNotes"
                  value={statusFormData.adminNotes}
                  onChange={handleStatusInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أضف ملاحظات حول الطلب..."
                />
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {updateStatusMutation.isPending ? (
                    <FiLoader className="animate-spin w-4 h-4 ml-2" />
                  ) : null}
                  تحديث الحالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="text-yellow-600 w-6 h-6 ml-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                تأكيد الحذف
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteApplicationMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {deleteApplicationMutation.isPending ? (
                  <FiLoader className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinTeamApplicationsManagement;
