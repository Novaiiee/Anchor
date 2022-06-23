import io from "socket.io-client";
import { readable } from "svelte/store";
import variables from "../variables";

export const socket = readable(io(variables.serverUrl));
