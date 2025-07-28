import { createSlice } from "@reduxjs/toolkit";
import {
  AddTransactionThunk,
  DeleteTransactionThunk,
  EditTransactionThunk,
  GetTransactionThunk,
} from "../../thunk/TranscationThunk";

const TransactionReducer = createSlice({
  name: "Transaction",
  initialState: {
    loading: false,
    transdata: {},
    AddLoading: false,
    delLoad: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(AddTransactionThunk.pending, (state, action) => {
      state.AddLoading = true;
    });
    builder.addCase(AddTransactionThunk.fulfilled, (state, action) => {
      //   state.data = action.payload;
      state.AddLoading = false;
    });
    builder.addCase(AddTransactionThunk.rejected, (state, action) => {
      state.error = action.error;
      state.AddLoading = false;
    });
    builder.addCase(EditTransactionThunk.pending, (state, action) => {
      state.AddLoading = true;
    });
    builder.addCase(EditTransactionThunk.fulfilled, (state, action) => {
      //   state.data = action.payload;
      state.AddLoading = false;
    });
    builder.addCase(EditTransactionThunk.rejected, (state, action) => {
      state.error = action.error;
      state.AddLoading = false;
    });
    builder.addCase(DeleteTransactionThunk.pending, (state, action) => {
      state.delLoad = true;
    }); 
    builder.addCase(DeleteTransactionThunk.fulfilled, (state, action) => {
      //   state.data = action.payload;
      state.delLoad = false;
    });
    builder.addCase(DeleteTransactionThunk.rejected, (state, action) => {
      state.error = action.error;
      state.delLoad = false;
    });
    builder.addCase(GetTransactionThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetTransactionThunk.fulfilled, (state, action) => {
      state.transdata = action.payload;
      state.loading = false;
    });
    builder.addCase(GetTransactionThunk.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default TransactionReducer.reducer;
