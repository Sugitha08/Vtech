import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AssignTaskService,
  GetAllEmployee,
  GetEmpAssignTaskService,
} from "../../api/Service";
import { toast } from "react-toastify";

export const AssignTaskThunk = createAsyncThunk(
  "assigntask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignTaskService(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const GetEmpAssignTaskThunk = createAsyncThunk(
  "emp/getassigntask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetEmpAssignTaskService();
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
