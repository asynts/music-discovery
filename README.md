-   This is a similar site, but I think it works differently:

    https://www.gnoosic.com/

-   Future features:

    -   Select root artist by name (search.)

    -   Add button to mark song as favorite.

-   Unfortunately, the user has to provide the `clientId` and `clientSecret`.
    Note, that the secret is stored in local storage and never send to my server.

    This is necessary, because the application is running in your browser and therefore a "public client". \
    In other words, I can't give you my `clientSecret` because then it's not secret anymore.

    However, Spotify does not provide refresh tokens when the "implicit flow" is used and all other authentication
    methods require the `clientSecret`. \
    This means I can choose between doing OAuth once every hour, or I must require you to provide your own `clientSecret`. \
    I choose the latter.

    You can obtain the `clientId` and `clientSecret` from here:

    https://developer.spotify.com/dashboard/

    The `redirectUri` needs to be set to `<servername>/auth_endpoint`.
