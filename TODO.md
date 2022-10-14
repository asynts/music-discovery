### Features

-   Group similar requests, in particular loading bookmarked tracks.
    The Spotify API allows checking multiple tracks at the same time.

    I get a `429 Too Many Requests` currently.

-   Create a proper design that looks good.

-   There are several race conditions in the application, resolve that.

-   Search for the root artist.

-   Sometimes, Spotify returns `503 Service Unavailable`, deal with that.

-   Play whole songs.

    Currently, we can only play 30 second snippets because otherwise I need to integrate
    the Spotify SDK to use their DRM thing.

-   Error handling

    -   Systematically enumerate possible failure cases.

    -   Handle authentication errors.

### Tweaks

-   "Fork me on GitHub" button.

-   Allow playing song again by clicking on them.

-   Create a screenshot that can be shown without being scaled down.

### Bugs
