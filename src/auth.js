import * as oauth from "@panva/oauth4webapi";

let SPOTIFY_CLIENT_ID = "e65e5a2379654a8782ac21646029ca66";
let SPOTIFY_SCOPE = "";
let SPOTIFY_REDIRECT_URL = "http://localhost:3000/auth_endpoint";

export function getSpotifyToken() {
    return localStorage.getItem("spotify-oauth-token");
}

export function redirectToSpotifyAuthentication() {
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
