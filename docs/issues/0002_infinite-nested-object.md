70f24deba8c25f3dbb107b88ef957d753887781f

It appears as if the `action.payload` object has been corrupted somehow.

### Notes

-   This is what it looks like in the console if I print it out:

    ```none
    [
        {
            "id": "4RddZ3iHvSpGV4dvATac9X",
            "expand": false,
            "name": "Papa Roach",
            "relatedArtistIds": null,
            "4RddZ3iHvSpGV4dvATac9X": {
                "id": "4RddZ3iHvSpGV4dvATac9X",
                "expand": false,
                "name": "Papa Roach",
                "relatedArtistIds": null,
                "4RddZ3iHvSpGV4dvATac9X": {
                    "id": "4RddZ3iHvSpGV4dvATac9X",
                    "expand": false,
                    "name": "Papa Roach",
                    "relatedArtistIds": null,
                    "4RddZ3iHvSpGV4dvATac9X": /* ... */
                }
            }
        }
    ];
    ```

-   I tried converting the object to JSON to be able to put it here but I get this error:

    ```none
    TypeError: Converting circular structure to JSON
    ```

-   The first thing that I notice is, that it can't create display the related artists.
    They appear in the `relatedArtistIds` of the `rootArtist` but they are not saved in `state.artists`.

-   I noticed that the `newArtists` that we compute in `LOAD_ARTISTS_IF_NOT_EXIST` is empty.

### Ideas

-   Look for `{ [id]: "foo" }` in the codebase, that is where things could go wrong.

-   I suspect, that this is a nasty typo.

### Solution

-   It was a typo:

    ```js
    let newArtists = {};
    for (let newArtist of action.payload) {
        newArtist[newArtist.id] = newArtist;
    }
    ```

    should be:

    ```js
    let newArtists = {};
    for (let newArtist of action.payload) {
        newArtists[newArtist.id] = newArtist;
    }
    ```
