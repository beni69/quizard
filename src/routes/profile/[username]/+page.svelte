<script lang="ts">
	import { Accordion, Avatar } from "@skeletonlabs/skeleton";
	import type { PageData } from "./$types";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import UserStatsCard from "$lib/components/UserStatsCard.svelte";
	import LearningSetAccordionItem from "$lib/components/LearningSetAccordionItem.svelte";
	import PaginationControl from "$lib/components/PaginationControl.svelte";
	import {page} from "$app/stores";
	import {goto} from "$app/navigation";

	export var data: PageData;

	async function gotoPage(page: number) {
		const url = $page.url;
		url.searchParams.set("page", page.toString());
		await goto(url.toString(), { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>{data.profileUser.displayName} profilja - Quizard</title>
</svelte:head>

<PageContentContainer class="max-w-4xl gap-8 pt-24 items-center">
	<div class="isolate pb-8">
		<div class="flex items-center gap-12 -mb-9 justify-center px-4">
			<Avatar src={data.profileUser.avatar} width="w-32" class="ring-2 ring-surface-500 z-10" />
			<span class="text-3xl font-semibold">{data.profileUser.displayName}</span>
		</div>
		<hr class="border-2 border-surface-500 w-full" />
	</div>
	<div class="flex flex-col items-center gap-16">
		<UserStatsCard
			username={data.profileUser.username}
			publishedSetCount={data.publishedSetCount}
			receivedLikeCount={data.receivedLikeCount}
			registrationDate={data.profileUser.createdAt}
		/>
		<div class="flex flex-col gap-8 w-full">
			<h2>Közzétett tananyagok</h2>
			<header
				class="grid grid-cols-5 gap-2 font-bold w-full pl-4 pr-11 py-1 bg-surface-800 -mb-6 rounded-md"
			>
				<span>Cím</span>
				<span>Tetszések</span>
				<span>Címkék</span>
				<span>Közzétéve</span>
				<span>Szerző</span>
			</header>
			<div class="flex flex-col gap-2">
				<Accordion autocollapse>
					{#each data.createdSets.matchedRecords as learningSet}
						<LearningSetAccordionItem {...learningSet} author={data.profileUser} user={data.user} />
					{/each}
				</Accordion>
				<div class="flex items-center justify-between w-full border-surface-500 border-t-2 py-2">
					<span class="text-sm text-surface-400">
						Összesen {data.createdSets.matchCount} darab tananyag található
					</span>
					<PaginationControl
						pageCount={data.createdSets.pageCount}
						currentPage={data.createdSets.currentPage}
						on:navigate={(e) => gotoPage(e.detail)}
					>
						Oldal: {data.createdSets.currentPage + 1}/{data.createdSets.pageCount}
					</PaginationControl>
				</div>
			</div>
		</div>
	</div>
</PageContentContainer>
