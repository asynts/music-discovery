import { useContext } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";
import { getSpotifyToken } from "../providers/AuthProvider.js";

import SpotifyPlayer from "react-spotify-web-playback";

import "./Player.css";

function Player(props) {
    let { selectedTrack, playerPlaying, setPlayerPlaying } = useContext(ArtistContext)

    function callback(state) {
        if (state.type === "player_update") {
            setPlayerPlaying(state.isPlaying);
        }
    }

    return(
        <div className="c-Player">
            <SpotifyPlayer
                name="Discover Music!"
                token={getSpotifyToken()}
                uris={selectedTrack === null ? [] : [selectedTrack.spotifyUri]}
                play={playerPlaying}
                callback={callback} />
        </div>
    );
}

export default Player;
