import { useContext } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";
import { getSpotifyToken } from "../providers/AuthProvider.js";

import SpotifyPlayer from "react-spotify-web-playback";

import "./Player.css";

function Player(props) {
    let { selectedTrack } = useContext(ArtistContext)

    console.log(selectedTrack?.spotifyUri);

    return(
        <div className="c-Player">
            <SpotifyPlayer
                name="Discover Music!"
                token={getSpotifyToken()}
                uris={selectedTrack === null ? [] : [selectedTrack.spotifyUri]} />
        </div>
    );
}

export default Player;
