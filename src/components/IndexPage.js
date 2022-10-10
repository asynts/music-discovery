import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NorthStar } from "./NorthStar.js";

import { isAuthenticated, redirectToSpotifyAuthenticationAsync } from "../auth.js";
import { useRedirectUri } from "../util.js";

function RootArtistForm(props) {
    let [artistId, setArtistId] = useState("");

    let navigate = useNavigate();

    function onChange(event) {
        setArtistId(event.target.value);
    }

    function onKeyDown(event) {
        if (event.key === "Enter") {
            navigate(`/discover/${artistId}`);
        }
    }

    return (
        <div className="c-RootArtistForm">
            <div>
                Please enter a Spotify Artist ID to start searching from.<br />
                Examples:<br />
                <pre><code>Linkin Park:       https://open.spotify.com/artist/<b>6XyY86QOPPrYVGvF9ch6wz</b><br />
Twenty One Pilots: https://open.spotify.com/artist/<b>3YQKmKGau1PzlVlkL1iodx</b></code></pre>
            </div>
            <input placeholder="Spotify Artist ID" value={artistId} onChange={onChange} onKeyDown={onKeyDown} />
        </div>
    );
}

function AuthForm(props) {
    let redirectUri = useRedirectUri();

    function onClick(event) {
        redirectToSpotifyAuthenticationAsync({ redirectUri });
    }

    return (
        <div className="c-AuthForm">
            <div>
                You need to authorize this application to use Spotify on your behalf.
            </div>
            <button onClick={onClick}>Login with Spotify</button>
        </div>
    );
}

// Route: /
export function IndexPage(props) {
    return (
        <div className="c-IndexPage">
            <NorthStar />
            {isAuthenticated() ? <RootArtistForm /> : <AuthForm />}
        </div>
    );
}
