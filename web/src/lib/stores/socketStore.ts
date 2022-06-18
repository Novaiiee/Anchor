import io from "socket.io-client";
import { writable } from "svelte/store";
import variables from "../variables";

export const socket = writable(io(variables.serverUrl));
