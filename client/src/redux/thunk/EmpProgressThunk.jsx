import { createAsyncThunk } from "@reduxjs/toolkit";
import { AttendanceService, EmpPregressService } from "../../api/Service";
import { toast } from "react-toastify";

export const EmpProgressThunk = createAsyncThunk(
  "empProgress",
  async (date, { rejectWithValue }) => {
    try {
      const response = await EmpPregressService(date);
      // toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
