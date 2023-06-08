<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
	import { getContext } from "svelte";
	import FasAngleRight from "~icons/fa6-solid/angle-right";
	import FasStar from "~icons/fa6-solid/star";

	export var id: string;
	export var name: string;
	export var likes: { length: number };
	export var tags: string[];
	export var publishedAt: Date | null;
	export var author: { avatar: string; displayName: string };
	export var href: string | undefined = undefined;
	export var isFeatured: boolean;

	const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});

	const isChildOfAccordion = getContext<string | null>("caretClosed") != null;
</script>

{#if isChildOfAccordion}
	<div class="grid grid-cols-5 gap-2 w-full">
		<span class="flex items-center font-semibold gap-2">
			{#if isFeatured}
				<FasStar class="text-sm text-amber-400"/>
			{/if}
			{name}
		</span>
		<span class="flex items-center font-normal">{likes.length}</span>
		<div class="flex items-center gap-1 overflow-auto hide-scrollbar mr-4 rounded-full">
			{#each tags as tag}
				<span class="badge variant-filled">#{tag}</span>
			{:else}
				<span class="italic text-surface-400">(nincs)</span>
			{/each}
		</div>
		<span class="flex items-center text-surface-400">
			{#if publishedAt}
				{dateFormatter.format(publishedAt)}
			{:else}
				<span class="italic">(nincs)</span>
			{/if}
		</span>
		<div class="flex items-center gap-2">
			<Avatar src={author.avatar} width="w-8" />
			<span>{author.displayName}</span>
		</div>
	</div>
{:else}
	<a
		class="flex items-center w-full px-4 py-2 pr-7 !text-white !no-underline hover:bg-opacity-10 hover:bg-primary-500 rounded-lg"
		href={href ?? `/set/${id}`}
	>
		<div class="grid grid-cols-5 gap-2 w-full">
			<span class="flex items-center font-semibold gap-2">
				{#if isFeatured}
					<FasStar class="text-sm text-amber-400"/>
				{/if}
				{name}
			</span>
			<span class="flex items-center font-normal">{likes.length}</span>
			<div class="flex items-center gap-1 overflow-auto hide-scrollbar mr-4 rounded-full">
				{#each tags as tag}
					<span class="badge variant-filled">#{tag}</span>
				{:else}
					<span class="italic text-surface-400">(nincs)</span>
				{/each}
			</div>
			<span class="flex items-center text-surface-400">
				{#if publishedAt}
					{dateFormatter.format(publishedAt)}
				{:else}
					<span class="italic">(nincs)</span>
				{/if}
			</span>
			<div class="flex items-center gap-2">
				<Avatar src={author.avatar} width="w-8" />
				<span>{author.displayName}</span>
			</div>
		</div>
		<FasAngleRight class="text-xs justify-self-end" />
	</a>
{/if}
