<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
	import type { PageData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";
	import FasArrowRight from "~icons/fa6-solid/arrow-right";
	import FasPen from "~icons/fa6-solid/pen";
	import FasCheck from "~icons/fa6-solid/check";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import AutosizedInput from "$lib/components/AutosizedInput.svelte";
	import UserStatsCard from "$lib/components/UserStatsCard.svelte";

	export var data: PageData;
	var originalDisplayName = data.user.displayName;
	var isEditingDisplayName = false;
	var isSubmittingDisplayNameChange = false;

	const submitDisplayNameChange: SubmitFunction = async () => {
		isSubmittingDisplayNameChange = true;

		return ({ result }) => {
			if (result.type !== "success") data.user.displayName = originalDisplayName;
			else originalDisplayName = data.user.displayName;

			isEditingDisplayName = false;
			isSubmittingDisplayNameChange = false;
		};
	};
</script>

<svelte:head>
	<title>Profilod - Quizard</title>
</svelte:head>

<PageContentContainer class="max-w-3xl gap-8 pt-24 items-center">
	<div class="isolate pb-8">
		<div class="flex items-center gap-12 -mb-9 justify-center px-4">
			<Avatar src={data.user.avatar} width="w-32" class="ring-2 ring-surface-500 z-10" />
			<form
				class="flex items-center gap-2"
				action="?/updateDisplayName"
				method="post"
				use:enhance={submitDisplayNameChange}
			>
				<AutosizedInput
					name="displayName"
					class="font-semibold bg-transparent text-3xl h-12 outline-none rounded-md px-2 border-primary-500 {isEditingDisplayName
						? 'border'
						: ''}"
					disabled={!isEditingDisplayName}
					bind:value={data.user.displayName}
				/>
				{#if !isEditingDisplayName}
					<button
						class="btn btn-icon variant-soft w-8 mt-3"
						type="button"
						on:click={() => {
							isEditingDisplayName = true;
						}}
					>
						<FasPen class="text-xs" />
					</button>
				{:else}
					<button
						class="btn btn-icon variant-ghost-success w-8 mt-3"
						type="submit"
						disabled={isSubmittingDisplayNameChange}
					>
						<FasCheck class="text-xs" />
					</button>
				{/if}
			</form>
		</div>
		<hr class="border-2 border-surface-500 w-full" />
	</div>
	<div class="w-1/2 flex flex-col items-center gap-8">
		<UserStatsCard username={data.user.username} publishedSetCount={data.publishedSetCount} receivedLikeCount={data.receivedLikeCount} registrationDate={data.user.createdAt}/>
		<div class="flex flex-col gap-4 w-3/4">
			<h2>Közzétett tananyagok</h2>
			<div class="flex flex-col gap-2">
				<p>
					A profilod látogatóinak itt fog megjelenni a közzétett tananyagaid listája.
				</p>
				<p>
					Te ezeket az alkotói fülön tudod megtekinteni, illetve kezelni.
				</p>
				<a href="/create" class="btn variant-filled-primary gap-2 mt-4">Vigyél oda! <FasArrowRight/></a>
			</div>
		</div>
	</div>
</PageContentContainer>
