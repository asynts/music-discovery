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

    return json.artists.map(artist => {
        return {
            id: artist.id,
            name: artist.name,
        };
    });
}

export async function fetchRelatedArtistsIdsAsync(artist) {
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
