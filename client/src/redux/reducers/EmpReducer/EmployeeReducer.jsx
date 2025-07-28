import { createSlice } from "@reduxjs/toolkit";
import { GetAllEmployeeThunk } from "../../thunk/EmployeeThunk";

const AllEmployeeReducer = createSlice({
  name: "employee",
  initialState: {
    loading: false,
    all_employee: [],
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
  },
});

export default AllEmployeeReducer.reducer;
