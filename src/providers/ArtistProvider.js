import { createContext, useReducer } from "react";

import * as server from "../server.js";

function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

/*
ArtistId = string

Artist {
    id: ArtistId
    name: string
    expand: boolean

    relatedArtistIds: list[ArtistId]?
    topTrackIds: list[TrackId]?

    playerPlaying: boolean
}

TrackId = string

Track {
    id: TrackId
    name: string
    spotifyUri: string?
}

State {
    artists: map[ArtistId, Artist]
    rootArtistId: ArtistId
    selectedArtistId: ArtistId?

    tracks: map[TrackId, Track]
    selectedTrackId: TrackId?
}
*/
let initialValue = {
    artists: {
        "6XyY86QOPPrYVGvF9ch6wz": {
            id: "6XyY86QOPPrYVGvF9ch6wz",
            name: "Linkin Park",
            relatedArtistIds: null,
            topTrackIds: null,
            expand: false,
        },
    },
    rootArtistId: "6XyY86QOPPrYVGvF9ch6wz",
    selectedArtistId: null,

    tracks: {},
    selectedTrackId: null,

    playerPlaying: false,
};

let actions = {
    SET_EXPAND: "SET_EXPAND",
    SET_RELATED_ARTIST_IDS: "SET_RELATED_ARTIST_IDS",
    SET_SELECTED_ARTIST_ID: "SET_SELECTED_ARTIST_ID",
    LOAD_ARTISTS_IF_NOT_EXIST: "LOAD_ARTISTS_IF_NOT_EXIST",
    LOAD_TRACKS_IF_NOT_EXIST: "LOAD_TRACKS_IF_NOT_EXIST",
    SET_TOP_TRACK_IDS: "SET_TOP_TRACK_IDS",
    SET_SELECTED_TRACK_ID: "SET_SELECTED_TRACK_ID",
    SET_PLAYER_PLAYING: "SET_PLAYER_PLAYING",
};

function reducer(state, action) {
    switch (action.type) {
    case actions.SET_SELECTED_TRACK_ID:
        return {
            ...state,
            selectedTrackId: action.payload,
        };
    case actions.SET_PLAYER_PLAYING:
        return {
            ...state,
            playerPlaying: action.payload,
        };
    case actions.LOAD_TRACKS_IF_NOT_EXIST:
        let newTracks = {};
        for (let track of action.payload) {
            newTracks[track.id] = track;
        }

        return {
            ...state,
            tracks: {
                // First take the new values, then override with existing values.
                ...newTracks,
                ...state.tracks,
            }
        };
    case actions.SET_TOP_TRACK_IDS:
        return {
            ...state,
            artists: {
                ...state.artists,
                [action.payload.id]: {
                    ...state.artists[action.payload.id],
                    topTrackIds: action.payload.value,
                },
            },
        };
    case actions.SET_SELECTED_ARTIST_ID:
        return {
            ...state,
            selectedArtistId: action.payload,
        };
    case actions.LOAD_ARTISTS_IF_NOT_EXIST:
        let newArtists = {};
        for (let artist of action.payload) {
            newArtists[artist.id] = artist;
        }

        return {
            ...state,
            artists: {
                // First take the new values, then override with existing values.
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
        selectedArtist: state.artists[state.selectedArtistId] || null,
        selectedTrack: state.tracks[state.selectedTrackId] || null,
        playerPlaying: state.playerPlaying,

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

            dispatch({
                type: actions.SET_RELATED_ARTIST_IDS,
                payload: {
                    id: artist.id,
                    value: relatedArtists.map(artist => artist.id),
                },
            });
        },
        async fetchTopTracksForArtistAsync(artist) {
            // Return early if already loaded.
            // The server could return different results, but we don't really care.
            if (artist.topTrackIds !== null) {
                return;
            }

            let topTracks = await server.fetchTopTracksForArtist(artist.id);

            dispatch({
                type: actions.LOAD_TRACKS_IF_NOT_EXIST,
                payload: topTracks,
            });

            dispatch({
                type: actions.SET_TOP_TRACK_IDS,
                payload: {
                    id: artist.id,
                    value: topTracks.map(track => track.id),
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
        getTopTracksForArtist(artist) {
            if (artist.topTrackIds === null) {
                // Related tracks are lazily loaded.
                // The caller should trigger 'fetchTopTracksForArtistAsync' in 'useEffect'.
                return [];
            } else {
                return artist.topTrackIds
                    .map(id => state.tracks[id]);
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
        setSelectedArtist(artist) {
            dispatch({
                type: actions.SET_SELECTED_ARTIST_ID,
                payload: artist.id,
            });
        },
        setSelectedTrack(track) {
            // Unfortunately, we can not do this in a single action because the library is broken.
            dispatch({
                type: actions.SET_SELECTED_TRACK_ID,
                payload: track.id,
            });
            this.setPlayerPlaying(true);
        },
        setPlayerPlaying(playing) {
            dispatch({
                type: actions.SET_PLAYER_PLAYING,
                payload: playing,
            });
        },
    };

    value.fetchRelatedArtistsAsync = value.fetchRelatedArtistsAsync.bind(value);
    value.getRelatedArtists = value.getRelatedArtists.bind(value);
    value.toggleExpand = value.toggleExpand.bind(value);
    value.setSelectedTrack = value.setSelectedTrack.bind(value);

    return (
        <ArtistContext.Provider value={value}>
            {props.children}
        </ArtistContext.Provider>
    );
}
