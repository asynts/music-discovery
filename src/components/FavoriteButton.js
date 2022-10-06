import { useContext, useId } from "react";

import { ArtistContext } from "../providers/ArtistProvider.js";

import "./FavoriteButton.css";

export function FavoriteButton(props) {
    let id = useId();

    let { toggleTrackIsFavoriteAsync } = useContext(ArtistContext);

    function onChange(event) {
        toggleTrackIsFavoriteAsync(props.track);
    }

    // FIXME: useEffect lazy load isFavorite.

    let isDisabled = props.track === null || props.track.isFavorite === null;

    return (
        <div className="c-FavoriteButton">
            <div className={isDisabled ? "disabled" : ""}>
                (
                <label htmlFor={id}>Favorite</label>
                <input id={id} type="checkbox" checked={isDisabled ? false : props.track.isFavorite} disabled={isDisabled} onChange={onChange} />
                )
            </div>
        </div>
    );
}
