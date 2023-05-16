<script lang="ts">
	import { AccordionItem, Avatar, popup } from "@skeletonlabs/skeleton";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import ReportModal from "./ReportModal.svelte";
	import FasFlag from "~icons/fa6-solid/flag";
	import FasArrowRight from "~icons/fa6-solid/arrow-right";
	import FasShareNodes from "~icons/fa6-solid/share-nodes";
	import FasHeart from "~icons/fa6-solid/heart";
	import FasBookmark from "~icons/fa6-solid/bookmark";
	import FasCircleCheck from "~icons/fa6-solid/circle-check";

	export var id: string;
	export var name: string;
	export var description: string;
	export var likes: { userId: string }[];
	export var bookmarks: { userId: string }[];
	export var tags: string[];
	export var publishedAt: Date | null;
	export var author: {
		id: string;
		username: string;
		displayName: string;
		avatar: string;
	};
	export var user: { id: string } | null;

	var reportModalOpen: boolean = false;

	const likeForm = {
		submitting: false,
		async submit() {
			likeForm.submitting = true;
			return () => {
				invalidateAll();
				likeForm.submitting = false;
			};
		},
	};

	const bookmarkForm = {
		submitting: false,
		async submit() {
			bookmarkForm.submitting = true;
			return () => {
				invalidateAll();
				bookmarkForm.submitting = false;
			};
		},
	};
</script>

<AccordionItem>
	<div class="grid grid-cols-5 gap-2 w-full" slot="summary">
		<span class="font-semibold">{name}</span>
		<span class="font-normal">{likes.length}</span>
		<div class="flex items-center gap-1 overflow-auto hide-scrollbar mr-4 rounded-full">
			{#each tags as tag}
				<span class="badge variant-filled">{tag}</span>
			{:else}
				<span class="italic text-surface-400">(nincs)</span>
			{/each}
		</div>
		<span class="text-surface-400">{publishedAt?.toLocaleDateString()}</span>
		<div class="flex items-center gap-2">
			<Avatar src={author.avatar} width="w-8" />
			<span>{author.displayName}</span>
		</div>
	</div>
	<div class="card p-4 flex flex-col gap-4 mx-auto" slot="content">
		<div class="grid grid-cols-[5fr_1fr] gap-8">
			<div class="flex flex-col gap-2">
				<header>
					<h2 class="!text-2xl font-semibold">{name}</h2>
					<span class="text-surface-400"
						>Közzétéve: {publishedAt?.toLocaleDateString()} • {likes.length} embernek tetszik</span
					>
				</header>
				<div class="flex items-start h-full justify-between gap-8">
					<p class="px-3 py-1 card h-full grow">
						{description}
					</p>
					<div class="flex gap-1 flex-wrap min-w-[25%] max-w-[25%]">
						{#each tags as tag}
							<span class="badge variant-filled">{tag}</span>
						{:else}
							<div class="w-full h-full flex items-center justify-center italic text-surface-400">
								(nincs hozzáadott címke)
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<h3 class="!text-xl">Készítette:</h3>
				<a
					class="flex flex-col items-center gap-2 p-4 !no-underline !text-white"
					href="/profile/{author.username}"
				>
					<Avatar
						src={author.avatar}
						href="/profile/{author.username}"
						width="w-24"
						class="ring-2"
					/>
					<span class="text-lg">{author.displayName}</span>
				</a>
			</div>
		</div>
		<div class="flex items-center justify-between gap-8">
			<a href="/set/{id}" class="btn variant-filled-primary gap-2 w-48">
				Ugrás <FasArrowRight class="text-sm" />
			</a>
			<div class="flex items-center justify-center gap-2">
				{#if user && author.id !== user.id}
					<form action="/set/{id}?/toggleLike" method="post" use:enhance={likeForm.submit}>
						<button
							class="btn btn-icon {likes.findIndex(like => like.userId === user?.id) != -1
								? 'active'
								: 'inactive'} !bg-rose-400 !ring-rose-400"
							disabled={likeForm.submitting}
						>
							<FasHeart />
						</button>
					</form>
					<form action="/set/{id}?/toggleBookmark" method="post" use:enhance={bookmarkForm.submit}>
						<button class="btn btn-icon {bookmarks.findIndex(bookmark => bookmark.userId === user?.id) != -1
							? 'active'
							: 'inactive'} !bg-blue-600 !ring-blue-600" disabled={bookmarkForm.submitting}>
							<FasBookmark />
						</button>
					</form>
				{/if}
				<!-- <button class="btn btn-icon variant-filled !bg-blue-600 !text-white"><FasBookmark/></button> -->
				<button
					class="btn btn-icon active !bg-emerald-500 !ring-emerald-500"
					on:click={() => navigator.clipboard.writeText(`${$page.url.origin}/set/${id}?share`)}
					use:popup={{ event: "click", target: `copiedMessage-${id}`, placement: "top" }}
				>
					<FasShareNodes />
				</button>
				<div class="card variant-filled-surface py-2 px-3" data-popup="copiedMessage-{id}">
					<div class="flex items-center gap-2 font-semibold text-sm">
						<FasCircleCheck
							class="text-success-600 bg-[radial-gradient(circle,rgba(255,255,255,1)50%,rgba(255,255,255,0)50%);]"
						/>
						Vágólapra másolva!
					</div>
					<div class="arrow variant-filled-surface" />
				</div>
				{#if user && author.id !== user.id}
					<button
						class="btn btn-icon active !bg-warning-500 !ring-warning-500"
						on:click={() => (reportModalOpen = true)}
					>
						<FasFlag />
					</button>
				{/if}
			</div>
		</div>
	</div>
</AccordionItem>
{#if reportModalOpen}
	<ReportModal {id} bind:open={reportModalOpen} />
{/if}

<style lang="postcss">
	button.btn.inactive {
		@apply variant-ghost !bg-opacity-20;
	}

	button.btn.active {
		@apply variant-filled-primary;
	}
</style>
