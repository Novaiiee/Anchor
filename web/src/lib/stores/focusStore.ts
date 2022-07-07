import { writable } from "svelte/store";

export const loadingSession = writable(true);

const defaultValues = {
	cycleDuration: 20,
	cycles: 4,
	breakDuration: 5
};

const { set, subscribe, update } = writable<Session>({
	hasTimerStarted: false,
	cycleDuration: defaultValues.cycleDuration,
	currentCycle: 1,
	currentTime: 0,
	cycles: defaultValues.cycles,
	breakDuration: defaultValues.breakDuration,
	isPaused: false,
	isOnBreak: false
});

export const focusSession = {
	set,
	subscribe,
	update,
	changePauseState: (pauseCb: () => any, unPauseCb: () => any) => {
		update((s) => {
			if (s.hasTimerStarted && s.isPaused) unPauseCb();
			else if (s.hasTimerStarted && !s.isPaused) pauseCb();

			return s;
		});
	},
	changeStartState: (startCb: () => any, stopCb: () => any) => {
		update((s) => {
			if (s.hasTimerStarted) stopCb();
			else startCb();

			return s;
		});
	},
	reset: (cb: () => void = () => {}) => {
		return () => {
			cb();
			update((s) => ({
				hasTimerStarted: false,
				cycleDuration: s.cycleDuration,
				currentCycle: 1,
				currentTime: 0,
				cycles: s.cycles,
				breakDuration: s.breakDuration,
				isPaused: false,
				isOnBreak: false
			}));
		};
	}
};
