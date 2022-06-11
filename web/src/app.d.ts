/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		token: string;
		user: User;
	}
	// interface Platform {}
	interface Session {
		token: string;
		user: User;
	}
	// interface Stuff {}
}
