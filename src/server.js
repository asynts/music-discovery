import { getSpotifyToken } from "./providers/AuthProvider.js"

async function spotifyApiGET(path) {
    let response = await fetch(`https://api.spotify.com/v1${path}`, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${getSpotifyToken()}`,
        }),
    });

    return await response.json();
}

export async function fetchArtistAsync(artist_id) {
    console.log(`fetchArtistAsync('${artist_id}')`);

    let json = await spotifyApiGET(`/artists/${artist_id}`);

    return {
        id: json.id,
        name: json.name,
    };
}

export async function fetchRelatedArtistsAsync(artist_id) {
    console.log(`fetchRelatedArtistsAsync('${artist_id}')`);

    let json = await spotifyApiGET(`/artists/${artist_id}/related-artists`);

    return json.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        expand: false,
        relatedArtistIds: null,
        topTrackIds: null,
    }));
}

export async function fetchTopTracksForArtist(artist_id) {
    console.log(`fetchTopTracksForArtist(${artist_id})`);

    let json = await spotifyApiGET(`/artists/${artist_id}/top-tracks?market=DE`);

    return json.tracks.map(track => ({
        id: track.id,
        name: track.name,
    }));
}
