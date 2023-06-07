<script lang="ts">
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";

	export var data: PageData;
</script>

<PageContentContainer class="gap-8">
	<PageHeading>Szerkesztés</PageHeading>
</PageContentContainer>


<form action="?/createCard" method="post" use:enhance>
	<label for="term">Fogalom:</label>
	<input type="text" id="term" name="term" />
	<label for="definition">Definíció:</label>
	<textarea id="definition" name="definition" />
	<button type="submit">Új kártya</button>
</form>

<a href="/set/{$page.params.setId}">Megtekintés</a>
