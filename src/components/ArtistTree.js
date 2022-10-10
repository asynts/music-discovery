import { useContext, useEffect } from "react";

import "./ArtistTree.css";

import { ArtistContext } from "../providers/ArtistProvider.js";

function ArtistTree(props) {
    let {
        fetchArtistRelatedArtists,
        setArtistExpand,

        setSelectedArtist,
        selectedArtist,

        getRelatedArtists,
    } = useContext(ArtistContext);

    useEffect(() => {
        if (props.artist.expand) {
            fetchArtistRelatedArtists(props.artist);
        }
    }, [props.artist, fetchArtistRelatedArtists]);

    function onClick(event) {
        setSelectedArtist(props.artist);
    }

    let relatedArtists = null;
    if (props.artist.expand) {
        relatedArtists = getRelatedArtists(props.artist);
    } else {
        relatedArtists = [];
    }

    let name_className = "name";

    if (selectedArtist !== null && selectedArtist.id === props.artist.id) {
        name_className += " selected";
    }

    if (props.artist.viewed) {
        name_className += " viewed";
    }

    return (
        <div className="c-ArtistTree">
            <div className="expand" onClick={() => setArtistExpand(props.artist, !props.artist.expand)}>{props.artist.expand ? "-" : "+"}</div>
            <div className={name_className}>
                <div>
                    <span onClick={onClick}>{props.artist.name}</span>
                </div>
            </div>
            <div className="children">
                {relatedArtists.map(relatedArtist =>
                    <div className="child" key={relatedArtist.id}>
                        <div className="arrow-container">
                            <div className="arrow">
                                <div className="material-icons">subdirectory_arrow_right</div>
                            </div>
                        </div>
                        <ArtistTree artist={relatedArtist} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArtistTree;
