import { useContext, useEffect } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./Bookmark.css";

export function Bookmark(props) {
    let { toggleBookmarkAsync, fetchTrackBookmarkAsync } = useContext(ArtistContext);

    function onClick(event) {
        toggleBookmarkAsync(props.track);
    }

    useEffect(() => {
        if (props.track !== null) {
            fetchTrackBookmarkAsync(props.track);
        }
    });

    let isDisabled = props.track === null || props.track.bookmarked === null;

    let bookmarkElement = null;
    if (isDisabled) {
        bookmarkElement = <div className="material-icons disabled" onClick={onClick}>bookmark_border</div>;
    } else {
        bookmarkElement = <div className="material-icons" onClick={onClick}>{props.track.bookmarked ? "bookmark" : "bookmark_border"}</div>;
    }

    return (
        <div className="c-Bookmark">
            <div className={isDisabled ? "disabled" : ""}>
                {bookmarkElement}
            </div>
        </div>
    );
}
