<script lang="ts">
	import { validator } from "@felte/validator-yup";
	import { createForm } from "felte";
	import * as yup from "yup";
	import variables from "../../variables";
	import GithubButton from "./GithubButton.svelte";
	import GoogleButton from "./GoogleButton.svelte";
				
	export let name: "Login" | "Register" = "Login";

	const schema = yup.object({
		name:
			name === "Register"
				? yup.string().min(3, "Minimun 3 Characters").required("Required*")
				: yup.string().min(3, "Minimun 3 Characters"),
		identifier:
			name === "Register"
				? yup.string().email("Not an email").required("Required*")
				: yup.string().required("Required*"),
		password: yup.string().required("Required*").min(6, "Minimum of 6 Characters")
	});

	const { form, errors } = createForm<LoginFormSubmit>({
		//@ts-expect-error
		extend: validator({ schema }),
		onSubmit: async (values) => {
			if (name === "Register") {
				try {
					const res = await fetch(`${variables.serverUrl}/auth/register`, {
						method: "POST",
						body: JSON.stringify({ ...values })
					});
	
					if (res.ok) {
						const data = await res.json();
						console.log(data);
						return;
					}
	
					console.log(res.status, res.statusText);	
				} catch (e) {
					console.log(e);
				}
			}
		}
	});
</script>

<form use:form class="flex flex-col items-center space-y-6 md:w-2/12">
	<h1 class="text-4xl font-bold">{name}</h1>
	<GoogleButton />
	<GithubButton />
	{#if name === "Register"}
		<div class="flex w-full flex-col space-y-2">
			<label class="label" for="email">Username</label>
			<input
				id="name"
				name="name"
				type="text"
				class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
			/>
			{#if $errors.name}
				{#each $errors.name as error}
					<p class="font-medium text-red-500">{error}</p>
				{/each}
			{/if}
		</div>
	{/if}
	<div class="flex w-full flex-col space-y-2">
		<label class="label" for="email">
			{#if name === "Register"}
				Email
			{:else}
				Username or Email
			{/if}
		</label>
		<input
			id="identifier"
			name="identifier"
			type="text"
			class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
		/>
		{#if $errors.identifier}
			{#each $errors.identifier as error}
				<p class="font-medium text-red-500">{error}</p>
			{/each}
		{/if}
	</div>
	<div class="flex w-full flex-col space-y-2">
		<label class="label" for="email">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			class="w-full rounded-md border-1 px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-gray-400"
		/>
		{#if $errors.password}
			{#each $errors.password as error}
				<p class="font-medium text-red-500">{error}</p>
			{/each}
		{/if}
	</div>
	<button
		type="submit"
		class="w-full rounded-md border-1 bg-blue-700 py-2 px-8 font-medium text-white outline-none"
		>Submit</button
	>
	{#if name === "Register"}
		<a href="/auth/login" class="text-blue-400">Already have an account? Login!</a>
	{:else}
		<a href="/auth/register" class="text-blue-400">Don't have an account? Register Now!</a>
	{/if}
</form>
