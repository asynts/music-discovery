import { createContext, useReducer } from "react";

import * as server from "../server.js";

function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

/*
Artist {
    id: int
    name: string
    expand: boolean

    relatedArtistIds: list[int]?
}
*/

let initialValue = {
    artists: {
        "6XyY86QOPPrYVGvF9ch6wz": {
            id: "6XyY86QOPPrYVGvF9ch6wz",
            name: "Linkin Park",
            relatedArtistIds: null,
            expand: false,
        },
    },
    rootArtistId: "6XyY86QOPPrYVGvF9ch6wz",
};

let actions = {
    SET_EXPAND: "SET_EXPAND",
    SET_RELATED_ARTIST_IDS: "SET_RELATED_ARTIST_IDS",
    LOAD_ARTISTS_IF_NOT_EXIST: "LOAD_ARTISTS_IF_NOT_EXIST",
};

function reducer(state, action) {
    switch (action.type) {
    case actions.LOAD_ARTISTS_IF_NOT_EXIST:
        let newArtists = {};
        for (let newArtist of action.payload) {
            newArtists[newArtist.id] = newArtist;
        }

        return {
            ...state,
            artists: {
                // First take the new values, then override with existing values.
                // Thus we keep all the related artist that have been loaded already.
                ...newArtists,
                ...state.artists,
            },
        };
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
            // Return early if already loaded.
            // The server could return different results, but we don't really care.
            if (artist.relatedArtistIds !== null) {
                return;
            }

            let relatedArtists = await server.fetchRelatedArtistsAsync(artist.id);

            // Prevent infinite loop where artists are directly or indirectly related to themselves.
            // We simply sort out artists that are already known to us.
            relatedArtists = relatedArtists.filter(artist => !(artist.id in state.artists));

            dispatch({
                type: actions.LOAD_ARTISTS_IF_NOT_EXIST,
                payload: relatedArtists,
            });

            // This is safe, even if the request was made multiple times.
            dispatch({
                type: actions.SET_RELATED_ARTIST_IDS,
                payload: {
                    id: artist.id,
                    value: relatedArtists.map(artist => artist.id),
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
