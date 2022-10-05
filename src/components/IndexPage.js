import { useId, useState } from "react";
import { useNavigate, useResolvedPath } from "react-router-dom";

import { NorthStar } from "./NorthStar.js";

import { getSpotifyToken, redirectToSpotifyAuthentication } from "../auth.js";

import "./IndexPage.css";

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
                <pre><code>Linkin Park:        https://open.spotify.com/artist/<b>6XyY86QOPPrYVGvF9ch6wz</b><br />
                Twenty One Pilotes: https://open.spotify.com/artist/<b>3YQKmKGau1PzlVlkL1iodx</b></code></pre>
            </div>
            <input placeholder="Spotify Artist ID" value={artistId} onChange={onChange} onKeyDown={onKeyDown} />
        </div>
    );
}

function AuthForm(props) {
    let resolvePath = useResolvedPath();

    let clientId_htmlId = useId();
    let clientSecret_htmlId = useId();

    let [clientId, setClientId] = useState("");
    let [clientSecret, setClientSecret] = useState("");

    function onClick(event) {
        redirectToSpotifyAuthentication({
            redirectUri: resolvePath("/auth_endpoint"),
            clientId,
            clientSecret,
        });
    }

    return (
        <div className="c-AuthForm">
            <div>
                You need to authorize this application to use Spotify on your behalf.
            </div>
            <div>
                <label for={clientId_htmlId}>Client Id:</label>
                <input id={clientId_htmlId} value={clientId} onChange={event => setClientId(event.target.value)} />

                <label for={clientSecret_htmlId}>Client Secret:</label>
                <input id={clientSecret_htmlId} value={clientSecret} onChange={event => setClientSecret(event.target.value)} />
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
            {getSpotifyToken() ? <RootArtistForm /> : <AuthForm />}
        </div>
    );
}
