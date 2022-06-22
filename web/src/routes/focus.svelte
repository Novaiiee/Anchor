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
	let hasTimerStarted = false;
	let startTime = 60;
	let isPaused = false;

	$: initButtonText = hasTimerStarted ? "Stop" : "Start";
	$: pauseButtonText = isPaused ? "Un Pause" : "Pause";

	$: pauseButtonStyles = isPaused ? "bg-red-500" : "bg-blue-700";
	$: initButtonStyles = hasTimerStarted ? "bg-red-500" : "bg-blue-700";

	onMount(() => {
		$socket.on("connect", () => {
			$socket.emit("join-room", session.id);

			$socket.on("join-room", ({ isPaused: paused, time, hasTimerStarted: started }) => {
				hasTimerStarted = started;
				isPaused = paused;
				currentTime = time;

				$socket.on("on-timer", ({ time, hasTimerStarted: started, isPaused: paused }) => {
					hasTimerStarted = started;
					isPaused = paused;
					currentTime = time;
				});

				$socket.on("pause-timer", () => {
					isPaused = true;
				});

				$socket.on("unpause-timer", () => {
					isPaused = false;
				});

				$socket.on("stop-timer", () => {
					isPaused = false;
					hasTimerStarted = false;
					currentTime = 0;
				});
			});
		});
	});

	const startTimer = () => $socket.emit("start-timer", { userId: session.id, startTime });
	const stopTimer = () => $socket.emit("stop-timer", session.id);
	const pauseTimer = () => $socket.emit("pause-timer", session.id);
	const unPauseTimer = () => $socket.emit("unpause-timer", session.id);

	const changeStartState = () => {
		if (hasTimerStarted) stopTimer();
		else startTimer();
	};

	const changePauseState = () => {
		if (hasTimerStarted && isPaused) unPauseTimer();
		else if (hasTimerStarted && !isPaused) pauseTimer();
	};
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<main class="flex h-full w-screen flex-col items-center justify-center space-y-4">
	<Clock {currentTime} />
	<div class="flex items-center space-x-1">
		<button
			on:click={changeStartState}
			class="rounded-md border-1 {initButtonStyles} py-2 px-8 font-medium text-white outline-none"
			>{initButtonText}</button
		>
		<button
			disabled={!hasTimerStarted}
			on:click={changePauseState}
			class="rounded-md border-1 {pauseButtonStyles} py-2 px-8 font-medium text-white outline-none"
			>{pauseButtonText}</button
		>
	</div>
</main>
