import { createAsyncThunk } from "@reduxjs/toolkit";
import {  GetAllEmployee } from "../../api/Service";
import { toast } from "react-toastify";

export const GetAllEmployeeThunk = createAsyncThunk(
  "employee",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllEmployee();
      // toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
