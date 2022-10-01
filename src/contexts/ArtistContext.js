import { createContext, useReducer } from "react";

function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

/*
Artist {
    id: int
    name: string
    relatedArtistIds: list[int]
}
*/

let initialValue = {
    artists: {
        "1": { id: "1", name: "Alice", relatedArtistIds: ["2", "4"] },
        "2": { id: "2", name: "Bob", relatedArtistIds: [] },
        "3": { id: "3", name: "Charlie", relatedArtistIds: [] },
        "4": { id: "4", name: "David", relatedArtistIds: ["3"] },
    },
    rootArtistId: "1",
};

let actions = {
    SET_EXPAND: "SET_EXPAND",
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

        getRelatedArtists(artist) {
            return artist.relatedArtistIds
                .map(id => state.artists[id]);
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

    return (
        <ArtistContext.Provider value={value}>
            {props.children}
        </ArtistContext.Provider>
    );
}
