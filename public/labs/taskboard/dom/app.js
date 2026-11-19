// The board itself.
//
// mountBoard builds the whole board inside `root` and keeps it up to date.
// `api` is the object createApi gives back. In the tests it's a pretend one,
// so only ever talk to the server through `api`, never with fetch directly.
//
// Read "The page contract" in ../README.md before you change this file.
// The tests find everything on the page by the data- attributes listed there.

export async function mountBoard(root, api) {
  root.textContent = "The board isn't written yet.";
}
