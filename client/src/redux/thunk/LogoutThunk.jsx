import { createAsyncThunk } from "@reduxjs/toolkit";
import { LogoutService } from "../../api/Service";
import { toast } from "react-toastify";

export const LogoutThunk = createAsyncThunk(
  "logout",
  async (logoutData, { rejectWithValue }) => {
    try {
      const response = await LogoutService(logoutData);
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_role");
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
