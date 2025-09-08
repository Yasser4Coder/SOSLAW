import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../services/api";
import { toast } from "react-hot-toast";

// Hook to get all users with pagination and filters
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userAPI.getAllUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get user by ID
export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userAPI.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: () => userAPI.getUserStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => userAPI.createUser(userData),
    onSuccess: (data) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      toast.success("تم إنشاء المستخدم بنجاح");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء إنشاء المستخدم";
      toast.error(message);
    },
  });
};

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => userAPI.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch users list and specific user
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      toast.success("تم تحديث المستخدم بنجاح");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء تحديث المستخدم";
      toast.error(message);
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userAPI.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list and stats
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء حذف المستخدم";
      toast.error(message);
    },
  });
};

// Hook to toggle user status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userAPI.toggleUserStatus(id),
    onSuccess: (data, variables) => {
      // Invalidate and refetch users list and specific user
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      const status = data.data.isActive ? "تفعيل" : "إلغاء تفعيل";
      toast.success(`تم ${status} المستخدم بنجاح`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء تغيير حالة المستخدم";
      toast.error(message);
    },
  });
};
