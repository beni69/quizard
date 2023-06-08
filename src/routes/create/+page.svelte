<script lang="ts">
	import type { PageData } from "./$types";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import LearningSetAccordionItemSummary from "$lib/components/LearningSetAccordionItemSummary.svelte";
	import FasPlus from "~icons/fa6-solid/plus";
	import FasPen from "~icons/fa6-solid/pen";
	import FasTrashCan from "~icons/fa6-solid/trash-can";
	import FasUpload from "~icons/fa6-solid/upload";
	import PublishLearningSetDropdown from "$lib/components/PublishLearningSetDropdown.svelte";
	import DeleteLearningSetModal from "$lib/components/DeleteLearningSetModal.svelte";
	import CreateLearningSetModal from "$lib/components/CreateLearningSetModal.svelte";
	import { popup } from "@skeletonlabs/skeleton";
	import PaginationControl from "$lib/components/PaginationControl.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	// also show the time of day
	const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	export var data: PageData;

	$: publishedSets = data.learningSets.matchedRecords.filter((set) => set.publishedAt != null);
	$: editedSets = data.learningSets.matchedRecords.filter((set) => set.publishedAt == null);

	$: deleteModalOpen = new Array<boolean>(editedSets.length).fill(false);
	var createModalOpen = false;

	async function gotoPage(page: number) {
		const url = $page.url;
		url.searchParams.set("page", page.toString());
		await goto(url.href);
	}
</script>

<svelte:head>
	<title>Alkotás - Quizard</title>
</svelte:head>

<PageContentContainer class="gap-8">
	<PageHeading>Alkotás</PageHeading>
	<div class="w-full flex flex-col gap-4">
		<h2>Szerkesztés alatt:</h2>
		<ul
			class="w-full flex portrait:flex-wrap items-center content-center gap-8 justify-start portrait:!justify-center px-4 py-6 border border-surface-800 rounded-lg landscape:overflow-auto"
		>
			{#each editedSets as { name, description, id, updatedAt, cards }, i (id)}
				{#if deleteModalOpen[i]}
					<DeleteLearningSetModal {id} bind:open={deleteModalOpen[i]} />
				{/if}
				<div class="relative w-fit">
					<button
						class="absolute -top-3 -right-3 btn btn-icon w-8 h-8 variant-filled-error"
						on:click={() => (deleteModalOpen[i] = true)}
					>
						<FasTrashCan class="text-xs" />
					</button>
					<li class="w-96 h-fit min-h-[16rem] card flex flex-col justify-between gap-4 p-4 text-lg">
						<div class="flex flex-col gap-4 h-full">
							<div class="flex items-center justify-between w-full gap-2">
								<h3 class="font-semibold overflow-auto max-w-[60%]">{name}</h3>
								<span class="text-sm text-surface-400">{dateFormatter.format(updatedAt)}</span>
							</div>
							<p class="normal-case card variant-ghost h-full min-h-[118px] p-2">
								{#if description}
									{description}
								{:else}
									<span class="italic text-surface-400">(nem adtál meg leírást)</span>
								{/if}
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<a href="/create/{id}" class="btn variant-filled-primary gap-2">
								<FasPen class="text-sm" />
								Folytatás
							</a>
							{#if cards.length < 2}
								<button
									class="btn variant-filled-primary gap-2 opacity-50 cursor-not-allowed transition-none !scale-100 hover:!bg-primary-600"
									use:popup={{ event: "hover", target: `publish-blocked-${id}`, placement: "top" }}
									><FasUpload />Közzététel</button
								>
								<div
									class="card variant-filled-surface py-2 z-50 text-sm text-center"
									data-popup="publish-blocked-{id}"
								>
									A közzétételhez a tananyag legalább 2 kártyát kell tartalmazzon!
									<div class="arrow variant-filled-surface" />
								</div>
							{:else}
								<PublishLearningSetDropdown {id} />
							{/if}
						</div>
					</li>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center w-1/3 mx-auto py-4 gap-4">
					<p class="text-center text-surface-400">
						Úgy tűnik, épp nem dolgozol egy tananyagon sem. Ezen változtathatsz a lenti gombra
						kattintva.
					</p>
					<button
						class="btn variant-filled-primary gap-2 btn-lg"
						on:click={() => (createModalOpen = true)}><FasPlus />Létrehozás</button
					>
				</div>
			{/each}
			<div class="card variant-filled-surface py-2 px-3 z-50" data-popup="create-blocked">
				Egyszerre maximum 5 tananyagot szerkeszthetsz
				<div class="arrow variant-filled-surface" />
			</div>
			{#if editedSets.length >= 5}
				<button
					class="btn btn-icon-xl variant-filled-secondary opacity-50 cursor-not-allowed transition-none !scale-100 hover:!bg-secondary-600"
					use:popup={{ target: "create-blocked", event: "hover", placement: "top" }}
				>
					<FasPlus />
				</button>
			{:else if editedSets.length > 0}
				<button
					class="btn btn-icon-xl variant-filled-secondary"
					on:click={() => (createModalOpen = true)}
				>
					<FasPlus />
				</button>
			{/if}
			{#if createModalOpen}
				<CreateLearningSetModal bind:open={createModalOpen} />
			{/if}
		</ul>
	</div>
	{#if publishedSets.length > 0}
		<div class="flex flex-col gap-4 w-full">
			<h2>Közzétett:</h2>
			<div class="flex flex-col gap-8">
				<header
					class="grid grid-cols-5 gap-2 font-bold w-full pl-4 pr-11 py-1 bg-surface-800 -mb-6 rounded-md"
				>
					<span>Cím</span>
					<span>Tetszések</span>
					<span>Címkék</span>
					<span>Közzétéve</span>
					<span>Szerző</span>
				</header>
				<ul>
					{#each publishedSets as set}
						<li class="w-full">
							<LearningSetAccordionItemSummary {...set} href="/set/{set.id}" />
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="flex items-center justify-between w-full border-t-2 border-surface-500 py-2">
			<span class="text-surface-400 text-sm"
				>Eddig összesen {data.learningSets.matchCount} tananyagot tettél közzé</span
			>
			<PaginationControl
				{...data.learningSets}
				let:currentPage
				let:pageCount
				on:navigate={(e) => gotoPage(e.detail)}
			>
				Oldal: {currentPage + 1}/{pageCount}
			</PaginationControl>
		</div>
	{/if}
</PageContentContainer>
