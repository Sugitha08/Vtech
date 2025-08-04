import { createSlice } from "@reduxjs/toolkit";
import { AddmrngTaskThunk, GetmrngTaskThunk } from "../../thunk/Addmrngtask";

const AddmrngTaskReducer = createSlice({
  name: "addmrngtask",
  initialState: {
    loading: false,
    data: {},
    error: null,
    getloading: false,
    getmrngTask: [],
  },
  extraReducers: (builder) => {
    builder.addCase(AddmrngTaskThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AddmrngTaskThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(AddmrngTaskThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(GetmrngTaskThunk.pending, (state, action) => {
      state.getloading = true;
    });
    builder.addCase(GetmrngTaskThunk.fulfilled, (state, action) => {
      state.getmrngTask = action.payload;
      state.getloading = false;
    });
    builder.addCase(GetmrngTaskThunk.rejected, (state, action) => {
      state.error = action.error;
      state.getloading = false;
    });
  },
});

export default AddmrngTaskReducer.reducer;
