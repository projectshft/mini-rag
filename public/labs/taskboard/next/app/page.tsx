// The board's page. With no "use client" at the top, this is a server
// component: it runs on the Next.js server, never in the browser, and it may
// be an async function that awaits data before any HTML is sent.
//
// Its job: load the board from the API on the server, then hand it to the
// client part of the board in components/Board.tsx.
//
// The API's address comes from process.env.TASKBOARD_API_URL, falling back to
// "http://localhost:4000/api". The server needs the full address, because
// there's no page around it to be relative to.

// Render this page fresh on every request, never once at build time.
export const dynamic = "force-dynamic";

export default async function Page() {
  return <p>The board isn&apos;t written yet.</p>;
}
