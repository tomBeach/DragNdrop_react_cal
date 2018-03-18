// ======= src/js/index.js =======
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PropTypes from 'prop-types';
import store from "./store/index";
import App from "./components/App";

require('../../sass/styles.scss');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
