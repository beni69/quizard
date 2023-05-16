<script lang="ts">
	import type { PageData } from "./$types";
	import { page, navigating } from "$app/stores";
	import { goto } from "$app/navigation";
	import { Accordion } from "@skeletonlabs/skeleton";
	import LearningSetAccordionItem from "$lib/components/LearningSetAccordionItem.svelte";
	import FasMagnifyingGlass from "~icons/fa6-solid/magnifying-glass";
	import FasCaretUp from "~icons/fa6-solid/caret-up";
	import FasCaretDown from "~icons/fa6-solid/caret-down";
	import FasChevronRight from "~icons/fa6-solid/chevron-right";
	import FasChevronLeft from "~icons/fa6-solid/chevron-left";

	export var data: PageData;

	$: sortBy = $page.url.searchParams.get("sortBy") ?? "publishedAt";
	$: sortDirection = $page.url.searchParams.get("sortDirection") ?? "desc";

	$: pageCount = data.matches.count === 0 ? 1 : Math.ceil(data.matches.count/data.matches.records.length);

	async function gotoPage(page: number) {
		const url = $page.url;
		url.searchParams.set("page", page.toString());
		await goto(url.toString(), {invalidateAll: true});
	}

	async function sort(by: "publishedAt" | "name" | "score") {
		const url = $page.url;

		let direction = url.searchParams.get("sortDirection") ?? "desc";
		direction = direction === "desc" ? "asc" : "desc";

		url.searchParams.set("sortBy", by);
		url.searchParams.set("sortDirection", direction);

		await goto(url.toString(), {invalidateAll: true});

		sortDirection = direction;
		sortBy = by;
	}
</script>

<svelte:head>
	<title>Böngészés - Quizard</title>
</svelte:head>

<div class="max-w-6xl mx-auto flex flex-col items-start gap-8">
	<div class="flex items-center justify-between w-full">
		<a class="flex items-center gap-4 !text-white !no-underline" href="/browse"><FasMagnifyingGlass class="text-2xl"/><h1 class="!text-4xl">Böngészés</h1></a>
		<form action="/browse">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<input type="search" name="query" placeholder="Keresés..." />
				<button class="variant-filled-tertiary"><FasMagnifyingGlass class="text-sm" /></button>
			</div>
		</form>
	</div>
	<header class="grid grid-cols-5 gap-2 font-bold w-full pl-4 pr-11 py-1 bg-surface-800 -mb-6">
		<button on:click={() => sort("name")} disabled={$navigating != null} class="flex items-center justify-start gap-1">
			Cím
			{#if sortBy === "name" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "name" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<button on:click={() => sort("score")} disabled={$navigating != null} class="flex items-center justify-start gap-1">
			Tetszések
			{#if sortBy === "score" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "score" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<span>Címkék</span>
		<button on:click={() => sort("publishedAt")} disabled={$navigating != null} class="flex items-center justify-start gap-1">
			Közzétéve
			{#if sortBy === "publishedAt" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "publishedAt" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<span>Szerző</span>
	</header>
	<Accordion class="w-full" autocollapse>
		{#each data.matches.records as learningSet}
			<LearningSetAccordionItem {...learningSet} user={data.user} />
		{/each}
	</Accordion>
	<div class="flex items-center justify-between w-full border-surface-500 border-t-2 py-2">
		<span class="text-sm text-surface-400">
			A keresésnek megfelel {data.matches.count} darab a(z) {data.totalCount} tananyag közül
		</span>
		<div class="flex items-center gap-4">
			<span>
				Oldal: {data.currentPage+1}/{pageCount}
			</span>
			<div class="flex items-center justify-between gap-2">
				<button
					class="btn btn-icon !w-10 variant-filled-tertiary"
					on:click={() => gotoPage(data.currentPage - 1)}
					disabled={data.currentPage === 0 || $navigating != null}><FasChevronLeft class="text-sm" /></button
				>
				<button
					class="btn btn-icon !w-10 variant-filled-tertiary"
					on:click={() => gotoPage(data.currentPage + 1)}
					disabled={data.currentPage === pageCount-1 || $navigating != null}><FasChevronRight class="text-sm" /></button
				>
			</div>
		</div>
	</div>
</div>
