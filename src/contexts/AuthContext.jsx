import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { authAPI } from "../services/api";
import { AUTH_ACTIONS, initialState, authReducer } from "./authConstants.js";

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("jwt");
      if (token) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: response.data.data,
          });
        } catch {
          // Token is invalid, remove it
          Cookies.remove("jwt");
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;

      // Store token in cookie
      Cookies.set("jwt", token, {
        expires: 7, // 7 days
        secure: false, // Set to false for development
        sameSite: "strict",
      });

      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;

      // Store token in cookie
      Cookies.set("jwt", token, {
        expires: 7, // 7 days
        secure: false, // Set to false for development
        sameSite: "strict",
      });

      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    } finally {
      // Remove token from cookie
      Cookies.remove("jwt");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      return state.user?.role === role;
    },
    [state.user?.role]
  );

  // Check if user is admin
  const isAdmin = useCallback(() => hasRole("admin"), [hasRole]);

  // Check if user is client
  const isClient = useCallback(() => hasRole("client"), [hasRole]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
      hasRole,
      isAdmin,
      isClient,
    }),
    [state, login, register, logout, clearError, hasRole, isAdmin, isClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
