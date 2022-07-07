<script lang="ts">
	import { validator } from "@felte/validator-yup";
	import axios from "axios";
	import { createForm } from "felte";
	import * as yup from "yup";
	import processAuthErrors from "../../helpers/processAuthErrors";
	import variables from "../../variables";
	import GithubButton from "./GithubButton.svelte";
	import GoogleButton from "./GoogleButton.svelte";

	export let name: "Login" | "Register" = "Login";

	let authErrors: AuthError[] = [];

	const schema: yup.SchemaOf<LoginFormSubmit> = yup.object({
		name:
			name === "Register"
				? yup.string().min(4, "Minimun 3 Characters").required("Required*")
				: yup.string().min(4, "Minimun 3 Characters"),
		identifier:
			name === "Register"
				? yup.string().email("Not an email").required("Required*")
				: yup.string().required("Required*"),
		password: yup.string().required("Required*").min(6, "Minimum of 6 Characters")
	});

	const { form, errors } = createForm<LoginFormSubmit>({
		//@ts-expect-error
		extend: validator({ schema }),
		onSubmit: async ({ password, name, identifier }) => {
			try {
				const res = await axios.post(
					`${variables.serverUrl}/auth/${name === "Register" ? "register" : "login"}`,
					{
						body: {
							email: identifier,
							name,
							password
						}
					}
				);

				const data = res.data as App.Session;
				console.log(data);
				
				window.location.href = `/auth/redirect?token=${data.token}`;
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.response) {
						console.log(e.response.data);
						authErrors = processAuthErrors((e.response.data as { message: string[] }).message);
					}
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
			{#each authErrors as error}
				{#if error.type == "Username"}
					<p class="font-medium text-red-500">{error.message}</p>
				{/if}
			{/each}
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
		{#each authErrors as error}
			{#if error.type === "Email" && name === "Register"}
				<p class="font-medium text-red-500">{error.message}</p>
			{:else if (error.type === "Email" || error.type === "Username") && name === "Login"}
				<p class="font-medium text-red-500">{error}</p>
			{/if}
		{/each}
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
		{#each authErrors as error}
			{#if error.type == "Password"}
				<p class="font-medium text-red-500">{error.message}</p>
			{/if}
		{/each}
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
