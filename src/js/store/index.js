// ======= src/js/store/index.js =======
import { createStore } from "redux";
import dataReducer from "../reducers/index";
const store = createStore(dataReducer);
export default store;
