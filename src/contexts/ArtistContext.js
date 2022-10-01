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

    // Use state machine to avoid race condition.
    // We only want to send one request, we don't expect the answer to change.
    relatedArtistIds: list[int]?
    relatedArtistStatus: RELATED_ARTIST_UNKNOWN | RELATED_ARTIST_LOADING | RELATED_ARTIST_KNOWN
}
*/

let RELATED_ARTIST_UNKNOWN = "unknown";
let RELATED_ARTIST_LOADING = "loading";
let RELATED_ARTIST_KNOWN = "known";

let initialValue = {
    artists: {
        "1": { id: "1", name: "Alice", relatedArtistIds: null, relatedArtistStatus: RELATED_ARTIST_UNKNOWN },
        "2": { id: "2", name: "Bob", relatedArtistIds: null, relatedArtistStatus: RELATED_ARTIST_UNKNOWN },
        "3": { id: "3", name: "Charlie", relatedArtistIds: null, relatedArtistStatus: RELATED_ARTIST_UNKNOWN },
        "4": { id: "4", name: "David", relatedArtistIds: null, relatedArtistStatus: RELATED_ARTIST_UNKNOWN },
    },
    rootArtistId: "1",
};

let actions = {
    SET_EXPAND: "SET_EXPAND",
    SET_RELATED_ARTIST_IDS: "SET_RELATED_ARTIST_IDS",
    SET_RELATED_ARTIST_STATUS: "SET_RELATED_ARTIST_STATUS",
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
                    expand: action.payload.expand,
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
                    relatedArtistIds: action.payload.relatedArtistIds,
                },
            },
        };
    case actions.SET_RELATED_ARTIST_STATUS:
        return {
            ...state,
            artists: {
                ...state.artists,
                [action.payload.id]: {
                    ...state.artists[action.payload.id],
                    relatedArtistStatus: action.payload.relatedArtistStatus,
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
            // FIXME: Somehow, this guard does not appear to work.
            //        If I comment out the 'expand' thing in 'useEffect' in 'ArtistTree', it runs at least twice.
            if (artist.relatedArtistStatus === RELATED_ARTIST_UNKNOWN) {
                dispatch({
                    type: actions.SET_RELATED_ARTIST_STATUS,
                    payload: {
                        id: artist.id,
                        relatedArtistStatus: RELATED_ARTIST_LOADING,
                    },
                });

                let ids = await server.fetchRelatedArtistsIdsAsync(artist);
                dispatch({
                    type: actions.SET_RELATED_ARTIST_IDS,
                    payload: {
                        id: artist.id,
                        relatedArtistIds: ids,
                    },
                });

                dispatch({
                    type: actions.SET_RELATED_ARTIST_STATUS,
                    payload: {
                        id: artist.id,
                        relatedArtistStatus: RELATED_ARTIST_KNOWN,
                    },
                });
            } else {
                // We assume that the artists don't change, therefore, we don't have to do anything.
            }
        },
        getRelatedArtists(artist) {
            if (artist.relatedArtistStatus === RELATED_ARTIST_KNOWN) {
                return artist.relatedArtistIds
                    .map(id => state.artists[id]);
            } else {
                // The caller should trigger 'fetchRelatedArtistsAsync' in 'useEffect'.
                return [];
            }
        },
        toggleExpand(artist) {
            dispatch({
                type: actions.SET_EXPAND,
                payload: {
                    id: artist.id,
                    expand: !artist.expand,
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
