import { useResolvedPath } from "react-router-dom";

export function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

export function useRedirectUri() {
    let redirectUri = new URL(window.location.href);
    redirectUri.search = "";
    redirectUri.pathname = useResolvedPath("/auth_endpoint").pathname;

    return redirectUri;
}
