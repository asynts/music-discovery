import React, { useContext, } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import ArtistTree from "./ArtistTree.js";

import { ArtistContext, ArtistProvider } from "../providers/ArtistProvider.js";
import { AuthProvider, AuthEndpoint } from "../providers/AuthProvider.js";

function Index(props) {
    let { rootArtist } = useContext(ArtistContext);

    return (
        <ArtistTree artist={rootArtist} />
    );
}

function Providers(props) {
    return (
        <AuthProvider>
            <ArtistProvider>
                {props.children}
            </ArtistProvider>
        </AuthProvider>
    );
}

function AppRoutes(props) {
    return useRoutes([
        {
            path: "/auth_endpoint",
            element: <AuthEndpoint />,
        },
        {
            path: "/",
            element: (
                <Providers>
                    <Index />
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
