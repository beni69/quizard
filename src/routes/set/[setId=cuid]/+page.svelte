<script lang="ts">
	import type { PageData } from "./$types";

	export var data: PageData;
</script>

<h1>Tananyag megtekintése</h1>
<h2>{data.learningSet.name}</h2>
<p>{data.learningSet.description}</p>

<ul>
	{#each data.learningSet.cards as { term, definition }}
		<li>
			<div>{term}</div>
			<div>{definition}</div>
		</li>
	{/each}
</ul>

{#if data.userId === data.learningSet.userId}
    Te vagy a szerző.
	<a href="/create/{data.learningSet.id}">Tananyag szerkesztése</a>
{/if}
