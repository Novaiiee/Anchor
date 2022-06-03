<script lang="ts">
	import { validator } from "@felte/validator-yup";
	import { createForm } from "felte";
	import * as yup from "yup";

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
		extend: validator({ schema }),
		onSubmit: (values) => {
			console.log(values);
		}
	});
</script>

<form use:form class="flex flex-col space-y-6 items-center">
	<h1 class="text-4xl font-bold">{name}</h1>
	{#if name === "Register"}
		<div class="flex flex-col space-y-2">
			<label class="label" for="email">Username</label>
			<input
				id="name"
				name="name"
				type="text"
				class="border-1 rounded-md px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
			/>
			{#if $errors.name}
				{#each $errors.name as error}
					<p class="text-red-500 font-medium">{error}</p>
				{/each}
			{/if}
		</div>
	{/if}
	<div class="flex flex-col space-y-2">
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
			class="border-1 rounded-md px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
		/>
		{#if $errors.identifier}
			{#each $errors.identifier as error}
				<p class="text-red-500 font-medium">{error}</p>
			{/each}
		{/if}
	</div>
	<div class="flex flex-col space-y-2">
		<label class="label" for="email">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			class="border-1 rounded-md px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
		/>
		{#if $errors.password}
			{#each $errors.password as error}
				<p class="text-red-500 font-medium">{error}</p>
			{/each}
		{/if}
	</div>
	<button type="submit" class="py-2 px-8 w-full font-medium outline-none border-1 rounded-md bg-blue-700 text-white"
		>Submit</button
	>
	{#if name === "Register"}
		<a href="/auth/login">Already have an account? Login!</a>
	{:else}
		<a href="/auth/register">Don't have an account? Register Now!</a>
	{/if}
</form>
