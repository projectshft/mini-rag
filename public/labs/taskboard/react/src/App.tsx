// The whole board. `api` is what createApi gives back. In the tests it's a
// pretend one, so only ever talk to the server through `api`.
// Read "The page contract" in taskboard/README.md: the tests find everything on the
// page by the data- attributes listed there.
import type { Api } from "./api";

export default function App({ api }: { api: Api }) {
  return <p>The board isn't written yet.</p>;
}
