import io from "socket.io-client";
import { writable } from "svelte/store";
import variables from "../variables";

export const socketStore = writable(io(variables.serverUrl));
