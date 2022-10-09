# Discover Music!

This is an application that helps you discover artists on Spotify:

-   You can navigate a tree structure of related artists.

-   You can view and play the top tracks of any of the artists.

-   You can bookmark tracks which saves them to your library.

This is strongly inspired from [Music Roamer][1] which works almost identically.
However, I put a stronger focus on functionality:

-   It provides better overview, making it easier to navigate larger trees.

-   It is more efficent, making it possible to view larger trees without lag.

[Gnoostic][2] is another similar site which is less interactive.

### Usage

You can run the application locally with `npm start` or serve the output of `npm build` with a web server.
Alternatively, you can visit [my instance][3].

In order to use the application you need to authenticate at Spotify.
This will provide the application with an access token which is used to interact with Spotify on your behalf.
The token is stored in your browser and is never send to any server other than Spotify.

### Screenshots

![Looking at artists similar to "Twenty One Pilots" and currently playing the track "Sweet Disaster" made by the "DREAMERS".][4]

### Notes

This is in an early state of development:

-   The design is not final.
    Not sure if this can be called a "design" at the moment.

-   I got some quality of life improvements planned, for example, allowing the user to search for the artist they start with.

-   Currently, I only provide 30 second snippets of the tracks.
    This is because they can be accessed more easily, otherwise, I would have to use the Spotify SDK.
    I intend to change this at some point in the future.

  [1]: https://musicroamer.com/
  [2]: https://www.gnoosic.com/
  [3]: https://md.asynts.com/
  [4]: docs/media/0001_screenshot.png
