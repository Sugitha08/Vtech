import { configureStore } from "@reduxjs/toolkit";
import RootReducer from "./reducers";

const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
