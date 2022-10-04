import { useNavigate } from "react-router-dom";

import "./NorthStar.css";

export function NorthStar(props) {
    let navigate = useNavigate();

    function onClick(event) {
        navigate("/");
    }

    return (
        <div className="c-NorthStar" onClick={onClick}>
            Discover Music!
        </div>
    );
}
