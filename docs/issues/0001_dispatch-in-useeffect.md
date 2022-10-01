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

-   I reduced the code for the example:

    ```jsx
    function newReducer(state, action) {
        console.log(action);

        console.log(`newReducer state=${state.status}`);
        return {
            status: action.payload,
            counter: state.counter + 1,
        };
    }

    function MinimumExample(props) {
        let [state, dispatch ] = useReducer(newReducer, { status: "unknown", counter: 0 });

        useEffect(() => {
            console.log(`useEffect state=${state.status}`)

            if (state.status === "unknown") {
                dispatch({
                    type: "set_status",
                    payload: "loading",
                });
            }
        });

        return (
            <p>{state.counter}</p>
        );
    }
    ```

-   I was able to reduce it even more:

    ```jsx
    function App(props) {
        useEffect(() => {
            console.trace("FOO");
            console.trace("EFFECT!");
        }, []);

        return (
            <></>
        );
    }
    ```

-   This appears to be related to the dev tools?

    ```none
    App.js:17 EFFECT!
    (anonymous) @ App.js:17
    commitHookEffectListMount @ react-dom.development.js:23150
    commitPassiveMountOnFiber @ react-dom.development.js:24926
    commitPassiveMountEffects_complete @ react-dom.development.js:24891
    commitPassiveMountEffects_begin @ react-dom.development.js:24878
    commitPassiveMountEffects @ react-dom.development.js:24866
    flushPassiveEffectsImpl @ react-dom.development.js:27039
    flushPassiveEffects @ react-dom.development.js:26984
    (anonymous) @ react-dom.development.js:26769
    workLoop @ scheduler.development.js:266
    flushWork @ scheduler.development.js:239
    performWorkUntilDeadline @ scheduler.development.js:533
    App.js:17 EFFECT!
    (anonymous) @ App.js:17
    commitHookEffectListMount @ react-dom.development.js:23150
    invokePassiveEffectMountInDEV @ react-dom.development.js:25154
    invokeEffectsInDev @ react-dom.development.js:27351
    commitDoubleInvokeEffectsInDEV @ react-dom.development.js:27330
    flushPassiveEffectsImpl @ react-dom.development.js:27056
    flushPassiveEffects @ react-dom.development.js:26984
    (anonymous) @ react-dom.development.js:26769
    workLoop @ scheduler.development.js:266
    flushWork @ scheduler.development.js:239
    performWorkUntilDeadline @ scheduler.development.js:533
    ```

    Notice that the stack traces are different and that there is a special `invokeEffectsInDev` call in the second trace.

-   This function is called here:

    ```js
    function legacyCommitDoubleInvokeEffectsInDEV(
        fiber: Fiber,
        hasPassiveEffects: boolean,
    ) {
        // TODO (StrictEffects) Should we set a marker on the root if it contains strict effects
        // so we don't traverse unnecessarily? similar to subtreeFlags but just at the root level.
        // Maybe not a big deal since this is DEV only behavior.

        setCurrentDebugFiberInDEV(fiber);
        invokeEffectsInDev(fiber, MountLayoutDev, invokeLayoutEffectUnmountInDEV);
        if (hasPassiveEffects) {
            invokeEffectsInDev(fiber, MountPassiveDev, invokePassiveEffectUnmountInDEV);
        }

        invokeEffectsInDev(fiber, MountLayoutDev, invokeLayoutEffectMountInDEV);
        if (hasPassiveEffects) {
            invokeEffectsInDev(fiber, MountPassiveDev, invokePassiveEffectMountInDEV);
        }
        resetCurrentDebugFiberInDEV();
    }
    ```

-   There was another `<React.StrictMode>` in `index.js` that explains everything.
    However, I still don't know how to do this correctly in strict mode.

-   This is intentional:

    >   [...] Functions passed to useState, useMemo, or useReducer
    >
    >   Source: ["Detecting unexpected side effects"](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)

    Actually, I think this is about unmounting and remounting which is discussed later:

    >   Unmounting and remounting includes:

        -   `componentDidMount`

        -   `componentWillUnmount`

        -   `useEffect`

        [...]

-   This seems to be about this exact problem:

    https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development

### Ideas

-   Is `useEffect` allowed to have side effects.

### Theories

-   I suspect, that `useEffect` runs every time something changes.
    There is likely something that causes a change before the dispatch and thus we re-render before the dispatch?

-   My mental model is that all the `useEffect` calls happen and then, if something changed we re-render again.
    Maybe we re-run everytime `useEffect` makes a change?
