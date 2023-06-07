<script lang="ts">
	import type { PageData } from "./$types";
	import { page, navigating } from "$app/stores";
	import { goto, afterNavigate } from "$app/navigation";
	import { Accordion } from "@skeletonlabs/skeleton";
	import LearningSetAccordionItem from "$lib/components/LearningSetAccordionItem.svelte";
	import FasMagnifyingGlass from "~icons/fa6-solid/magnifying-glass";
	import FasCaretUp from "~icons/fa6-solid/caret-up";
	import FasCaretDown from "~icons/fa6-solid/caret-down";
	import PaginationControl from "$lib/components/PaginationControl.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";

	export var data: PageData;

	$: sortBy = $page.url.searchParams.get("sortBy") ?? "publishedAt";
	$: sortDirection = $page.url.searchParams.get("sortDirection") ?? "desc";

	async function gotoPage(page: number) {
		const url = $page.url;
		url.searchParams.set("page", page.toString());
		await goto(url.toString(), { invalidateAll: true });
	}

	async function sort(by: "publishedAt" | "name" | "score") {
		const url = $page.url;

		let direction = url.searchParams.get("sortDirection") ?? "desc";
		direction = direction === "desc" ? "asc" : "desc";

		url.searchParams.set("sortBy", by);
		url.searchParams.set("sortDirection", direction);

		await goto(url.toString(), { invalidateAll: true });

		sortDirection = direction;
		sortBy = by;
	}

	var flipflop = false;
	afterNavigate(() => (flipflop = !flipflop));
</script>

<svelte:head>
	<title>Felfedezés - Quizard</title>
</svelte:head>

<PageContentContainer class="gap-8">
	<div class="flex items-center justify-between w-full">
		<PageHeading>Felfedezés</PageHeading>
		<form action="/browse">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<input type="search" name="query" placeholder="Keresés..." />
				<button class="variant-filled-tertiary"><FasMagnifyingGlass class="text-sm" /></button>
			</div>
		</form>
	</div>
	<header
		class="grid grid-cols-5 gap-2 font-bold w-full pl-4 pr-11 py-1 bg-surface-800 -mb-6 rounded-md"
	>
		<button
			on:click={() => sort("name")}
			disabled={$navigating != null}
			class="flex items-center justify-start gap-1"
		>
			Cím
			{#if sortBy === "name" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "name" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<button
			on:click={() => sort("score")}
			disabled={$navigating != null}
			class="flex items-center justify-start gap-1"
		>
			Tetszések
			{#if sortBy === "score" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "score" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<span>Címkék</span>
		<button
			on:click={() => sort("publishedAt")}
			disabled={$navigating != null}
			class="flex items-center justify-start gap-1"
		>
			Közzétéve
			{#if sortBy === "publishedAt" && sortDirection === "asc"}
				<FasCaretUp class="text-sm" />
			{:else if sortBy === "publishedAt" && sortDirection === "desc"}
				<FasCaretDown class="text-sm" />
			{/if}
		</button>
		<span>Szerző</span>
	</header>
	{#key flipflop}
		<Accordion class="w-full" autocollapse>
			{#each data.matches.records as learningSet}
				<LearningSetAccordionItem {...learningSet} user={data.user} />
			{/each}
		</Accordion>
	{/key}
	<div class="flex items-center justify-between w-full border-surface-500 border-t-2 py-2">
		<span class="text-sm text-surface-400">
			A keresésnek megfelel {data.matches.count} darab a(z) {data.totalCount} tananyag közül
		</span>
		<PaginationControl
			pageCount={data.pageCount}
			currentPage={data.currentPage}
			on:navigate={(e) => gotoPage(e.detail)}
		>
			Oldal: {data.currentPage + 1}/{data.pageCount}
		</PaginationControl>
	</div>
</PageContentContainer>
