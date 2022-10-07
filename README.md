-   This is a similar site, but I think it works differently:

    https://www.gnoosic.com/

-   Unfortunately, the user has to provide the `clientId` and `clientSecret` for OAuth. \
    Note, that the secret is stored in local storage and never send to the server.

    This is necessary, because the application is running in your browser and therefore a "public client". \
    In other words, I can't give you my `clientSecret` because then it's not secret anymore.

    However, Spotify does not provide refresh tokens when the "implicit flow" is used and all other authentication \
    methods require the `clientSecret`.

    You can obtain the `clientId` and `clientSecret` from here:

    https://developer.spotify.com/dashboard/

    The `redirectUri` needs to be set to `<servername>/auth_endpoint`.
