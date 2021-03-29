import React, {useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {IdentityContext} from "../App";

function ProtectedRoute({children, ...rest}) {
    const {identity} = useContext(IdentityContext)
    return (
        <Route
            {...rest}
            render={({ location }) =>
                (identity) ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    )
}

export default ProtectedRoute