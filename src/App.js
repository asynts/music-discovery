import ArtistTree, { Artist } from "./ArtistTreeComponent.js";

function App() {
    let bob = new Artist("Bob", []);
    let charlie = new Artist("Charlie", [])
    let david = new Artist("David", [charlie]);
    let alice = new Artist("Alice", [bob, david])

    return (
        <ArtistTree artist={alice} />
    );
}

export default App;
