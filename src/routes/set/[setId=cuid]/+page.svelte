<script lang="ts">
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import { Avatar } from "@skeletonlabs/skeleton";
	import type { PageData } from "./$types";

	export var data: PageData;
</script>

<PageContentContainer>
	<header class="mb-2">
		<PageHeading>{data.learningSet.name}</PageHeading>
		<p class="mt-4">{data.learningSet.description}</p>
		<div class="flex items-center gap-2 mt-3">
			<p>By:</p>
			<Avatar
				src={data.user?.avatar}
				class="inline-flex items-center"
				rounded="rounded-full"
				width="w-8"
			/>
		</div>
	</header>

	<div class="my-4">
		<a
			href="/learn/flashcards/{data.learningSet.id}"
			data-sveltekit-preload-data="hover"
			class="btn variant-filled-primary"
		>
			Kártyák tanulása
		</a>
		<a
			href="/learn/quiz/{data.learningSet.id}"
			data-sveltekit-preload-data="hover"
			class="btn variant-filled-primary"
		>
			Interaktív quiz
		</a>
	</div>

	<ul class="flex flex-row flex-wrap justify-start h-fit gap-6">
		{#each data.learningSet.cards as { term, definition }}
			<li class="card border border-primary-500 p-4 w-36">
				<div>{term}</div>
				<hr class="!border-t" />
				<div>{definition}</div>
			</li>
		{/each}
	</ul>

	{#if data.userId === data.learningSet.authorId}
		Te vagy a szerző.
		<a href="/create/{data.learningSet.id}">Tananyag szerkesztése</a>
	{/if}
</PageContentContainer>
