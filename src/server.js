import { parseFromLocalStorage, refreshAccessTokenAsync } from "./auth.js";

async function spotifyApiRequest(method, path, body = undefined) {
    let { accessToken } = parseFromLocalStorage();

    let response = await fetch(`https://api.spotify.com/v1${path}`, {
        method: method,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`,
        }),
    });

    let text = await response.text();

    // We have to be careful here, the server doesn't always return a JSON object.
    let json = null;
    if (text.length >= 1) {
        json = JSON.parse(text);

        if (json.error?.status === 401 && json.error?.message === "The access token expired") {
            if (await refreshAccessTokenAsync()) {
                return spotifyApiRequest(method, path, body);
            } else {
                console.log("error: unable to refresh access token")
            }
        }
    }

    if (!response.ok) {
        console.log("error: spotify returned error", json);
    }

    return json;
}

export async function fetchArtistAsync(artist_id) {
    console.log(`fetchArtistAsync('${artist_id}')`);

    let json = await spotifyApiRequest("GET", `/artists/${artist_id}`);

    return {
        id: json.id,
        name: json.name,
        expand: false,
        viewed: false,
        relatedArtistIds: null,
        topTrackIds: null,
    };
}

export async function fetchRelatedArtistsAsync(artist_id) {
    console.log(`fetchRelatedArtistsAsync('${artist_id}')`);

    let json = await spotifyApiRequest("GET", `/artists/${artist_id}/related-artists`);

    return json.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        expand: false,
        viewed: false,
        relatedArtistIds: null,
        topTrackIds: null,
    }));
}

export async function fetchTopTracksForArtistAsync(artist_id) {
    console.log(`fetchTopTracksForArtistAsync(${artist_id})`);

    let json = await spotifyApiRequest("GET", `/artists/${artist_id}/top-tracks?market=DE`);

    return json.tracks.map(track => ({
        id: track.id,
        name: track.name,
        viewed: false,
        bookmarked: null,
        previewUrl: track.preview_url,
    }));
}

export async function fetchTrackBookmarkAsync(track_id) {
    console.log(`fetchTrackBookmarkAsync(${track_id})`);

    let json = await spotifyApiRequest("GET", `/me/tracks/contains?ids=${track_id}`);

    return json[0];
}

export async function bookmarkTrackAsync(track_id) {
    console.log(`bookmarkTrackAsync(${track_id})`);

    await spotifyApiRequest("PUT", `/me/tracks`, {
        ids: [
            track_id,
        ],
    });
}

export async function unbookmarkTrackAsync(track_id) {
    console.log(`unbookmarkTrackAsync(${track_id})`);

    await spotifyApiRequest("DELETE", `/me/tracks`, {
        ids: [
            track_id,
        ],
    });
}
