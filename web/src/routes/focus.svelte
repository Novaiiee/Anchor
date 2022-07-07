<script context="module" lang="ts">
	import { userStore } from "$lib/stores/userStore";
	import type { Load } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { Jumper } from "svelte-loading-spinners";
	import { fade } from "svelte/transition";
	import Clock from "../lib/components/focus/Clock.svelte";
	import { focusSession,loadingSession } from "../lib/stores/focusStore";
	import { socket } from "../lib/stores/socketStore";

	export const load: Load = async ({ session }) => {
		if (session.user) {
			userStore.set(session.user);
			return {
				props: { user: session.user }
			};
		}

		return {
			redirect: "/",
			status: 302
		};
	};
</script>

<script lang="ts">
	import CreateSession from "../lib/components/focus/CreateSession.svelte";
	import { convertMsToTime } from "../lib/helpers/time";

	export let user: User;

	$: initButtonText = $focusSession.hasTimerStarted ? "Stop" : "Start";
	$: pauseButtonText = $focusSession.isPaused ? "Un Pause" : "Pause";

	$: pauseButtonStyles = $focusSession.isPaused ? "bg-red-500" : "bg-blue-700";
	$: initButtonStyles = $focusSession.hasTimerStarted ? "bg-red-500" : "bg-blue-700";

	const setFocusData = (cb: (s: Session) => void = (s: Session) => {}) => {
		return (_session: Session) => {
			cb(_session);
			if (!_session.hasTimerStarted) return;

			$focusSession = { ..._session };
		};
	};

	onMount(() => {
		$socket.on("connect", () => {
			console.log("Connected to Socket");
			
			$socket.emit("join-room", user.id);
			$socket.on(
				"join-room",
				setFocusData(() => {
					$loadingSession = false;

					$socket.on("on-timer", setFocusData());
					$socket.on("pause-timer", () => ($focusSession.isPaused = true));
					$socket.on("unpause-timer", () => ($focusSession.isPaused = false));

					$socket.on(
						"stop-timer",
						focusSession.reset(() => {
							console.log("Resetted the Timer");
						})
					);
				})
			);
		});
	});

	const startTimer = (e?: CustomEvent<CreateSessionValues>) => {
		return () => {
			if (e) {
				$socket.emit("start-timer", {
					...e.detail,
					userId: user.id
				});
			}
		};
	};

	const stopTimer = () => $socket.emit("stop-timer", user.id);
	const pauseTimer = () => $socket.emit("pause-timer", user.id);
	const unPauseTimer = () => $socket.emit("unpause-timer", user.id);
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<main class="flex h-full w-screen flex-col items-center justify-center space-y-4">
	{#if $loadingSession}
		<div
			transition:fade={{ duration: 500 }}
			class="flex flex-col items-center justify-center space-y-10"
		>
			<Jumper size={100} color="#004ED8" />
			<h1 class="text-4xl font-semibold">Loading your Session...</h1>
		</div>
	{/if}
	{#if !$focusSession.hasTimerStarted && !$loadingSession}
		<div transition:fade={{ delay: 600 }} class="space-y-8">
			<h1 class="text-4xl font-semibold">Start a Pomodoro Session</h1>
			<CreateSession
				on:timerStartRequest={(e) => focusSession.changeStartState(startTimer(e), stopTimer)}
			/>
		</div>
	{:else if $focusSession.hasTimerStarted && !$loadingSession}
		<div
			transition:fade={{ delay: 800 }}
			class="flex flex-col items-center justify-center space-y-10"
		>
			<div>
				{#if $focusSession.isOnBreak}
					<p class="pb-10 text-center text-4xl font-semibold">Break Time!</p>
				{/if}
				<p class="text-xl text-gray-600">
					Cycle <span class="font-semibold">{$focusSession.currentCycle} </span> of
					<span class="font-semibold"> {$focusSession.cycles}</span>
					| Cycles are {convertMsToTime($focusSession.cycleDuration)}
				</p>
			</div>
			<Clock />
			<div class="flex items-center space-x-1">
				<button
					on:click={() => focusSession.changeStartState(startTimer(), stopTimer)}
					class="rounded-md border-1 {initButtonStyles} py-2 px-8 font-medium text-white outline-none"
					>{initButtonText}</button
				>
				<button
					disabled={!$focusSession.hasTimerStarted}
					on:click={() => focusSession.changePauseState(pauseTimer, unPauseTimer)}
					class="rounded-md border-1 {pauseButtonStyles} py-2 px-8 font-medium text-white outline-none"
					>{pauseButtonText}</button
				>
			</div>
		</div>
	{/if}
</main>
