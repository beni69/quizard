<script lang="ts">
	import SignOutButton from "$lib/components/SignOutButton.svelte";
	import { getUser } from "@lucia-auth/sveltekit/client";

	const user = getUser();
</script>

<main>
	<h1>Profile</h1>
	<p>Username: {$user?.name}</p>
	<p>Email: {$user?.email}</p>
	<p>Registered at: {new Date($user?.createdAt).toLocaleString()}</p>
	<img src={$user?.avatar} alt={$user?.name + " avatar"} />

	<SignOutButton />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	img {
		width: 100px;
		height: 100px;
		border-radius: 5%;
		margin-bottom: 1rem;
	}
</style>
