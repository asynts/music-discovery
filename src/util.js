import { useResolvedPath } from "react-router-dom";
import { fromByteArray as byteArrayToBase64 } from "base64-js";

export function ASSERT_NOT_REACHED() {
    throw new Error("ASSERT_NOT_REACHED");
}

export function useRedirectUri() {
    let redirectUri = new URL(window.location.href);
    redirectUri.search = "";
    redirectUri.pathname = useResolvedPath("/auth_endpoint").pathname;

    return redirectUri;
}

export function stringToBase64(string) {
    let byteArray = new TextEncoder().encode(string);
    return byteArrayToBase64(byteArray);
}
