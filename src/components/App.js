import React, { useContext } from "react";

import ArtistTree from "./ArtistTree.js";

import { ArtistContext, ArtistProvider } from "../contexts/ArtistContext.js";

function Example(props) {
    let { rootArtist } = useContext(ArtistContext);

    return (
        <ArtistTree artist={rootArtist} />
    );
}

function App(props) {
    return (
        <React.StrictMode>
            <ArtistProvider>
                <Example />
            </ArtistProvider>
        </React.StrictMode>
    );
}

export default App;
