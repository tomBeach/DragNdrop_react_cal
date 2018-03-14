// ======= src/js/index.js =======
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PropTypes from 'prop-types';
import store from "../js/store/index";
import App from "../js/components/App";
require('./styles.scss');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
