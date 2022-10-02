import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as oauth from "@panva/oauth4webapi";

let SPOTIFY_CLIENT_ID = "e65e5a2379654a8782ac21646029ca66";
let SPOTIFY_SCOPE = "";

function ASSERT(condition) {
    if (!condition) {
        throw new Error("ASSERT");
    }
}

async function connectSpotifyAsync() {
    if (localStorage.getItem("spotify-api-token") !== null) {
        // FIXME: Verify that the code is still valid.
        return;
    }

    let redirectUrl = "http://localhost:3000/auth_endpoint";

    let codeVerifier = oauth.generateRandomCodeVerifier();
    let codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);

    let authorizationUrl = new URL("https://accounts.spotify.com/authorize");
    authorizationUrl.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("redirect_uri", redirectUrl);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", SPOTIFY_SCOPE);

    window.location.href = authorizationUrl;
}

export function AuthProvider(props) {
    let [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!authenticated) {
            // If we don't have a valid token, this will redirect the browser.
            // Therefore, if we return we are visiting this for the second time.
            connectSpotifyAsync()
                .then(setAuthenticated(true));
        }
    }, [authenticated]);

    return (
        <>
            {authenticated ? props.children : <>Loading...</>}
        </>
    );
}

export function AuthEndpoint(props) {
    let navigate = useNavigate();

    useEffect(() => {
        // Spotify will redirect here with '?code=X' in the URL.
        // This is how OAuth 2.0 works.
        let urlSearchParameters = new URLSearchParams(window.location.search);
        ASSERT(urlSearchParameters.get("code") !== null);
        localStorage.setItem("spotify-api-token", urlSearchParameters.get("code"));

        navigate("/");
    });

    return (
        <>
            Logging in...
        </>
    );
}
