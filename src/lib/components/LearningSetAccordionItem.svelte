<script lang="ts">
	import { AccordionItem, Avatar, popup } from "@skeletonlabs/skeleton";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import ReportLearningSetModal from "./ReportLearningSetModal.svelte";
	import FasFlag from "~icons/fa6-solid/flag";
	import FasArrowRight from "~icons/fa6-solid/arrow-right";
	import FasShareNodes from "~icons/fa6-solid/share-nodes";
	import FasHeart from "~icons/fa6-solid/heart";
	import FasBookmark from "~icons/fa6-solid/bookmark";
	import FasCircleCheck from "~icons/fa6-solid/circle-check";
	import LearningSetAccordionItemSummary from "./LearningSetAccordionItemSummary.svelte";

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
	export var features: any[] = [];

	const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	var reportModalOpen: boolean = false;

	$: indexInLikes = likes.findIndex((like) => like.userId === user?.id);
	const likeForm = {
		submitting: false,
		async submit() {
			likeForm.submitting = true;
			return () => {
				// after receiving the response from the form submission, we toggle the liked state on the client based on what it was previously
				// this way we don't have to do invalidateAll() and refetch the whole page
				if (indexInLikes === -1) likes = [...likes, { userId: user?.id ?? "" }];
				else likes = [...likes.slice(0, indexInLikes), ...likes.slice(indexInLikes + 1)];
				likeForm.submitting = false;
			};
		},
	};

	$: indexInBookmarks = bookmarks.findIndex((bookmark) => bookmark.userId === user?.id);
	const bookmarkForm = {
		submitting: false,
		async submit() {
			bookmarkForm.submitting = true;
			return () => {
				// after receiving the response from the form submission, we toggle the bookmarked state on the client based on what it was previously
				// this way we don't have to do invalidateAll() and refetch the whole page
				if (indexInBookmarks === -1) bookmarks = [...bookmarks, { userId: user?.id ?? "" }];
				else
					bookmarks = [
						...bookmarks.slice(0, indexInBookmarks),
						...bookmarks.slice(indexInBookmarks + 1),
					];
				bookmarkForm.submitting = false;
			};
		},
	};

	function searchForTag(tag: string) {
		const url = $page.url;
		url.searchParams.set("query", `#${tag}`);
		return `${url.pathname}${url.search}`;
	}
</script>

<AccordionItem>
	<LearningSetAccordionItemSummary {id} {author} {likes} {name} {publishedAt} {tags} isFeatured={features.length > 0} slot="summary"/>
	<div class="card p-4 flex flex-col gap-4 mx-auto" slot="content">
		<div class="grid grid-cols-[5fr_1fr] gap-8">
			<div class="flex flex-col gap-2">
				<header class="flex flex-col gap-1">
					<h2 class="!text-2xl font-semibold">{name}</h2>
					<span class="text-surface-400"
						>Közzétéve: {dateFormatter.format(publishedAt ?? 0)} • {likes.length} embernek tetszik</span
					>
				</header>
				<div class="flex items-start h-full justify-between gap-8">
					<p class="px-3 py-1 card h-full grow variant-ghost">
						{#if description}
							{description}
						{:else}
							<span class="italic text-surface-400">(nincs megadott leírás)</span>
						{/if}
					</p>
					<div class="flex gap-1 flex-wrap min-w-[25%] max-w-[25%]">
						{#each tags as tag}
							<a class="badge variant-filled !text-black !no-underline" href={searchForTag(tag)}>#{tag}</a>
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
					<span class="text-lg text-center">{author.displayName}</span>
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
							class="btn btn-icon {indexInLikes === -1
								? 'variant-ghost !bg-opacity-20'
								: ''} !bg-rose-400 !ring-rose-400"
							disabled={likeForm.submitting}
						>
							<FasHeart />
						</button>
					</form>
					<form action="/set/{id}?/toggleBookmark" method="post" use:enhance={bookmarkForm.submit}>
						<button
							class="btn btn-icon {indexInBookmarks === -1
								? 'variant-ghost !bg-opacity-20'
								: ''} !bg-blue-600 !ring-blue-600"
							disabled={bookmarkForm.submitting}
						>
							<FasBookmark />
						</button>
					</form>
				{/if}
				<!-- <button class="btn btn-icon variant-filled !bg-blue-600 !text-white"><FasBookmark/></button> -->
				<button
					class="btn btn-icon !bg-emerald-500 !ring-emerald-500"
					on:click={() => navigator.clipboard.writeText(`${$page.url.origin}/set/${id}?share`)}
					use:popup={{ event: "click", target: `copiedMessage-${id}`, placement: "top" }}
				>
					<FasShareNodes />
				</button>
				<div class="card variant-filled-surface py-2 px-3" data-popup="copiedMessage-{id}">
					<div class="flex items-center gap-2 font-semibold text-sm">
						<FasCircleCheck
							class="text-success-600 bg-[radial-gradient(circle,rgba(255,255,255,1)50%,rgba(255,255,255,0)50%)]"
						/>
						Vágólapra másolva!
					</div>
					<div class="arrow variant-filled-surface" />
				</div>
				{#if user && author.id !== user.id}
					<button
						class="btn btn-icon !bg-warning-500 !ring-warning-500"
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
	<ReportLearningSetModal {id} bind:open={reportModalOpen} />
{/if}
