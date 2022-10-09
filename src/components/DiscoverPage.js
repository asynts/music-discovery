import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ArtistContext } from "../providers/ArtistProvider.js";

import ArtistTree from "./ArtistTree.js";
import ArtistDetails from "./ArtistDetails.js";
import Player from "./Player.js";
import { NorthStar } from "./NorthStar.js";

import "./DiscoverPage.css";

// Route: /discover/:paramRootArtistId
export function DiscoverPage(props) {
    let { rootArtist, setRootArtistAsync, selectedArtist, selectedTrack } = useContext(ArtistContext);

    let { paramRootArtistId } = useParams();

    useEffect(() => {
        setRootArtistAsync(paramRootArtistId);
    }, [paramRootArtistId]);

    return (
        <div className="c-DiscoverPage">
            <NorthStar />
            <div className="artist-tree-container">
                {rootArtist === null ? <>Loading...</> : <ArtistTree artist={rootArtist} />}
            </div>
            <ArtistDetails artist={selectedArtist} />
            <Player track={selectedTrack} />
        </div>
    );
}
