import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import React from 'react'
import ProtectedRoute from "./protectedRoute";
import Auth from "./auth";
import Home from "./home";
import Profile from "./profile";
import Room from "./room";
import Game from "./game";

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
                <ProtectedRoute exact path="/room">
                    <Room/>
                </ProtectedRoute>
                <ProtectedRoute exact path="/room/:roomId">
                    <Game/>
                </ProtectedRoute>
                <Route exact path="/login">
                    <Auth currentForm="SignIn"/>
                </Route>
                <Route exact path="/signup">
                    <Auth currentForm="SignUp"/>
                </Route>
                <Route exact path='/game'>
                    <Game/>
                </Route>
            </Switch>
            {props.children}
        </BrowserRouter>
    )
}

export default Router