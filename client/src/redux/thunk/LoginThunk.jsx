import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginService } from "../../api/Service";
import { toast } from "react-toastify";

export const LoginThunk = createAsyncThunk(
  "login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await LoginService(loginData);
      localStorage.setItem("jwt_token", response?.data?.access_token);
      localStorage.setItem("user_role", response?.data?.role);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
