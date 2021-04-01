import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import React from 'react'
import ProtectedRoute from "./protectedRoute";
import Auth from "./auth";
import Home from "./home";
import Profile from "./profile";
import Game from "./game"
function Router(props) {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path="/">
                    <Redirect to="/home"/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/home">
                    <Home />
                </ProtectedRoute>
                <ProtectedRoute exact path="/profile">
                    <Profile />
                </ProtectedRoute>
                <Route exact path="/login">
                    <Auth currentForm="SignIn"/>
                </Route>
                <Route exact path="/signup">
                    <Auth currentForm="SignUp"/>
                </Route>
                <Route>
                    <Game/>
                </Route>
            </Switch>
            {props.children}
        </BrowserRouter>
    )
}

export default Router