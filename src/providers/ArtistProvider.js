import { createContext, useCallback, useReducer } from "react";

import * as server from "../server.js";
import { ASSERT_NOT_REACHED } from "../util.js";

/*
ArtistId = string

Artist {
    id: ArtistId
    name: string
    expand: boolean
    viewed: boolean

    relatedArtistIds: list[ArtistId]?
    topTrackIds: list[TrackId]?
}

TrackId = string

Track {
    id: TrackId
    name: string
    viewed: boolean
    bookmarked: boolean?
    previewUrl: string
}

State {
    artists: map[ArtistId, Artist]
    rootArtistId: ArtistId?
    selectedArtistId: ArtistId?

    tracks: map[TrackId, Track]
    selectedTrackId: TrackId?
}
*/
let initialValue = {
    artists: {},
    rootArtistId: null,
    selectedArtistId: null,

    tracks: {},
    selectedTrackId: null,
};

let actions = {
    LOAD_ARTISTS_IF_NOT_EXIST: "LOAD_ARTISTS_IF_NOT_EXIST",
    SET_ARTISTS_EXPAND: "SET_ARTISTS_EXPAND",
    SET_ARTISTS_RELATED_ARTIST_IDS: "SET_ARTISTS_RELATED_ARTIST_IDS",
    SET_ARTISTS_TOP_TRACK_IDS: "SET_ARTISTS_TOP_TRACK_IDS",

    LOAD_TRACKS_IF_NOT_EXIST: "LOAD_TRACKS_IF_NOT_EXIST",
    SET_TRACKS_BOOKMARKED: "SET_TRACKS_BOOKMARKED",

    SET_SELECTED_ARTIST_ID: "SET_SELECTED_ARTIST_ID",
    SET_SELECTED_TRACK_ID: "SET_SELECTED_TRACK_ID",
    SET_ROOT_ARTIST_ID: "SET_ROOT_ARTIST_ID",
};

function reducer(state, action) {
    switch (action.type) {
    case actions.SET_TRACKS_BOOKMARKED:
        return {
            ...state,
            tracks: {
                ...state.tracks,
                [action.payload.id]: {
                    ...state.tracks[action.payload.id],
                    bookmarked: action.payload.value,
                },
            },
        };
    case actions.SET_ROOT_ARTIST_ID:
        return {
            ...state,
            rootArtistId: action.payload,
        };
    case actions.SET_SELECTED_TRACK_ID:
        return {
            ...state,
            tracks: {
                ...state.tracks,
                [action.payload]: {
                    ...state.tracks[action.payload],
                    viewed: true,
                },
            },
            selectedTrackId: action.payload,
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
    case actions.SET_ARTISTS_TOP_TRACK_IDS:
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
            artists: {
                ...state.artists,
                [action.payload]: {
                    ...state.artists[action.payload],
                    viewed: true,
                },
            },
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
    case actions.SET_ARTISTS_EXPAND:
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
    case actions.SET_ARTISTS_RELATED_ARTIST_IDS:
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

    let fetchArtistAsync = useCallback(async artistId => {
        let artist = await server.fetchArtistAsync(artistId);

        dispatch({
            type: actions.LOAD_ARTISTS_IF_NOT_EXIST,
            payload: [
                artist,
            ],
        });
    }, []);

    let fetchArtistRelatedArtists = useCallback(async artist => {
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
            type: actions.SET_ARTISTS_RELATED_ARTIST_IDS,
            payload: {
                id: artist.id,
                value: relatedArtists.map(artist => artist.id),
            },
        });
    }, [state.artists]);

    let fetchArtistTopTracksAsync = useCallback(async artist => {
        // Return early if already loaded.
        // The server could return different results, but we don't really care.
        if (artist.topTrackIds !== null) {
            return;
        }

        let topTracks = await server.fetchTopTracksForArtistAsync(artist.id);

        dispatch({
            type: actions.LOAD_TRACKS_IF_NOT_EXIST,
            payload: topTracks,
        });

        dispatch({
            type: actions.SET_ARTISTS_TOP_TRACK_IDS,
            payload: {
                id: artist.id,
                value: topTracks.map(track => track.id),
            },
        });
    }, []);

    let setArtistExpand = useCallback((artist, expand) => {
        dispatch({
            type: actions.SET_ARTISTS_EXPAND,
            payload: {
                id: artist.id,
                value: expand,
            },
        });
    }, []);

    let fetchTrackBookmarkedAsync = useCallback(async track => {
        // Return early if already loaded.
        if (track.bookmarked !== null) {
            return;
        }

        let bookmarked = await server.fetchTrackBookmarkAsync(track.id);

        dispatch({
            type: actions.SET_TRACKS_BOOKMARKED,
            payload: {
                id: track.id,
                value: bookmarked,
            }
        });
    }, []);

    let setTrackBookmarkedAsync = useCallback(async track => {
        if (track.bookmarked) {
            await server.bookmarkTrackAsync(track.id);
        } else {
            await server.unbookmarkTrackAsync(track.id);
        }

        dispatch({
            type: actions.SET_TRACKS_BOOKMARKED,
            payload: {
                id: track.id,
                value: !track.bookmarked,
            },
        });
    }, []);

    let setRootArtistAsync = useCallback(async rootArtistId => {
        await fetchArtistAsync(rootArtistId);

        dispatch({
            type: actions.SET_ROOT_ARTIST_ID,
            payload: rootArtistId,
        });
    }, [fetchArtistAsync]);

    let setSelectedArtist = useCallback(artist => {
        dispatch({
            type: actions.SET_SELECTED_ARTIST_ID,
            payload: artist.id,
        });
    }, []);

    let setSelectedTrack = useCallback(track => {
        dispatch({
            type: actions.SET_SELECTED_TRACK_ID,
            payload: track.id,
        });
    }, []);

    let getRelatedArtists = useCallback(artist => {
        if (artist.relatedArtistIds === null) {
            // Related artists are lazily loaded.
            return [];
        } else {
            return artist.relatedArtistIds
                .map(id => state.artists[id]);
        }
    }, [state.artists]);

    let getTopTracksForArtist = useCallback(artist => {
        if (artist.topTrackIds === null) {
            // Related tracks are lazily loaded.
            return [];
        } else {
            return artist.topTrackIds
                .map(id => state.tracks[id]);
        }
    }, [state.tracks]);

    let value = {
        artists: state.artists,
        rootArtist: state.artists[state.rootArtistId] || null,
        selectedArtist: state.artists[state.selectedArtistId] || null,
        selectedTrack: state.tracks[state.selectedTrackId] || null,

        fetchArtistAsync,
        fetchArtistRelatedArtists,
        fetchArtistTopTracksAsync,
        setArtistExpand,

        fetchTrackBookmarkedAsync,
        setTrackBookmarkedAsync,

        setRootArtistAsync,
        setSelectedArtist,
        setSelectedTrack,

        // FIXME: Do this automatically when mapping the members.
        getRelatedArtists,
        getTopTracksForArtist,
    };

    return (
        <ArtistContext.Provider value={value}>
            {props.children}
        </ArtistContext.Provider>
    );
}
