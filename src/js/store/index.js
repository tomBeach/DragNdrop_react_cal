// ======= src/js/store/index.js =======
import { createStore } from "redux";
import initDataReducer from "../reducers/index";

const store = createStore(initDataReducer);
export default store;
