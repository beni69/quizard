<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

	if (browser && $page.status === 401) goto("/auth/login");
</script>

<svelte:head>
	<title>Hiba történt - Quizard</title>
</svelte:head>

{#if $page.status !== 401}
	<h1>valami nem jo g</h1>
	<img src="/{$page.status}.gif" alt={$page.error?.message} />
	<p>asszem ezt hivjak ugy hogy {$page.status}</p>
{/if}
