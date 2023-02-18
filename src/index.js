import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import PlayPage from './pages/PlayPage';
import LandingPage from './pages/LandingPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router basename={`/${process.env.PUBLIC_URL}`}>
            <Switch>
                <Route exact path="/">
                    <LandingPage />
                </Route>
                <Route exact path="/technique/:player">
                    <PlayPage />
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>
);

