import { useContext, useState } from "react";

import "./ArtistTreeComponent.css";
import { ArtistContext } from "./contexts/ArtistContext";

function ArtistTree(props) {
    let [expand, setExpand] = useState(false);

    function onClick(event) {
        setExpand(!expand);
    }

    let { getRelatedArtists } = useContext(ArtistContext);

    let relatedArtists = null;
    if (expand) {
        relatedArtists = getRelatedArtists(props.artist);
    } else {
        relatedArtists = [];
    }

    return (
        <div className="c-ArtistTree">
            <div className="expand" onClick={onClick}>{expand ? "-" : "+"}</div>
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
