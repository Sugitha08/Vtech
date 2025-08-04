import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetEmpPerformanceService,
  GetPerformanceService,
  setPerformanceService,
} from "../../api/Service";
import { toast } from "react-toastify";

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

export const GetEmpPerformanceThunk = createAsyncThunk(
  "getempperfromance",
  async (date, { rejectWithValue }) => {
    try {
      const response = await GetPerformanceService(date);
      //   toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const GetPerEmpPerformanceThunk = createAsyncThunk(
  "getperempperfromance",
  async (date, { rejectWithValue }) => {
    try {
      const response = await GetEmpPerformanceService(date);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
