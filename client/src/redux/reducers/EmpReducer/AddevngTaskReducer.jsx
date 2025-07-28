import { createSlice } from "@reduxjs/toolkit";
import {
  AddEmpPerformanceThunk,
  AddevngTaskThunk,
} from "../../thunk/Addevngtask";

const AddevngTaskReducer = createSlice({
  name: "addevngtask",
  initialState: {
    loading: false,
    data: {},
    performance: {},
    perload: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(AddevngTaskThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AddevngTaskThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(AddevngTaskThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(AddEmpPerformanceThunk.pending, (state, action) => {
      state.perload = true;
    });
    builder.addCase(AddEmpPerformanceThunk.fulfilled, (state, action) => {
      state.performance = action.payload;
      state.perload = false;
    });
    builder.addCase(AddEmpPerformanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.perload = false;
    });
  },
});

export default AddevngTaskReducer.reducer;
