<script lang="ts">
	import { goto } from "$app/navigation";
	import { Menu, MenuButton, MenuItem, MenuItems } from "@rgossiaux/svelte-headlessui";
	import SettingsIcon from "../icons/SettingsIcon.svelte";
</script>

<Menu as="div" class="relative inline-block text-left">
	<MenuButton>
		<SettingsIcon />
	</MenuButton>
	<MenuItems
		class="absolute right-0 mt-2 flex w-56 origin-top-right flex-col space-y-4 divide-y divide-gray-100 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
	>
		<MenuItem let:active>
			<a href="/account" class="">Settings</a>
		</MenuItem>
		<MenuItem let:active>
			<a href="/settings" class="">Documentation</a>
		</MenuItem>
		<MenuItem disabled>
			<button on:click={() => goto("/api/auth/logout")}>Logout</button>
		</MenuItem>
	</MenuItems>
</Menu>
