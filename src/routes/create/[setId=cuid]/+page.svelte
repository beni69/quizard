<script lang="ts">
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";

	export var data: PageData;
</script>

<h1>Szerkesztő</h1>
<h2>ID: {$page.params.setId}</h2>

<ul>
	{#each data.cards as { term, definition }}
		<li>
			<div>{term}</div>
			<div>{definition}</div>
		</li>
	{/each}
</ul>

<form action="?/createCard" method="post" use:enhance>
	<label for="term">Fogalom:</label>
	<input type="text" id="term" name="term" />
	<label for="definition">Definíció:</label>
	<textarea id="definition" name="definition" />
	<button type="submit">Új kártya</button>
</form>

<a href="/set/{$page.params.setId}">Megtekintés</a>