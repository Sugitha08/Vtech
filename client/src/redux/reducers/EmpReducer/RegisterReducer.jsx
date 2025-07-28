import { createSlice } from "@reduxjs/toolkit";
import { RegisterThunk } from "../../thunk/RegisterThunk";

const RegisterReducer = createSlice({
  name: "Register",
  initialState: {
    loading: false,
    data: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(RegisterThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(RegisterThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(RegisterThunk.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
      state.loading = false;
    });
  },
});

export default RegisterReducer.reducer;
