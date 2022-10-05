import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import { IndexPage } from "./IndexPage.js";
import { DiscoverPage } from "./DiscoverPage.js";
import { AuthPage } from "./AuthPage.js";

import { ArtistProvider } from "../providers/ArtistProvider.js";
import { AuthProvider } from "../providers/AuthProvider.js";

import "./App.css";

function AppRoutes(props) {
    return useRoutes([
        {
            path: "/",
            element: <IndexPage />,
        },
        {
            path: "/auth_endpoint",
            element: <AuthPage />,
        },
        {
            path: "/discover/:paramRootArtistId",
            element: (
                // FIXME: Is this in the correct order?
                <AuthProvider>
                    <ArtistProvider>
                        <DiscoverPage />
                    </ArtistProvider>
                </AuthProvider>
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
