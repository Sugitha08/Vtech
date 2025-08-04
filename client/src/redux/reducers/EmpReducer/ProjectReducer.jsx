import { createSlice } from "@reduxjs/toolkit";
import { GetProjectThunk, ProjectThunk } from "../../thunk/ProjectThunk";

const ProjectReducer = createSlice({
  name: "project",
  initialState: {
    loading: false,
    project: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(ProjectThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(ProjectThunk.fulfilled, (state, action) => {
      //   state.project = action.payload;
      state.loading = false;
    });
    builder.addCase(ProjectThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(GetProjectThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetProjectThunk.fulfilled, (state, action) => {
      state.project = action.payload;
      state.loading = false;
    });
    builder.addCase(GetProjectThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ProjectReducer.reducer;
