import { createStore } from "redux";
import { combineReducer } from "./combineReducer";

// persist redux
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
};

// export const store = createStore(
//     combineReducer
// )

const persistedReducer = persistReducer(persistConfig, combineReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
