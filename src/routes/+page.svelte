<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import FasCompass from "~icons/fa6-solid/compass";
	import FasScrewdriverWrench from "~icons/fa6-solid/screwdriver-wrench";

	let mounted = false;
	onMount(() => (mounted = true));
</script>

<svelte:head>
	<title>Quizard - A kulcs a teljes potenciálód kibontakoztatásához</title>
</svelte:head>

<div class="-translate-x-4 -translate-y-4 w-[calc(100%+2rem)] flex flex-col gap-32">
	<div class="gradient-bg w-full">
		<div class="flex flex-col items-center max-w-6xl px-8 mx-auto mt-24 sm:!mt-48 gap-8">
			{#if mounted}
				<img
					src="/logo.svg"
					alt="Quizard logo"
					class="w-48 sm:!w-64 md:!w-96 object-contain"
					in:fly={{ x: -100, duration: 500 }}
				/>
				<p
					class="sm:!text-4xl md:!text-5xl font-bold text-center"
					in:fly={{ x: 100, duration: 500, delay: 50 }}
				>
					A kulcs a teljes potenciálod kibontakoztatásához.
				</p>
			{/if}
		</div>
	</div>
	{#if mounted}
		<section
			class="flex items-center justify-center gap-16 2xl:landscape:!gap-96 flex-wrap bg-black bg-opacity-20 p-16"
			in:fade={{ duration: 250 }}
		>
			<div class="w-96 flex flex-col gap-4 text-center md:!text-left">
				<h2 class="font-semibold">Tanulj és Taníts</h2>
				<p class="!text-lg">
					Böngéssz a mások által alkotott tananyagok között, vagy jelentkezz be és tégy közzé
					sajátot, hogy megoszd a tudásod a világgal.
				</p>
			</div>
			<div class="text-xs sm:!text-base">
				<ul class="mx-auto list-nav border-y border-surface-600 py-4">
					<li>
						<a href="/browse">
							<div class="badge-icon w-8 h-8 variant-soft-primary">
								<FasCompass />
							</div>
							<div class="flex flex-col">
								<span class="font-semibold">Felfedezés</span>
								<span class="text-surface-400"
									>Böngéssz és keresd meg a neked megfelelő tananyagot!</span
								>
							</div>
						</a>
					</li>
					<li>
						<a href="/create?redirectToLoginIfUnauthorized" class="flex items-center justify-start">
							<div class="badge-icon w-8 h-8 variant-soft-primary">
								<FasScrewdriverWrench />
							</div>
							<div class="flex flex-col">
								<span class="font-semibold">Alkotás</span>
								<span class="text-surface-400">Tégy közzé saját tananyagot!</span>
							</div>
						</a>
					</li>
				</ul>
			</div>
		</section>
	{/if}
</div>

<style lang="postcss">
	.gradient-bg {
		background-image: radial-gradient(
				at 0% 0%,
				rgba(var(--color-primary-500) / 0.33) 0px,
				transparent 50%
			),
			radial-gradient(at 98% 1%, rgba(var(--color-tertiary-500) / 0.33) 0px, transparent 50%);
	}
</style>
