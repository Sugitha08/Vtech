import { createSlice } from "@reduxjs/toolkit";
import {
  AttendanceThunk,
  UpdateAttendanceThunk,
} from "../../thunk/AttendanceThunk";

const AttendanceReducer = createSlice({
  name: "empAttendance",
  initialState: {
    loading: false,
    emp_attendance: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(AttendanceThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AttendanceThunk.fulfilled, (state, action) => {
      state.emp_attendance = action.payload;
      state.loading = false;
    });
    builder.addCase(AttendanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(UpdateAttendanceThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateAttendanceThunk.fulfilled, (state, action) => {
      // state.emp_attendance = action.payload;
      state.loading = false;
    });
    builder.addCase(UpdateAttendanceThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default AttendanceReducer.reducer;
