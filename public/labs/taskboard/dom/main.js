// Starts the board in the browser. You don't need to change this file.
// The tests don't load it: they call mountBoard themselves, with a pretend API.
import { createApi } from "./api.js";
import { mountBoard } from "./app.js";

mountBoard(document.getElementById("board"), createApi("/api"));
