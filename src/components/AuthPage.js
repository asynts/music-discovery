import { useNavigate, useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleCodeResponseAsync } from "../auth";

// Route: /auth_endpoint
export function AuthPage(props) {
    let navigate = useNavigate();
    let resolvePath = useResolvedPath();

    let [error, setError] = useState(null);

    useEffect(() => {
        // Extract the access token from the URL fragment.
        // There are some technical reasons why this is being passed in the fragment and not in the query.
        let urlSearchParameters = new URLSearchParams(window.location.hash.substring(1));

        handleCodeResponseAsync({
            code: urlSearchParameters.get("code"),
            state: urlSearchParameters.get("state"),
            redirectUri: resolvePath("/auth_endpoint"),
        })
            .then(success => {
                if (success) {
                    navigate("/");
                } else {
                    setError("authentication failed");
                }
            });
    });

    return (
        <>
            {error === null ? <>Obtaining access token...</> : <>Error: {error}</>}
        </>
    );
}
