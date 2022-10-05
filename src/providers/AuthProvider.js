import { Navigate } from "react-router-dom";

import { parseFromLocalStorage } from "../auth";

export function AuthProvider(props) {
    let { accessToken } = parseFromLocalStorage();

    return (
        <>
            {accessToken ? props.children : <Navigate to="/" />}
        </>
    );
}
