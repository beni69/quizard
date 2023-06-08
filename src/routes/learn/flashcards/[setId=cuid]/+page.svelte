<script lang="ts">
	import { quiz, type QuizItem, type QuizResult } from "$lib/algo";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import { ProgressBar } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import FaCheck from "~icons/fa6-solid/check";
	import FaX from "~icons/fa6-solid/x";

	export var data: PageData;

	const gen = quiz(data.learningSet.cards);
	let done: boolean,
		value: QuizItem,
		res: QuizResult,
		flipped = false,
		pbar: string | undefined;

	const next = () => {
			flipped = false;
			setTimeout(
				() =>
					requestAnimationFrame(() => {
						let g = gen.next();
						done = g.done ?? false;
						if (!done) value = g.value as QuizItem;
						else {
							res = g.value as QuizResult;
							pbar = "bg-green-500";
						}
					}),
				// switch halfway through the card flip animation,
				// otherwise reveals the next solution
				(0.25 * 1000) / 2
			);
		},
		succ = () => {
			(value as QuizItem)!.fn(true);
			next();
		},
		fail = () => {
			(value as QuizItem)!.fn(false);
			next();
		},
		flip = () => {
			flipped = !flipped;
		};

	onMount(next);
</script>

<svelte:head>
	<title>Tanulókártyák - Quizzard</title>
</svelte:head>

<PageContentContainer class="h-full w-full">
	<ProgressBar meter={pbar} value={value?.progress * 100 ?? 0} min={0} max={100} />
	<header>
		<PageHeading>{data.learningSet.name}</PageHeading>
		<a href="/set/{data.learningSet.id}">Vissza</a>
	</header>

	<section class="flex h-full w-full items-center justify-evenly flex-col">
		{#if !done && value}
			<div id="flashcard" class={flipped ? "flipped" : ""}>
				<div id="flashcard-inner">
					<button
						id="flashcard-front"
						on:click={flip}
						class="card border border-primary-500 p-4 w-36"
					>
						{value.card.term}
					</button>
					<button
						id="flashcard-back"
						on:click={flip}
						class="card border border-primary-500 p-4 w-36"
					>
						{value.card.definition}
					</button>
				</div>
			</div>
			<div class="flex w-full justify-evenly">
				<button on:click={fail} class="btn variant-filled-error">
					<FaX />
				</button>
				<button on:click={succ} class="btn variant-filled-success">
					<FaCheck />
				</button>
			</div>
		{:else if res}
			<div class="p-8 border border-primary-600 rounded-lg">
				<h2>Gratulálunk!</h2>
				<div class="my-4 w-full flex justify-evenly">
					<p><FaCheck class="inline text-success-500" /> {res.succ}</p>
					<p><FaX class="inline text-error-500" /> {res.fail}</p>
				</div>
				<div class="w-full flex justify-evenly">
					<button on:click={() => window.location.reload()} class="btn variant-filled">Újra</button>
					<a href="/set/{data.learningSet.id}" class="btn variant-ringed">Vissza</a>
				</div>
			</div>
		{/if}
	</section>
</PageContentContainer>

<style>
	#flashcard {
		perspective: 1000px;
	}
	#flashcard-inner {
		transition: transform 0.25s ease-in-out;
		transform-origin: 50% 50%;
		transform-style: preserve-3d;
		position: relative;
	}
	#flashcard-front,
	#flashcard-back {
		backface-visibility: hidden;

		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);

		display: flex;
		justify-content: center;
		align-items: center;
	}
	#flashcard-back {
		transform: translate(-50%, -50%) rotateY(180deg);
	}
	#flashcard.flipped > #flashcard-inner {
		transform: translate(-50%, -50%) rotateY(180deg);
	}
</style>
