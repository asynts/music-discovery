import { useContext, useEffect } from "react";

import "./ArtistTree.css";

import { ArtistContext } from "../contexts/ArtistContext";

function ArtistTree(props) {
    let { toggleExpand, getRelatedArtists, fetchRelatedArtistsAsync } = useContext(ArtistContext);

    useEffect(() => {
        if (props.artist.expand) {
            fetchRelatedArtistsAsync(props.artist);
        }
    });

    let relatedArtists = null;
    if (props.artist.expand) {
        relatedArtists = getRelatedArtists(props.artist);
    } else {
        relatedArtists = [];
    }

    return (
        <div className="c-ArtistTree">
            <div className="expand" onClick={() => toggleExpand(props.artist)}>{props.artist.expand ? "-" : "+"}</div>
            <div className="name">{props.artist.name}</div>
            <div className="children">
                {relatedArtists.map((relatedArtist, index) =>
                    <div className="child" key={index}>
                        <div className="arrow-container">
                            <div className="arrow">&gt;</div>
                        </div>
                        <ArtistTree artist={relatedArtist} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArtistTree;
