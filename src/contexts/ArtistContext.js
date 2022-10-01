import { createContext, useReducer } from "react";

export class Artist {
    constructor(id, name, relatedArtistIds) {
        this.id = id;
        this.name = name;
        this.relatedArtistIds = relatedArtistIds;
    }
}

let initialValue = {
    artists: new Map([
        [1, new Artist(1, "Alice", [2, 4])],
        [2, new Artist(2, "Bob", [])],
        [3, new Artist(3, "Charlie", [])],
        [4, new Artist(4, "David", [3])],
    ]),
    rootArtistId: 1,
};

function reducer(state, action) {
    // FIXME
    return state;
}

export const ArtistContext = createContext();

export function ArtistProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialValue);

    let value = {
        artists: state.artists,
        rootArtist: state.artists.get(state.rootArtistId),

        getRelatedArtists(artist) {
            return artist.relatedArtistIds
                .map(id => state.artists.get(id));
        },
    };

    return (
        <ArtistContext.Provider value={value}>
            {props.children}
        </ArtistContext.Provider>
    );
}
