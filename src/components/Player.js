import { useContext } from "react";

import { FavoriteButton } from "./FavoriteButton.js";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./Player.css";

function Player(props) {
    let { selectedTrack } = useContext(ArtistContext)

    return(
        <div className="c-Player">
            <audio className="audio" controls autoPlay src={selectedTrack?.previewUrl} />
            <FavoriteButton track={selectedTrack} />
        </div>
    );
}

export default Player;
