import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import React from 'react'
import ProtectedRoute from "./protectedRoute";
import Auth from "./auth";

function Router(props) {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path="/">
                    <Redirect to="/home"/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/home">
                    <h1>Hello World</h1>
                </ProtectedRoute>
                <Route exact path="/login">
                    <Auth currentForm="SignIn"/>
                </Route>
                <Route exact path="/signup">
                    <Auth currentForm="SignUp"/>
                </Route>
            </Switch>
            {props.children}
        </BrowserRouter>
    )
}

export default Router