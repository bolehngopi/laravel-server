
require('./bootstrap');

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();
const container = document.getElementById('app');

if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <Router history={browserHistory}>
            <Route path="/" component={Example} />
            <Route path="/profile" component={Profile} />
        </Router>
    );
}
