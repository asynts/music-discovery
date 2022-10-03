import { useContext, useEffect } from "react";

import "./ArtistTree.css";

import { ArtistContext } from "../providers/ArtistProvider.js";

function ArtistTree(props) {
    let {
        toggleExpand,
        getRelatedArtists,
        fetchRelatedArtistsAsync,
        setSelectedArtist,
        selectedArtist,
    } = useContext(ArtistContext);

    useEffect(() => {
        if (props.artist.expand) {
            fetchRelatedArtistsAsync(props.artist);
        }
    });

    function onClick(event) {
        setSelectedArtist(props.artist);
    }

    let relatedArtists = null;
    if (props.artist.expand) {
        relatedArtists = getRelatedArtists(props.artist);
    } else {
        relatedArtists = [];
    }

    let isSelectedArtist = false;
    if (selectedArtist !== null && selectedArtist.id === props.artist.id) {
        isSelectedArtist = true;
    }

    return (
        <div className="c-ArtistTree">
            <div className="expand" onClick={() => toggleExpand(props.artist)}>{props.artist.expand ? "-" : "+"}</div>
            <div onClick={onClick} className={isSelectedArtist ? "name selected" : "name"}>{props.artist.name}</div>
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
