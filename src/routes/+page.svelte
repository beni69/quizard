<script lang="ts">
	import AnchorButton from "$lib/components/AnchorButton.svelte";
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
	<li><AnchorButton href="/auth/register" variant="gradient" ripple>/auth/register</AnchorButton></li>
	<li><AnchorButton href="/auth/login" variant="gradient" ripple>/auth/login</AnchorButton></li>
	<li><AnchorButton href="/profile" variant="gradient" ripple >/profile (protected)</AnchorButton></li>
</ul>
