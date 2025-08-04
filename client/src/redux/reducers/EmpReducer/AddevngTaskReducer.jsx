import { createSlice } from "@reduxjs/toolkit";
import { AddevngTaskThunk } from "../../thunk/Addevngtask";

const AddevngTaskReducer = createSlice({
  name: "addevngtask",
  initialState: {
    loading: false,
    data: {},
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
  },
});

export default AddevngTaskReducer.reducer;
