import { createSlice } from "@reduxjs/toolkit";
import { LoginThunk } from "../../thunk/LoginThunk";

const Auth_Token = localStorage.getItem("jwt_token");

const LoginReducer = createSlice({
  name: "Login",
  initialState: {
    loading: false,
    data: {},
    LoginStatus: Auth_Token ? true : false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(LoginThunk.pending, (state, action) => {
      state.loading = true;
      state.LoginStatus = false;
    });
    builder.addCase(LoginThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.LoginStatus = true;
      state.loading = false;
    });
    builder.addCase(LoginThunk.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
      state.LoginStatus = false;
      state.loading = false;
    });
  },
});

export default LoginReducer.reducer;
