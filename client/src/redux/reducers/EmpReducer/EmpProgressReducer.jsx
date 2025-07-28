import { createSlice } from "@reduxjs/toolkit";
import { AttendanceThunk } from "../../thunk/AttendanceThunk";
import { EmpProgressThunk } from "../../thunk/EmpProgressThunk";

const EmpProgressReducer = createSlice({
  name: "empProgress",
  initialState: {
    loading: false,
    emp_Progress: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(EmpProgressThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(EmpProgressThunk.fulfilled, (state, action) => {
      state.emp_Progress = action.payload;
      state.loading = false;
    });
    builder.addCase(EmpProgressThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default EmpProgressReducer.reducer;
