<script context="module" lang="ts">
	import { userStore } from "$lib/stores/userStore";
	import type { Load } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { socket } from "../lib/stores/socketStore";

	export const load: Load = async ({ session }) => {
		if (session.user) {
			return {
				props: { session: session.user }
			};
		}

		return {
			redirect: "/",
			status: 302
		};
	};
</script>

<script lang="ts">
	export let session: User;

	let currentTime = 0;
	let timerStarted = false;
	let startTime = 60;

	onMount(() => {
		userStore.set(session);
		$socket.on("connect", () => {
			$socket.emit("on-join", session.id);

			$socket.on("on-join-success", ({ room, socketId }) => {

				$socket.on("on-timer", ({ time, userId, hasStartedTimer }) => {
					timerStarted = hasStartedTimer;
					currentTime = time;
				});
			});
		});
	});

	const startTimer = () => {
		if (!timerStarted) $socket.emit("start-timer", { userId: session.id, startTime });
	};
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<h1>{session.username}</h1>
<p>{currentTime}</p>
<button on:click={startTimer}>Start Timer</button>
<input bind:value={startTime} type="number" />
