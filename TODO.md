### Features

I have a feature stop for now!

-   There are several race conditions in the application, resolve that.

-   Create a proper design and put some effort in.

-   Search for the root artist.

-   Group API calls together (e.g. fetch favorite.)

    I get a `429 Too Many Requests` currently.

-   Allow playing song again by clicking on them.

-   Sometimes, Spotify returns `503 Service Unavailable`, deal with that.

-   Play whole songs.

-   Handle authentication errors.

-   Systematically enumerate possible failure cases.

### Tweaks

-   Write README.md.

-   In `<AuthForm />`, provide some explanation.
    The application should be self-explanatory.

-   Use icon for arrow.

### Code Smells

-   Are `<ArtistProvider />` and `<AuthProvider />` in the correct order?

-   `<FavoriteButton />` should be `<Bookmark />`.
    Related functions should be renamed as well.

-   Cleanup `<ArtistProvider />`.
    Look for examples online.

    I am concerned about `useEffect` feedback loops.

    I guess I need to use `useCallback` or `useEvent` here.

-   Verify `useEffect` dependencies.
