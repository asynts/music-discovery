import { useContext, useEffect } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./ArtistDetails.css";

function ArtistDetails(props) {
    let {
        fetchTopTracksForArtistAsync,
        getTopTracksForArtist,
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
                {topTracks.map(track =>
                    <li className="track" key={track.id}>
                        {track.name}
                    </li>
                )}
            </ol>
        </div>
    );
}

export default ArtistDetails;
