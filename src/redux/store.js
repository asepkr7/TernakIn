import { combineReducers } from "redux";
import { productReducer } from "./reducers/productReducer";

export const reducers = combineReducers({
    product: productReducer,
})