<script lang="ts">
	import "../app.pcss";
	import { SvelteUIProvider } from "@svelteuidev/core";

	import { page } from "$app/stores";
	import { getUser, handleSession } from "@lucia-auth/sveltekit/client";
	handleSession(page);

	// the store returned by getUser() only updates to reflect the latest data in the database when the layout load re-runs,
	// but requests to protected routes fetch the latest information every time, so don't worry (it won't update this though)
	const user = getUser();
</script>

<SvelteUIProvider>
	<header>
		User: {$user?.name ?? "None"}
	</header>
	<main class="grow">
		<slot />
	</main>
	<footer>footer</footer>
</SvelteUIProvider>
