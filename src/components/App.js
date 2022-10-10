import React, { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import { IndexPage } from "./IndexPage.js";
import { DiscoverPage } from "./DiscoverPage.js";
import { AuthPage } from "./AuthPage.js";

import { ArtistProvider } from "../providers/ArtistProvider.js";
import { AuthProvider } from "../providers/AuthProvider.js";

import "./App.css";

function HideRouteFromSearchEngines(props) {
    // Add '<meta name="robots" content="noindex" />' into '<head>' when mounted.
    // Remove element when unmounted.
    useEffect(() => {
        let metaElement = document.createElement("meta");
        metaElement.setAttribute("name", "robots");
        metaElement.setAttribute("content", "noindex");

        document.head.appendChild(metaElement);
        return () => document.head.removeChild(metaElement);
    }, []);

    return null;
}

function AppRoutes(props) {
    return useRoutes([
        {
            path: "/",
            element: <IndexPage />,
        },
        {
            path: "/auth_endpoint",
            element: (
                <>
                    <HideRouteFromSearchEngines />
                    <AuthPage />
                </>
            ),
        },
        {
            path: "/discover/:paramRootArtistId",
            element: (
                <>
                    <HideRouteFromSearchEngines />
                    <AuthProvider>
                        <ArtistProvider>
                            <DiscoverPage />
                        </ArtistProvider>
                    </AuthProvider>
                </>
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
