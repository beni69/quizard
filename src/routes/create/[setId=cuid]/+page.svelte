<script lang="ts">
	import type { PageData, SubmitFunction } from "./$types";
	import { enhance } from "$app/forms";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import FasTrashCan from "~icons/fa6-solid/trash-can";
	import FasCheck from "~icons/fa6-solid/check";
	import FasPlus from "~icons/fa6-solid/plus";
	import FasEye from "~icons/fa6-solid/eye";
	import FasUpload from "~icons/fa6-solid/upload";
	import PublishLearningSetDropdown from "$lib/components/PublishLearningSetDropdown.svelte";
	import DeleteLearningSetModal from "$lib/components/DeleteLearningSetModal.svelte";
	import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
	import FormMessageAlert from "$lib/components/FormMessageAlert.svelte";
	import { popup } from "@skeletonlabs/skeleton";

	export var data: PageData;

	var originalChecksum =
		data.learningSet.name + "\t"+
		data.learningSet.description +"\t"+
		data.learningSet.cards.map((card) => (card.term || "\t") + "\t" + (card.definition || "\t")).join("\t") + "\t"
		data.learningSet.tags.join("\t");
	$: checksum =
		data.learningSet.name + "\t"+
		data.learningSet.description + "\t"+
		data.learningSet.cards.map((card) => (card.term || "\t") + "\t" + (card.definition || "\t")).join("\t") + "\t"
		data.learningSet.tags.join("\t");
	$: dirty = checksum !== originalChecksum;

	$:console.log(originalChecksum, checksum)

	var deleteModalOpen = false;

	var cancelTaint = false;
	beforeNavigate((navigation) => {
		if (cancelTaint) {
			cancelTaint = false;
			return;
		}
		if (!dirty) return;
		if (
			confirm(
				"Ha mentés előtt hagyod el az oldalt, a tananyag módosításai elvesznek. Biztos vagy ebben?"
			)
		)
			return;

		navigation.cancel();
	});

	$: duplicateTerm = data.learningSet.cards.some(
		(card, index, cards) => cards.findIndex((otherCard) => otherCard.term === card.term) !== index
	);
	$: invalidCard = data.learningSet.cards.some(
		(card) =>
			!card.term || !card.definition || card.definition.length > 500 || card.term.length > 50
	);
	var updating = false;
	var updateFormErrors: Record<string, string[]> = {};
	const update: SubmitFunction = async ({ formData }) => {
		updating = true;
		formData.append("name", data.learningSet.name);
		formData.append("description", data.learningSet.description);
		formData.append(
			"cards",
			JSON.stringify(
				data.learningSet.cards.reduce(
					(result, { term, definition }) => ({ ...result, [term]: definition }),
					{}
				)
			)
		);
		formData.append("tags", JSON.stringify(data.learningSet.tags));

		return async ({ result }) => {
			if (result.type === "success") {
				originalChecksum = checksum;
				updateFormErrors = {};
				await invalidateAll();
			} else if (result.type === "failure") {
				updateFormErrors = result.data?.errors ?? {};
			}
			updating = false;
		};
	};

	const addToTags = (e: KeyboardEvent) => {
		if (e.key !== "Enter") return;
		const value = (e.target as HTMLInputElement).value;
		if (!value || value.length > 16) return;
		if (data.learningSet.tags.includes(value)) return;
		data.learningSet.tags = [...data.learningSet.tags, value];
		(e.target as HTMLInputElement).value = "";
	};
</script>

<svelte:head>
	<title>{data.learningSet.name} szerkesztése - Quizard</title>
</svelte:head>

<svelte:window on:beforeunload={() => true} />
<PageContentContainer class="gap-8">
	<PageHeading>Tananyag szerkesztése</PageHeading>
	<h2>Általános adatok:</h2>
	<div class="grid grid-cols-[3fr_1fr_1fr] gap-8 w-full p-4 border-surface-800 border rounded-lg">
		<div class="flex flex-col gap-8">
			<label for="name" class="label max-w-xl">
				<span class="text-2xl">Cím</span>
				<input
					id="name"
					bind:value={data.learningSet.name}
					class="block w-full bg-transparent text-2xl h-12 outline-none rounded-md px-2 border-surface-500 focus:border-primary-500 border focus:border-2"
				/>
				<span class="text-error-400">{updateFormErrors.name?.[0] ?? ""}</span>
			</label>
			<label for="description" class="label max-w-xl">
				<span class="text-2xl"> Leírás </span>
				<textarea
					id="description"
					bind:value={data.learningSet.description}
					class="w-full h-32 bg-transparent text-base outline-none rounded-md px-2 border-surface-500 focus:border-primary-500 border resize-none"
				/>
				<span class="text-error-400">{updateFormErrors.description?.[0] ?? ""}</span>
			</label>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="!text-2xl py-1">Címkék</h2>
			<!-- <span class="text-error-400">{updateFormErrors.tags?.[0] ?? ""}</span> -->
			<div class="flex gap-1 flex-wrap w-full">
				{#each data.learningSet.tags as tag, i}
					<button
						class="badge variant-filled !text-black !no-underline"
						on:click={() =>
							(data.learningSet.tags = data.learningSet.tags.filter((_, j) => i !== j))}
					>
						#{tag}
					</button>
				{:else}
					<div class="w-full h-full flex items-center justify-center italic text-surface-400">
						(nincs hozzáadott címke)
					</div>
				{/each}
			</div>
			<input
				on:keypress={addToTags}
				placeholder="Új címke (enter)"
				class="w-full h-12 bg-transparent text-base outline-none rounded-md px-2 border-surface-500 focus:border-primary-500 border resize-none"
			/>
		</div>
		<div class="flex flex-col gap-4 isolate py-1">
			<h2 class="!text-2xl">Műveletek</h2>
			{#if dirty}
				<form action="?/update" method="post" use:enhance={update} class="w-full">
					<button
						class="btn variant-filled-success gap-2 w-full"
						disabled={updating || duplicateTerm || invalidCard}
					>
						<FasCheck />Mentés
					</button>
				</form>
			{:else}
				{#if data.learningSet.cards.length >= 2}
					<PublishLearningSetDropdown
						class="z-50"
						id={data.learningSet.id}
						invalidate={false}
						on:submitted={() => goto(`/set/${data.learningSet.id}`)}
					/>
				{:else}
					<button
						class="btn variant-filled-primary gap-2 opacity-50 cursor-not-allowed transition-none !scale-100 hover:!bg-primary-600"
						use:popup={{ event: "hover", target: `publish-blocked`, placement: "top" }}
						><FasUpload />Közzététel</button
					>
					<div
						class="card variant-filled-surface p-2 z-50 text-sm text-center"
						data-popup="publish-blocked"
					>
						A közzétételhez a tananyag legalább 2 kártyát kell tartalmazzon!
						<div class="arrow variant-filled-surface" />
					</div>
				{/if}
				<a href="/set/{data.learningSet.id}" class="btn variant-filled-tertiary gap-2">
					<FasEye />Előnézet
				</a>
			{/if}
			<button
				class="btn variant-filled-error -z-50 gap-2"
				on:click={() => (deleteModalOpen = true)}
			>
				<FasTrashCan />Törlés
			</button>
			{#if deleteModalOpen}
				<DeleteLearningSetModal
					id={data.learningSet.id}
					invalidate={false}
					bind:open={deleteModalOpen}
					on:submitted={() => {
						cancelTaint = true;
						goto("/create");
					}}
				/>
			{/if}
		</div>
	</div>
	<h2>Kártyák:</h2>
	<div class="flex flex-col items-center w-full gap-4">
		{#if duplicateTerm}
			<FormMessageAlert
				class="w-full"
				message="A tananyag legalább két ismétlődő fogalmat tartalmaz, ezért nem lesz menthető, amíg a hiba javításra nem kerül."
			/>
		{/if}
		{#if invalidCard}
			<FormMessageAlert
				class="w-full"
				message="A tananyag legalább egy olyan kártyát tartalmaz, amely fogalma vagy meghatározása üres, vagy túl hosszú, ezért nem lesz menthető, amíg a hiba javításra nem kerül."
			/>
		{/if}
		{#each data.learningSet.cards as { term, definition }, i}
			<div
				class="grid grid-cols-2 gap-8 w-full p-4 border-primary-500 border rounded-lg h-fit relative isolate {deleteModalOpen ? "-z-10":""}"
			>
				<label for="term" class="label max-w-xl">
					<span class="text-lg">Fogalom</span>
					<input
						id="term"
						placeholder="Rövid kifejezés"
						bind:value={term}
						class="block w-full bg-transparent h-12 outline-none rounded-md px-2 border-surface-500 focus:border-primary-500 border focus:border-2"
					/>
				</label>
				<label for="definition" class="label max-w-xl">
					<span class="text-lg">Meghatározás</span>
					<textarea
						id="definition"
						placeholder="Kifejtett definíció"
						bind:value={definition}
						class="w-full h-12 bg-transparent text-base outline-none rounded-md px-2 border-surface-500 focus:border-primary-500 border resize-none"
					/>
				</label>
				<button
					class="absolute -top-3 -right-3 btn btn-icon w-8 h-8 variant-filled-error"
					on:click={() =>
						(data.learningSet.cards = data.learningSet.cards.filter((_, j) => j !== i))}
				>
					<FasTrashCan class="text-xs" />
				</button>
			</div>
		{:else}
			<p class="italic text-surface-400">
				A tananyag még nem tartalmaz kártyákat. A lenti gombra kattintva lértehozhatod az elsőt.
			</p>
		{/each}
		<button
			class="btn variant-filled-tertiary gap-2"
			class:btn-lg={data.learningSet.cards.length === 0}
			on:click={() => {
				cancelTaint = true;
				data.learningSet.cards = [
					...data.learningSet.cards,
					{ term: "", definition: "", learningSetId: data.learningSet.id },
				];
			}}
		>
			<FasPlus />Új kártya
		</button>
	</div>
</PageContentContainer>
