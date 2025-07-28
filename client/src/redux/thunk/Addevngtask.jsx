import { createAsyncThunk } from "@reduxjs/toolkit";
import { EvngTaskService, setPerformanceService } from "../../api/Service";
import { toast } from "react-toastify";

export const AddevngTaskThunk = createAsyncThunk(
  "addevngtask",
  async (TaskData, { rejectWithValue }) => {
    try {
      const response = await EvngTaskService(TaskData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const AddEmpPerformanceThunk = createAsyncThunk(
  "addempperfromance",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await setPerformanceService(Data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
