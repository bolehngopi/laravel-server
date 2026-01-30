
require('./bootstrap');

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Posts } from './components/Post';
import { CreatePost } from './components/CreatePost';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <Router>
            <Switch>
                <Route exact path="/" component={Posts} />
                <Route path="/create" component={CreatePost} />
            </Switch>
        </Router>
    );
}
