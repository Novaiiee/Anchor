<script lang="ts">
	import { validator } from "@felte/validator-yup";
	import { createForm } from "felte";
	import { createEventDispatcher } from "svelte";
	import * as yup from "yup";
	import { focusSession } from "../../stores/focusStore";

	const dispatchSubmit = createEventDispatcher<{ timerStartRequest: CreateSessionValues }>();

	const [breakHours, breakMinutes] = new Date($focusSession.breakDuration)
		.toISOString()
		.slice(11, 16)
		.split(":")
		.map((x) => parseInt(x));

	const [cycleHours, cycleMinutes] = new Date($focusSession.cycleDuration)
		.toISOString()
		.slice(11, 16)
		.split(":")
		.map((x) => parseInt(x));

	const schema: yup.SchemaOf<CreateSessionValues> = yup.object({
		breakMinutes: yup
			.number()
			.default(breakMinutes)
			.min(1, "Minimum 1 Minute")
			.max(59, "Maximum 59 Minutes")
			.required("*Required"),
		breakHours: yup
			.number()
			.default(breakHours)
			.min(0, "Minimum 0 Hours")
			.max(23, "Maximum 23 Hours")
			.required("*Required"),
		cycleMinutes: yup
			.number()
			.default(cycleMinutes)
			.min(1, "Minimum 1 Minute")
			.max(59, "Maximum 59 Minutes")
			.required("*Required"),
		cycleHours: yup
			.number()
			.default(cycleHours)
			.min(0, "Minimum 0 Hours")
			.max(23, "Maximum 23 Hours")
			.required("*Required"),
		cycles: yup.number().default($focusSession.cycles).min(2)
	});

	const { form, errors } = createForm<CreateSessionValues>({
		//@ts-expect-error
		extend: validator({ schema }),
		onSubmit: ({ cycles, breakHours, breakMinutes, cycleHours, cycleMinutes }) => {
			dispatchSubmit("timerStartRequest", {
				cycleHours,
				breakHours,
				breakMinutes,
				cycleMinutes,
				cycles
			});
		},
		initialValues: {
			cycles: $focusSession.cycles,
			breakHours,
			breakMinutes,
			cycleHours,
			cycleMinutes
		}
	});
</script>

<form use:form class="flex flex-col space-y-4">
	<div class="flex flex-col space-y-2">
		<label class="label" for="cycles">Cycles</label>
		<input
			id="cycles"
			name="cycles"
			type="number"
			class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
		/>
	</div>
	<div class="max-h-content flex flex-col space-y-2">
		<label class="label" for="cycleDuration">Cycle Duration</label>
		<div class="flex h-full space-x-4" id="cycleDuration">
			<div class="flex w-full flex-col space-y-1">
				<input
					placeholder="Hours"
					id="cycleHours"
					name="cycleHours"
					type="number"
					min={0}
					max={23}
					class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{#if $errors.cycleHours}
					{#each $errors.cycleHours as error}
						<p class="font-medium text-red-500">{error}</p>
					{/each}
				{/if}
			</div>
			<p class="pt-1 text-lg font-semibold">:</p>
			<div class="flex w-full flex-col space-y-1">
				<input
					placeholder="Minutes"
					id="cycleMinutes"
					name="cycleMinutes"
					type="number"
					min={1}
					max={59}
					class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{#if $errors.cycleMinutes}
					{#each $errors.cycleMinutes as error}
						<p class="font-medium text-red-500">{error}</p>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="flex flex-col space-y-2">
		<label class="label" for="breakDuration">Break Duration</label>
		<div class="flex space-x-4" id="breakDuration">
			<div class="flex w-full flex-col space-y-1">
				<input
					placeholder="Hours"
					id="breakHours"
					name="breakHours"
					type="number"
					min={0}
					max={23}
					class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{#if $errors.breakHours}
					{#each $errors.breakHours as error}
						<p class="font-medium text-red-500">{error}</p>
					{/each}
				{/if}
			</div>
			<p class="pt-1 text-lg font-semibold">:</p>
			<div class="flex w-full flex-col space-y-1">
				<input
					placeholder="Minutes"
					id="breakMinutes"
					name="breakMinutes"
					type="number"
					min={1}
					max={59}
					class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
				/>
				{#if $errors.breakMinutes}
					{#each $errors.breakMinutes as error}
						<p class="font-medium text-red-500">{error}</p>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<button
		type="submit"
		class="mt-11 rounded-md border-1 bg-blue-500 py-2 px-8 font-medium text-white outline-none"
		>Start</button
	>
</form>
