import { createSlice } from "@reduxjs/toolkit";
import { AssignTaskThunk, GetEmpAssignTaskThunk } from "../../thunk/AssignTask";

const AssignTaskReducer = createSlice({
  name: "assigntask",
  initialState: {
    loading: false,
    task_assign: [],
    getEmptask: [],
    getEmpload: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(AssignTaskThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AssignTaskThunk.fulfilled, (state, action) => {
      state.task_assign = action.payload;
      state.loading = false;
    });
    builder.addCase(AssignTaskThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(GetEmpAssignTaskThunk.pending, (state, action) => {
      state.getEmpload = true;
    });
    builder.addCase(GetEmpAssignTaskThunk.fulfilled, (state, action) => {
      state.getEmptask = action.payload;
      state.getEmpload = false;
    });
    builder.addCase(GetEmpAssignTaskThunk.rejected, (state, action) => {
      state.error = action.error;
      state.getEmpload = false;
    });
  },
});

export default AssignTaskReducer.reducer;
