import { useContext } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./Player.css";

function Player(props) {
    let { selectedTrack } = useContext(ArtistContext)

    return(
        <div className="c-Player">
            <audio className="audio" controls autoPlay src={selectedTrack?.previewUrl} />
        </div>
    );
}

export default Player;
