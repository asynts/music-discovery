import * as oauth from "@panva/oauth4webapi";

let SPOTIFY_CLIENT_ID = "e65e5a2379654a8782ac21646029ca66";
let SPOTIFY_SCOPE = "";

// FIXME: We need to listen for the redirect url.

async function connectSpotifyAsync() {
    if (localStorage.getItem("spotify-api-code") !== null) {
        // FIXME: Verify that the code still works.
        return;
    }

    let redirectUrl = "http://localhost:3000/oauth_redirect";

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
// connectSpotifyAsync();

export async function fetchRelatedArtistsIdsAsync({ artist, signal }) {
    console.log(`fetchRelatedArtistsIdsAsync(${artist.id})`);

    let lookup = {
        "1": ["2", "4"],
        "2": [],
        "3": [],
        "4": ["3"],
    };

    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });

    return lookup[artist.id];
}
