<script lang="ts">
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import { Avatar } from "@skeletonlabs/skeleton";
	import type { PageData } from "./$types";
	import FasPen from "~icons/fa6-solid/pen";
	import FasCircleInfo from "~icons/fa6-solid/circle-info";
	import FasRotateLeft from "~icons/fa6-solid/rotate-left";
	import PublishLearningSetDropdown from "$lib/components/PublishLearningSetDropdown.svelte";
	import { enhance } from "$app/forms";
	import FasChalkboardUser from "~icons/fa6-solid/chalkboard-user";
	import FasComputerMouse from "~icons/fa6-solid/computer-mouse";

	export var data: PageData;
</script>

<svelte:head>
	<title>
		{data.learningSet.name} megtekintése - Quizard
	</title>
</svelte:head>

<PageContentContainer class="gap-4 max-w-2xl">
	<header class="mb-2 w-full">
		<PageHeading>{data.learningSet.name}</PageHeading>

		<div class="flex flex-col gap-2 mt-4 w-1/2">
			<h2 class="!text-xl">Leírás</h2>
			<p class="w-full py-2 px-4 min-h-[100px] rounded-lg border border-surface-500">
				{data.learningSet.description}
			</p>
		</div>
		<div class="flex items-center gap-2 mt-3">
			<p>By:</p>
			<Avatar
				src={data.learningSet.author.avatar}
				class="inline-flex items-center"
				rounded="rounded-full"
				width="w-8"
			/>
			<p>{data.learningSet.author.displayName}</p>
		</div>
	</header>

	<div class="flex flex-col gap-2">
		<h2 class="!text-xl">Lehetőségek</h2>
		<div class="flex items-center gap-2">
			<a
				href="/learn/flashcards/{data.learningSet.id}"
				data-sveltekit-preload-data="hover"
				class="btn variant-filled-primary gap-2"
			>
				<FasChalkboardUser />
				Kártyák tanulása
			</a>
			<a
				href="/learn/quiz/{data.learningSet.id}"
				data-sveltekit-preload-data="hover"
				class="btn variant-filled-primary gap-2"
			>
				<FasComputerMouse />
				Interaktív kvíz
			</a>
		</div>
	</div>

	<h2 class="!text-xl">Kártyák</h2>
	<ul class="flex flex-row flex-wrap justify-start h-fit gap-6">
		{#each data.learningSet.cards as { term, definition }}
			<li class="card border border-primary-500 p-4 w-36">
				<div>{term}</div>
				<hr class="!border-t" />
				<div>{definition}</div>
			</li>
		{/each}
	</ul>

	{#if data.learningSet.visibility === "UNPUBLISHED"}
		<div class="flex flex-col gap-4 w-full mt-8">
			<div class="bg-tertiary-500 p-4 flex items-center w-full gap-4 rounded-lg">
				<FasCircleInfo class="text-sm" />
				Szerkesztői előnézet
			</div>
			<div class="flex items-center gap-2 w-full">
				<a href="/create/{data.learningSet.id}" class="btn variant-filled-secondary gap-2">
					<FasPen />Ugrás a szerkesztőbe
				</a>
				{#if data.learningSet.cards.length >= 2}
					<div class="w-44">
						<PublishLearningSetDropdown id={data.learningSet.id} />
					</div>
				{/if}
			</div>
		</div>
	{:else if data.learningSet.authorId === data.userId}
		<form action="/create/{data.learningSet.id}?/unpublish" method="post" use:enhance class="mt-8">
			<button class="btn variant-filled-error gap-2"
				><FasRotateLeft />Közzététel visszavonása és szerkesztés</button
			>
		</form>
	{/if}
</PageContentContainer>
