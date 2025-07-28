import { createSlice } from "@reduxjs/toolkit";
import { LogoutThunk } from "../../thunk/LogoutThunk";

const LogoutReducer = createSlice({
  name: "Logout",
  initialState: {
    loading: false,
    data: {},
    error: null,
    logoutStatus: false,
  },
  extraReducers: (builder) => {
    builder.addCase(LogoutThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(LogoutThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(LogoutThunk.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export default LogoutReducer.reducer;
