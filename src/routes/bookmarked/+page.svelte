<script lang="ts">
	import type { PageData } from "./$types";
	import { Accordion, Avatar } from "@skeletonlabs/skeleton";
	import FasQuestion from "~icons/fa6-solid/question";
	import PaginationControl from "$lib/components/PaginationControl.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import LearningSetAccordionItemSummary from "$lib/components/LearningSetAccordionItemSummary.svelte";

	export var data: PageData;

	async function gotoPage(page: number) {
		const url = $page.url;
		url.searchParams.set("page", page.toString());
		await goto(url.toString(), { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Mentett tananyagok - Quizard</title>
</svelte:head>

<PageContentContainer class="gap-8">
	<PageHeading>Mentett tananyagok</PageHeading>
	<header
		class="grid grid-cols-5 gap-2 font-bold w-full pl-4 pr-11 py-1 bg-surface-800 -mb-6 rounded-md"
	>
		<span>Cím</span>
		<span>Tetszések</span>
		<span>Címkék</span>
		<span>Közzétéve</span>
		<span>Szerző</span>
	</header>
	<ul class="w-full">
		{#each data.matches.matchedRecords as learningSet}
			<li class="w-full">
				<LearningSetAccordionItemSummary {...learningSet} />
			</li>
		{:else}
			<div
				class="flex items-center text-xl font-semibold gap-4 justify-center py-8 text-surface-400"
			>
				<FasQuestion class="text-4xl" /> Még nincs egy mentett tananyagod sem
			</div>
		{/each}
	</ul>
	<div class="flex items-center justify-between w-full border-surface-500 border-t-2 py-2">
		<span class="text-sm text-surface-400">
			Összesen {data.totalCount} darab tananyag található
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
