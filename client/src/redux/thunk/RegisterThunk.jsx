import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterService } from "../../api/Service";
import { toast } from "react-toastify";

export const RegisterThunk = createAsyncThunk(
  "register",
  async (RegData, { rejectWithValue }) => {
    try {
      const response = await RegisterService(RegData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
