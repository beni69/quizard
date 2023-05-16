<script lang="ts">
	import SignOutButton from "$lib/components/SignOutButton.svelte";
	import type { PageData } from "./$types";

	export var data: PageData;
</script>

<h1>Profile</h1>
<p>Username: {data.user.username}</p>
<p>Email: {data.user.email}</p>
<p>Registered at: {new Date(data.user.createdAt).toLocaleString()}</p>
<img src={data.user.avatar} alt={data.user.username + " avatar"} />

<SignOutButton />

<style>
	img {
		width: 100px;
		height: 100px;
		border-radius: 5%;
		margin-bottom: 1rem;
	}
</style>
