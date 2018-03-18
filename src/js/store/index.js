// ======= src/js/store/index.js =======
import { createStore } from "redux";
import dataReducers from "../reducers/index";
const store = createStore(dataReducers);
export default store;
