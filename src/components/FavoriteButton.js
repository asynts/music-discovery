import { useContext, useEffect } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./FavoriteButton.css";

export function FavoriteButton(props) {
    let { toggleTrackIsFavoriteAsync, fetchTrackIsFavoriteAsync } = useContext(ArtistContext);

    function onClick(event) {
        toggleTrackIsFavoriteAsync(props.track);
    }

    useEffect(() => {
        if (props.track !== null) {
            fetchTrackIsFavoriteAsync(props.track);
        }
    });

    let isDisabled = props.track === null || props.track.isFavorite === null;

    let bookmarkElement = null;
    if (isDisabled) {
        bookmarkElement = <div className="material-icons disabled" onClick={onClick}>bookmark_border</div>;
    } else {
        bookmarkElement = <div className="material-icons" onClick={onClick}>{props.track.isFavorite ? "bookmark" : "bookmark_border"}</div>;
    }

    return (
        <div className="c-FavoriteButton">
            <div className={isDisabled ? "disabled" : ""}>
                {bookmarkElement}
            </div>
        </div>
    );
}
