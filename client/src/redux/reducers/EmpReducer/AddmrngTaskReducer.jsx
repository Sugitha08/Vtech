import { createSlice } from "@reduxjs/toolkit";
import { AddmrngTaskThunk } from "../../thunk/Addmrngtask";


const AddmrngTaskReducer = createSlice({
  name: "addmrngtask",
  initialState: {
    loading: false,
    data: {},
    error: null,
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
  },
});

export default AddmrngTaskReducer.reducer;
