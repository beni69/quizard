<script lang="ts">
	import SignOutButton from "$lib/components/SignOutButton.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: console.log("user", data.user);
</script>

<main>
	<h1>Profile</h1>
	<p>Username: {data.user.name}</p>
	<p>Email: {data.user.email}</p>
	<p>Registered at: {new Date(data.user.createdAt).toLocaleString()}</p>
	<img src={data.user.avatar} alt={data.user.name + " avatar"} />

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
