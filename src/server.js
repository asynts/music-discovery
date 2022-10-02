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
