import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import { IndexPage } from "./IndexPage.js";
import { DiscoverPage } from "./DiscoverPage.js";

import { ArtistProvider } from "../providers/ArtistProvider.js";
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
            path: "/discover/:paramRootArtistId",
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
