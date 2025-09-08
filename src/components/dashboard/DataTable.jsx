import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const DataTable = ({ data, columns, searchTerm = "", pagination = null }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Use external pagination if provided, otherwise use internal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // If external pagination is provided, use it
  const hasExternalPagination = pagination && pagination.total !== undefined;
  const totalItems = hasExternalPagination ? pagination.total : data.length;
  const totalPages = Math.ceil(
    totalItems / (hasExternalPagination ? pagination.limit : itemsPerPage)
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    if (!sortConfig.key) return safeData;

    return [...safeData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

    if (hasExternalPagination) {
      // For external pagination, return data as-is since backend handles filtering
      return safeData;
    }
    if (!searchTerm) return Array.isArray(sortedData) ? sortedData : [];

    return (Array.isArray(sortedData) ? sortedData : []).filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm, hasExternalPagination, data]);

  // Only use internal pagination if no external pagination is provided
  const paginatedData = React.useMemo(() => {
    if (hasExternalPagination) {
      // For external pagination, return the data as-is since backend handles pagination
      return Array.isArray(data) ? data : [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [data, filteredData, currentPage, itemsPerPage, hasExternalPagination]);

  const handlePageChange = (page) => {
    if (hasExternalPagination && pagination.onPageChange) {
      // Calculate offset for external pagination
      const offset = (page - 1) * pagination.limit;
      pagination.onPageChange(offset);
    } else {
      setCurrentPage(page);
    }
  };

  const getCurrentPageInfo = () => {
    if (hasExternalPagination) {
      const currentPageNumber =
        Math.floor(pagination.offset / pagination.limit) + 1;
      const startItem = pagination.offset + 1;
      const endItem = Math.min(
        pagination.offset + pagination.limit,
        pagination.total
      );
      return { currentPageNumber, startItem, endItem };
    }
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
    return { currentPageNumber: currentPage, startItem, endItem };
  };

  const { currentPageNumber, startItem, endItem } = getCurrentPageInfo();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FiChevronDown className="text-gray-400" size={16} />;
    }
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="text-gray-600" size={16} />
    ) : (
      <FiChevronDown className="text-gray-600" size={16} />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center justify-end">
                  {column.label}
                  {column.sortable && (
                    <span className={`${isRTL ? "ml-1" : "mr-1"}`}>
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {searchTerm
                  ? t("noResultsFound", "لا توجد نتائج للبحث")
                  : t("noDataAvailable", "لا توجد بيانات متاحة")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() =>
                handlePageChange(Math.max(1, currentPageNumber - 1))
              }
              disabled={currentPageNumber === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("previous", "السابق")}
            </button>
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPageNumber + 1))
              }
              disabled={currentPageNumber === totalPages}
              className={`${
                isRTL ? "mr-3" : "ml-3"
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t("next", "التالي")}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {t("showing", "عرض")}{" "}
                <span className="font-medium">{startItem}</span>{" "}
                {t("to", "إلى")} <span className="font-medium">{endItem}</span>{" "}
                {t("of", "من")}{" "}
                <span className="font-medium">{totalItems}</span>{" "}
                {t("results", "نتيجة")}
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, currentPageNumber - 1))
                  }
                  disabled={currentPageNumber === 1}
                  className={`relative inline-flex items-center px-2 py-2 ${
                    isRTL ? "rounded-l-md" : "rounded-r-md"
                  } border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRTL ? (
                    <FiChevronLeft size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  )}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPageNumber === page
                          ? "z-10 bg-[#09142b] border-[#09142b] text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, currentPageNumber + 1)
                    )
                  }
                  disabled={currentPageNumber === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 ${
                    isRTL ? "rounded-r-md" : "rounded-l-md"
                  } border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRTL ? (
                    <FiChevronRight size={16} />
                  ) : (
                    <FiChevronLeft size={16} />
                  )}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
