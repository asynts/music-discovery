import * as oauth from "@panva/oauth4webapi";

import { Base64 } from "js-base64";

let SPOTIFY_SCOPE = "user-library-read user-library-modify";

export function parseFromLocalStorage() {
    let clientId = localStorage.getItem("spotify-oauth-client-id");
    let clientSecret = localStorage.getItem("spotify-oauth-client-secret");
    let clientBasicAuthorization = Base64.encode(`${clientId}:${clientSecret}`);

    return {
        clientId,
        clientSecret,
        clientBasicAuthorization,

        savedState: localStorage.getItem("spotify-oauth-state"),
        savedCodeVerifier: localStorage.getItem("spotify-oauth-code-verifier"),

        accessToken: localStorage.getItem("spotify-oauth-access-token"),
        refreshToken: localStorage.getItem("spotify-oauth-refresh-token"),
    };
}

export function isAuthenticated() {
    let { accessToken } = parseFromLocalStorage();
    return accessToken !== null;
}

// This will redirect the user to Spotify.
// The user is asked to confirm that they want to give us access.
// Once confirmed they are redirected to the redirect URI which is handled by 'handleCodeResponseAsync'.
export async function redirectToSpotifyAuthenticationAsync({ clientId, clientSecret, redirectUri }) {
    localStorage.setItem("spotify-oauth-client-id", clientId);
    localStorage.setItem("spotify-oauth-client-secret", clientSecret);

    let state = oauth.generateRandomState();
    localStorage.setItem("spotify-oauth-state", state);

    // OAuth 2.0 Authorization Code Flow with PKCE.

    let codeVerifier = oauth.generateRandomCodeVerifier();
    localStorage.setItem("spotify-oauth-code-verifier", codeVerifier);
    let codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);

    let authorizationUrl = new URL("https://accounts.spotify.com/authorize");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("scope", SPOTIFY_SCOPE);
    authorizationUrl.searchParams.set("show_dialog", true);
    authorizationUrl.searchParams.set("show_dialog", true);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);

    window.location.href = authorizationUrl;
}

// We are provided with a code that we can exchange for an access token and a refresh token.
export async function handleCodeResponseAsync({ code, state, redirectUri }) {
    let {
        savedState,
        clientId,
        savedCodeVerifier,
        clientBasicAuthorization,
    } = parseFromLocalStorage();

    if (state !== savedState) {
        return false;
    }

    // If we use 'FormData' that will set the content type to multi-part which Spotify won't accept.
    let formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri.toString());
    formData.append("client_id", clientId);
    formData.append("code_verifier", savedCodeVerifier);

    let response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: formData,
        headers: new Headers({
            "Authorization": `Basic ${clientBasicAuthorization}`,
            "Content-Type": "application/x-www-form-urlencoded",
        }),
    });

    let json = await response.json();

    if (response.ok) {
        localStorage.setItem("spotify-oauth-access-token", json.access_token);
        localStorage.setItem("spotify-oauth-refresh-token", json.refresh_token);

        return true;
    } else {
        return false;
    }
}

// Use refresh token to obtain up-to-date access token.
export async function refreshAccessTokenAsync() {
    let { clientBasicAuthorization, refreshToken, clientId } = parseFromLocalStorage();

    let formData = new URLSearchParams();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refreshToken);
    formData.append("client_id", clientId);

    let response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: formData,
        headers: new Headers({
            "Authorization": `Basic ${clientBasicAuthorization}`,
            "Content-Type": "application/x-www-form-urlencoded",
        }),
    });

    let json = await response.json();

    if (response.ok) {
        localStorage.setItem("spotify-oauth-access-token", json.access_token);

        return true;
    } else {
        return false;
    }
}
