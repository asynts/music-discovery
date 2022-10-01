import { useState } from "react";

import "./ArtistTreeComponent.css";

export class Artist {
    constructor(name, children) {
        this.name = name;
        this.children = children;
    }
}

function ArtistTree(props) {
    let [expanded, setExpanded] = useState(false);

    function onClick(event) {
        setExpanded(!expanded);
    }

    return (
        <div className="c-ArtistTree">
            <div className="expand" onClick={onClick}>{expanded ? "-" : "+"}</div>
            <div className="name">{props.artist.name}</div>
            {expanded &&
                <div className="children">
                    {props.artist.children.map((childArtist, index) =>
                        <div className="child" key={index}>
                            <div className="arrow-container">
                                <div className="arrow">&gt;</div>
                            </div>
                            <ArtistTree artist={childArtist} />
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

export default ArtistTree;
