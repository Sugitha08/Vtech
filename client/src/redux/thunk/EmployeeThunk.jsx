import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddPermission, AdminEditEmployee, DelEmployee, EditEmployee, GetAllEmployee } from "../../api/Service";
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

export const AddPermissionThunk = createAsyncThunk(
  "addpermissionemployee",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AddPermission(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const EditEmployeeThunk = createAsyncThunk(
  "editemployee",
  async (data, { rejectWithValue }) => {
    try {
      const response = await EditEmployee(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const AdminEditEmployeeThunk = createAsyncThunk(
  "admin_editemployee",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AdminEditEmployee(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const DelEmployeeThunk = createAsyncThunk(
  "delemployee",
  async (data, { rejectWithValue }) => {  
    try {
      const response = await DelEmployee(data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
