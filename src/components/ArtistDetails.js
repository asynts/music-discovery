import "./ArtistDetails.css";

function ArtistDetails(props) {
    return (
        <div className="c-ArtistDetails">
            {props.artist === null ? "No artist selected." : props.artist.name}
        </div>
    );
}

export default ArtistDetails;
