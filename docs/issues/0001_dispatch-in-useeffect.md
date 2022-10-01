a35e1d876e54baeabf03da05c5cae76a78e0d676

Somehow, if I use `dispatch` in `useEffect`, it sometimes runs twice.

### Notes

-   One cause of this seems to be `React.StrictMode` which always runs the logic multiple times.

-   It seems that React sometimes just runs the functions multiple times.

-   I was able to reproduce the issue with the following code:

    ```jsx
    function reducer(state, action) {
        console.log("newReducer");
        return {
            state: action.payload,
            counter: state.counter + 1,
        };
    }

    function MinimumExample(props) {
        let [state, dispatch ] = useReducer(reducer, "initial");

        useEffect(() => {
            console.log(`useEffect state=${state}`)

            if (state === "initial") {
                dispatch({
                    type: "set",
                    payload: "loading",
                });

                setTimeout(() => {
                    dispatch({
                        type: "set",
                        payload: "loaded",
                    });
                }, 1000);
            }
        });
    }
    ```

-   This answer suggested making multiple calls to `useEffect`:

    https://stackoverflow.com/a/68488198/8746648

    I don't understand the reasoning though.

### Ideas

-   Is `useEffect` allowed to have side effects.

### Theories

-   I suspect, that `useEffect` runs every time something changes.
    There is likely something that causes a change before the dispatch and thus we re-render before the dispatch?
