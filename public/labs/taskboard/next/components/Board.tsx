"use client";
// The part of the board that runs in the browser: the buttons, the forms and
// the state that changes when you click. "use client" on the first line is what
// makes it a client component.
//
// It gets the board the server already loaded as `initialBoard`, so it must not
// load it again when it first appears. `api` is for changes. The page doesn't
// pass one, so it falls back to talking to /api through this Next.js server.
// The tests pass in a pretend one.
import type { Board as BoardData } from "@/lib/board";
import { createApi, type Api } from "@/lib/api";

const browserApi = createApi("/api");

type Props = {
  initialBoard: BoardData;
  api?: Api;
};

export default function Board({ initialBoard, api = browserApi }: Props) {
  return <p>The board isn&apos;t written yet.</p>;
}
