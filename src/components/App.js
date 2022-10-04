import React, { useContext, } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import ArtistTree from "./ArtistTree.js";
import ArtistDetails from "./ArtistDetails.js";
import Player from "./Player.js";

import { IndexPage } from "./IndexPage.js";

import { ArtistContext, ArtistProvider } from "../providers/ArtistProvider.js";
import { AuthProvider, AuthEndpoint } from "../providers/AuthProvider.js";

import "./App.css";

function Providers(props) {
    return (
        <AuthProvider>
            <ArtistProvider>
                {props.children}
            </ArtistProvider>
        </AuthProvider>
    );
}

// Route: /discover/:rootArtistId
function DiscoverPage(props) {
    // FIXME: useParams

    let { rootArtist, selectedArtist, selectedTrack } = useContext(ArtistContext);

    return (
        <div className="c-DiscoverPage">
            <ArtistTree artist={rootArtist} />
            <ArtistDetails artist={selectedArtist} />
            <Player track={selectedTrack} />
        </div>
    );
}

function AppRoutes(props) {
    return useRoutes([
        {
            path: "/",
            element: <IndexPage />,
        },
        {
            path: "/auth_endpoint",
            element: <AuthEndpoint />,
        },
        {
            path: "/discover/:rootArtistId",
            element: (
                <Providers>
                    <DiscoverPage />
                </Providers>
            ),
        },
    ]);
}

function App(props) {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </React.StrictMode>
    );
}

export default App;
