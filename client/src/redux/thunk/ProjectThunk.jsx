import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddProjectService,
  GetProjectService,
  LoginService,
} from "../../api/Service";
import { toast } from "react-toastify";

export const ProjectThunk = createAsyncThunk(
  "addproject",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await AddProjectService(Data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const GetProjectThunk = createAsyncThunk(
  "getproject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetProjectService();
      //   toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
