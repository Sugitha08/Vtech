import { toast } from "react-toastify";
import { resetpswd, sendOtp, VerifyOtp } from "../../api/Service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const SendOtpToEmailThunk = createAsyncThunk(
  "admin/sendotp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await sendOtp(email);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const VerifyOtpThunk = createAsyncThunk(
  "admin/verifyotp",
  async (otp, { rejectWithValue }) => {
    try {
      const response = await VerifyOtp(otp);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const ResetpswdThunk = createAsyncThunk(
  "admin/resetpswd",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetpswd(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
