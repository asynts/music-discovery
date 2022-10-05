import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../auth";

export function AuthProvider(props) {
    return (
        <>
            {isAuthenticated() ? props.children : <Navigate to="/" />}
        </>
    );
}
