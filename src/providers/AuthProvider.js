import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as oauth from "@panva/oauth4webapi";

let SPOTIFY_CLIENT_ID = "e65e5a2379654a8782ac21646029ca66";
let SPOTIFY_SCOPE = "";
let SPOTIFY_REDIRECT_URL = "http://localhost:3000/auth_endpoint";

function ASSERT(condition) {
    if (!condition) {
        throw new Error("ASSERT");
    }
}

function getSpotifyToken() {
    return localStorage.getItem("spotify-oauth-token");
}

function redirectToSpotifyAuthorizeEndpointIfNecessary() {
    // If we already have a token just return.
    if (getSpotifyToken() !== null) {
        return;
    }

    let state = oauth.generateRandomState();
    localStorage.setItem("spotify-oauth-state", state);

    let authorizationUrl = new URL("https://accounts.spotify.com/authorize");
    authorizationUrl.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
    authorizationUrl.searchParams.set("response_type", "token");
    authorizationUrl.searchParams.set("redirect_uri", SPOTIFY_REDIRECT_URL);
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("scope", SPOTIFY_SCOPE);

    window.location.href = authorizationUrl;
}

export function AuthProvider(props) {
    let [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!authenticated) {
            // If we don't have a valid token, this will redirect the browser.
            // This call only returns if we already have an authentication token.
            redirectToSpotifyAuthorizeEndpointIfNecessary();
            setAuthenticated(true);
        }
    }, [authenticated]);

    return (
        <>
            {authenticated ? props.children : <>Loading...</>}
        </>
    );
}

// This is what the 'redirect_url' in the authentication request points to.
export function AuthEndpoint(props) {
    let navigate = useNavigate();

    let mutableNavigationInitiated = useRef(false);

    useEffect(() => {
        // It seems that 'navigate' triggers the effect again, prevent that.
        if (mutableNavigationInitiated.current) {
            return;
        }

        console.log(window.location.href);

        // Extract the access token from the URL fragment.
        // There are some technical reasons why this is being passed in the fragment and not in the query.
        let urlSearchParameters = new URLSearchParams(window.location.hash.substring(1));

        console.log(urlSearchParameters.get("state"), urlSearchParameters.get("access_token"));
        console.log(localStorage.getItem("spotify-oauth-state"))

        ASSERT(urlSearchParameters.get("state") === localStorage.getItem("spotify-oauth-state"));
        localStorage.setItem("spotify-oauth-token", urlSearchParameters.get("access_token"));

        mutableNavigationInitiated.current = true;
        navigate("/");
    });

    return (
        <>
            Loading...
        </>
    );
}
