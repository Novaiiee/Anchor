<script context="module" lang="ts">
	import { userStore } from "$lib/stores/userStore";
	import type { Load } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import Clock from "../lib/components/focus/Clock.svelte";
	import { socket } from "../lib/stores/socketStore";

	export const load: Load = async ({ session }) => {
		if (session.user) {
			userStore.set(session.user);
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
		$socket.on("connect", () => {
			$socket.emit("join-room", session.id);

			$socket.on("join-room", ({ room, socketId }) => {
				$socket.on("on-timer", ({ time, hasStartedTimer }) => {
					console.log(time);

					timerStarted = hasStartedTimer;
					currentTime = time;
				});
			});
		});
	});

	const startTimer = () => {
		if (!timerStarted) {
			$socket.emit("start-timer", { userId: session.id, startTime });
		}
	};

	const stopTimer = () => {
		if (timerStarted) {
			$socket.emit("stop-timer", session.id);
		}
	};

	const pauseTimer = () => {
		if (timerStarted) {
			$socket.emit("pause-timer", session.id);
		}
	};

	const unPauseTimer = () => {
		if (timerStarted) {
			$socket.emit("unpause-timer", session.id);
		}
	};
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<main class="flex h-full w-full flex-col items-center justify-center">
	<h1>{session.username}</h1>
	<p>{currentTime}</p>
	<button on:click={startTimer}>Start Timer</button>
	<button on:click={stopTimer}>Stop Timer</button>
	<button on:click={pauseTimer}>Pause Timer</button>
	<button on:click={unPauseTimer}>Un-Pause Timer</button>
	<input min={1} max={86400} bind:value={startTime} type="number" />
	<Clock {startTime} {currentTime} />
</main>
