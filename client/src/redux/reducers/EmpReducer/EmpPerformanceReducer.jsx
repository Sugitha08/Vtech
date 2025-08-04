import { createSlice } from "@reduxjs/toolkit";
import {
  AddEmpPerformanceThunk,
  GetPerEmpPerformanceThunk,
} from "../../thunk/EmpPerformanceThunk";
import { GetEmpPerformanceThunk } from "../../thunk/EmpPerformanceThunk";

const EmpPerformanceReducer = createSlice({
  name: "performance",
  initialState: {
    loading: false,
    performance: [],
    Empperformance: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(AddEmpPerformanceThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AddEmpPerformanceThunk.fulfilled, (state, action) => {
      // state.performance = action.payload;
      state.loading = false;
    });
    builder.addCase(AddEmpPerformanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(GetEmpPerformanceThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetEmpPerformanceThunk.fulfilled, (state, action) => {
      state.performance = action.payload;
      state.loading = false;
    });
    builder.addCase(GetEmpPerformanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(GetPerEmpPerformanceThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetPerEmpPerformanceThunk.fulfilled, (state, action) => {
      state.Empperformance = action.payload.data;
      state.loading = false;
    });
    builder.addCase(GetPerEmpPerformanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default EmpPerformanceReducer.reducer;
