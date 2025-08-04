import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginService,
  ResetPswdService,
  SendOtpService,
  VerifyOtpService,
} from "../../api/Service";
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

export const sentOtpThunk = createAsyncThunk(
  "sendotp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await SendOtpService(email);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const VerifyOtpThunk = createAsyncThunk(
  "verifyotp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await VerifyOtpService(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const ResetPswdThunk = createAsyncThunk(
  "resetpassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ResetPswdService(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
