import { createAsyncThunk } from "@reduxjs/toolkit";
import { AttendanceService } from "../../api/Service";
import { toast } from "react-toastify";

export const AttendanceThunk = createAsyncThunk(
  "empAttendance",
  async (date, { rejectWithValue }) => {
    try {
      const response = await AttendanceService(date);
      // toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
