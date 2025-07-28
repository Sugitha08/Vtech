import { createAsyncThunk } from "@reduxjs/toolkit";
import { MrngTaskService } from "../../api/Service";
import { toast } from "react-toastify";

export const AddmrngTaskThunk = createAsyncThunk(
  "addmrngtask",
  async (TaskData, { rejectWithValue }) => {
    try {
      const response = await MrngTaskService(TaskData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);
