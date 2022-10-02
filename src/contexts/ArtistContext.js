import { createContext, useReducer } from "react";

import * as server from "../server.js";

function ASSERT(condition) {
    if (!condition) {
        throw new Error("ASSERT");
    }
}

function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

/*
Artist {
    id: int
    name: string

    relatedArtistIds: list[int]?
}
*/

let initialValue = {
    artists: {
        "1": { id: "1", name: "Alice", relatedArtistIds: null },
        "2": { id: "2", name: "Bob", relatedArtistIds: null },
        "3": { id: "3", name: "Charlie", relatedArtistIds: null },
        "4": { id: "4", name: "David", relatedArtistIds: null },
    },
    rootArtistId: "1",
};

let actions = {
    SET_EXPAND: "SET_EXPAND",
    SET_RELATED_ARTIST_IDS: "SET_RELATED_ARTIST_IDS",
};

function reducer(state, action) {
    switch (action.type) {
    case actions.SET_EXPAND:
        return {
            ...state,
            artists: {
                ...state.artists,
                [action.payload.id]: {
                    ...state.artists[action.payload.id],
                    expand: action.payload.value,
                },
            },
        };
    case actions.SET_RELATED_ARTIST_IDS:
        return {
            ...state,
            artists: {
                ...state.artists,
                [action.payload.id]: {
                    ...state.artists[action.payload.id],
                    relatedArtistIds: action.payload.value,
                },
            },
        };
    default:
        ASSERT_NOT_REACHED();
    }
}

export const ArtistContext = createContext();

export function ArtistProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialValue);

    let value = {
        artists: state.artists,
        rootArtist: state.artists[state.rootArtistId],

        async fetchRelatedArtistsAsync(artist) {
            // The server could return different results, but we don't really care.
            if (artist.relatedArtistIds !== null) {
                return;
            }

            let relatedArtistIds = await server.fetchRelatedArtistsIdsAsync(artist);

            // This is safe, even if the request was made multiple times.
            dispatch({
                type: actions.SET_RELATED_ARTIST_IDS,
                payload: {
                    id: artist.id,
                    value: relatedArtistIds,
                },
            });
        },
        getRelatedArtists(artist) {
            if (artist.relatedArtistIds === null) {
                // Related artists are lazily loaded.
                // The caller should trigger 'fetchRelatedArtistsAsync' in 'useEffect'.
                return [];
            } else {
                return artist.relatedArtistIds
                    .map(id => state.artists[id]);
            }
        },
        toggleExpand(artist) {
            dispatch({
                type: actions.SET_EXPAND,
                payload: {
                    id: artist.id,
                    value: !artist.expand,
                },
            });
        },
    };

    value.fetchRelatedArtistsAsync = value.fetchRelatedArtistsAsync.bind(value);
    value.getRelatedArtists = value.getRelatedArtists.bind(value);
    value.toggleExpand = value.toggleExpand.bind(value);

    return (
        <ArtistContext.Provider value={value}>
            {props.children}
        </ArtistContext.Provider>
    );
}
