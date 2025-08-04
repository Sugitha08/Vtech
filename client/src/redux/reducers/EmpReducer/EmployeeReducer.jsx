import { createSlice } from "@reduxjs/toolkit";
import {
  EditEmployeeThunk,
  GetAllEmployeeThunk,
} from "../../thunk/EmployeeThunk";

const AllEmployeeReducer = createSlice({
  name: "employee",
  initialState: {
    loading: false,
    all_employee: [],
    editempload: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(GetAllEmployeeThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetAllEmployeeThunk.fulfilled, (state, action) => {
      state.all_employee = action.payload;
      state.loading = false;
    });
    builder.addCase(GetAllEmployeeThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(EditEmployeeThunk.pending, (state, action) => {
      state.editempload = true;
    });
    builder.addCase(EditEmployeeThunk.fulfilled, (state, action) => {
      // state.all_employee = action.payload;
      state.editempload = false;
    });
    builder.addCase(EditEmployeeThunk.rejected, (state, action) => {
      state.error = action.error;
      state.editempload = false;
    });
  },
});

export default AllEmployeeReducer.reducer;
