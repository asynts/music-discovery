import { useContext, useEffect } from "react";

import { FavoriteButton } from "./FavoriteButton.js";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./ArtistDetails.css";

function ArtistDetails(props) {
    let {
        fetchTopTracksForArtistAsync,
        getTopTracksForArtist,
        selectedTrack,
        setSelectedTrack,
    } = useContext(ArtistContext)

    useEffect(() => {
        if (props.artist !== null) {
            fetchTopTracksForArtistAsync(props.artist);
        }
    });

    let topTracks = null;
    if (props.artist !== null) {
        topTracks = getTopTracksForArtist(props.artist);
    } else {
        topTracks = [];
    }

    return (
        <div className="c-ArtistDetails">
            <div className="name">
                {props.artist === null ? "No artist selected." : props.artist.name}
            </div>
            <ol className="tracks">
                {topTracks.map(track => {
                    function onClick(event) {
                        setSelectedTrack(track);
                    }

                    let track_className = "track";

                    if (selectedTrack?.id === track.id) {
                        track_className += " selected";
                    }

                    if (track.viewed) {
                        track_className += " viewed";
                    }

                    return (
                        <li className={track_className} key={track.id}>
                            <span onClick={onClick} className="text">{track.name}</span> <FavoriteButton track={track} />
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

export default ArtistDetails;
