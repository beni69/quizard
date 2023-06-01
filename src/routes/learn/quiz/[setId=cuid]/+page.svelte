<script lang="ts">
	import { quiz, shuffle, type QuizItem, type QuizResult } from "$lib/algo";
	import PageContentContainer from "$lib/components/PageContentContainer.svelte";
	import PageHeading from "$lib/components/PageHeading.svelte";
	import { ProgressBar } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import FaCheck from "~icons/fa6-solid/check";
	import FaX from "~icons/fa6-solid/x";

	export var data: PageData;

	interface Btn {
		str: string;
		correct: boolean;
	}

	const gen = quiz(data.learningSet.cards);
	let done: boolean,
		reveal: boolean | null = null,
		value: QuizItem,
		res: QuizResult,
		pbar: string | undefined,
		answers: Btn[] = Array(4).fill({ str: "", cls: "", correct: false });

	const next = () =>
			// do not render next frame before all of this completes
			requestAnimationFrame(() => {
				if (reveal !== null && value) {
					console.log("HERE");
					value.fn(reveal);
				}
				let g = gen.next();
				reveal = null;
				done = g.done ?? false;
				if (!done) {
					value = g.value as QuizItem;
					answers = shuffle(
						data.learningSet.cards
							.map((c) => ({ str: c.definition, correct: false } as Btn))
							.filter((b) => b.str !== value.card.definition)
					).slice(0, 4);
					answers[Math.floor(Math.random() * 4)] = {
						str: value.card.definition,
						correct: true,
					};
				} else {
					res = g.value as QuizResult;
					pbar = "bg-green-500";
				}
				console.info(answers);
			}),
		click = (b: Btn) => {
			if (reveal !== null) return;
			reveal = b.correct;
		};
	onMount(next);
</script>

<svelte:head>
	<title>Kvíz - Quizzard</title>
</svelte:head>

<PageContentContainer class="h-full w-full">
	<ProgressBar meter={pbar} value={value?.progress * 100 ?? 0} min={0} max={100} />
	<header>
		<PageHeading>{data.learningSet.name}</PageHeading>
		<a href="/set/{data.learningSet.id}">Vissza</a>
	</header>

	<section class="flex h-full w-full items-center justify-evenly flex-col">
		{#if !done && value}
			<h3>{value.card.term}</h3>
			<div class="flex flex-col items-center gap-2 min-w-max">
				{#each answers as b}
					<button
						on:click={() => click(b)}
						class={`btn w-full variant-${
							reveal !== null ? (b.correct ? "filled-success" : "filled-error") : "filled-primary"
						}`}
					>
						{b.str}
					</button>
				{/each}
				{#if reveal !== null}
					<button on:click={next} class="btn variant-filled-primary w-full">Következő</button>
				{/if}
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
