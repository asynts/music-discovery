import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { handleCodeResponseAsync } from "../auth.js";
import { useRedirectUri } from "../util.js";

// Route: /auth_endpoint
export function AuthPage(props) {
    let navigate = useNavigate();

    let [error, setError] = useState(null);

    let redirectUri = useRedirectUri();

    useEffect(() => {
        let urlSearchParameters = new URLSearchParams(window.location.search.substring(1));

        handleCodeResponseAsync({
            code: urlSearchParameters.get("code"),
            state: urlSearchParameters.get("state"),
            redirectUri,
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
