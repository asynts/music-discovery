import { createContext, useReducer } from "react";

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
    isFavorite: boolean?
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
    SET_EXPAND: "SET_EXPAND",
    SET_RELATED_ARTIST_IDS: "SET_RELATED_ARTIST_IDS",
    SET_SELECTED_ARTIST_ID: "SET_SELECTED_ARTIST_ID",
    LOAD_ARTISTS_IF_NOT_EXIST: "LOAD_ARTISTS_IF_NOT_EXIST",
    LOAD_TRACKS_IF_NOT_EXIST: "LOAD_TRACKS_IF_NOT_EXIST",
    SET_TOP_TRACK_IDS: "SET_TOP_TRACK_IDS",
    SET_SELECTED_TRACK_ID: "SET_SELECTED_TRACK_ID",
    SET_ROOT_ARTIST_ID: "SET_ROOT_ARTIST_ID",
    SET_TRACK_IS_FAVORITE: "SET_TRACK_IS_FAVORITE",
};

function reducer(state, action) {
    switch (action.type) {
    case actions.SET_TRACK_IS_FAVORITE:
        return {
            ...state,
            tracks: {
                ...state.tracks,
                [action.payload.id]: {
                    ...state.tracks[action.payload.id],
                    isFavorite: action.payload.value,
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

async function fetchArtistAsync({ dispatch, artistId }) {
    let artist = await server.fetchArtistAsync(artistId);

    dispatch({
        type: actions.LOAD_ARTISTS_IF_NOT_EXIST,
        payload: [
            artist,
        ],
    });
}

async function setRootArtistAsync({ dispatch, rootArtistId }) {
    await fetchArtistAsync({ dispatch, artistId: rootArtistId });

    dispatch({
        type: actions.SET_ROOT_ARTIST_ID,
        payload: rootArtistId,
    });
}

export function ArtistProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialValue);

    let value = {
        artists: state.artists,
        rootArtist: state.artists[state.rootArtistId] || null,
        selectedArtist: state.artists[state.selectedArtistId] || null,
        selectedTrack: state.tracks[state.selectedTrackId] || null,

        fetchArtistAsync: artistId => fetchArtistAsync({ dispatch, artistId }),
        setRootArtistAsync: rootArtistId => setRootArtistAsync({ dispatch, rootArtistId }),

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

            let topTracks = await server.fetchTopTracksForArtistAsync(artist.id);

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
            dispatch({
                type: actions.SET_SELECTED_TRACK_ID,
                payload: track.id,
            });
        },
        async toggleTrackIsFavoriteAsync(track) {
            if (track.isFavorite) {
                await server.unmarkTrackAsFavoriteAsync(track.id);
            } else {
                await server.markTrackAsFavoriteAsync(track.id);
            }

            dispatch({
                type: actions.SET_TRACK_IS_FAVORITE,
                payload: {
                    id: track.id,
                    value: !track.isFavorite,
                },
            });
        },
        async fetchTrackIsFavoriteAsync(track) {
            // Return early if already loaded.
            if (track.isFavorite !== null) {
                return;
            }

            let isFavorite = await server.fetchTrackIsFavoriteAsync(track.id);

            dispatch({
                type: actions.SET_TRACK_IS_FAVORITE,
                payload: {
                    id: track.id,
                    value: isFavorite,
                }
            });
        }
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
