<script lang="ts">
	import "../app.pcss";

	import { AppShell, AppRail, AppRailTile, Avatar } from "@skeletonlabs/skeleton";
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
	import { storePopup, popup } from "@skeletonlabs/skeleton";
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import FasRightFromBracket from "~icons/fa6-solid/right-from-bracket";
	import FasScrewdriverWrench from "~icons/fa6-solid/screwdriver-wrench";
	import FasCompass from "~icons/fa6-solid/compass";
	import FasUser from "~icons/fa6-solid/user";
	import FasBookmark from "~icons/fa6-solid/bookmark";
	import { writable } from "svelte/store";
	import SignOutButton from "$lib/components/SignOutButton.svelte";
	import AppRailLink from "$lib/components/AppRailLink.svelte";
	import type { PageData } from "./$types";

	export var data: PageData;
</script>

<AppShell>
	<AppRail slot="sidebarLeft">
		<div class="w-full p-1">
			<AppRailTile
				active={writable()}
				tag="a"
				href="/"
				style="background-image: url('/logo.svg');"
				class="bg-center bg-contain bg-no-repeat rounded-2xl hover:bg-secondary-600"
			/>
		</div>

		<AppRailLink href="/browse" tooltip={{ name: "browse", text: "Felfedezés", placement: "right" }}>
			<FasCompass />
		</AppRailLink>

		{#if data.user}
			<AppRailLink
				href="/bookmarked"
				tooltip={{ name: "bookmarked", text: "Mentett", placement: "right" }}
			>
				<FasBookmark />
			</AppRailLink>
			<AppRailLink href="/create" tooltip={{ name: "create", text: "Alkotás", placement: "right" }}>
				<FasScrewdriverWrench />
			</AppRailLink>
		{/if}

		<svelte:fragment slot="trail">
			{#if data.user}
				<div
					class="p-2 flex place-items-center place-content-center"
					use:popup={{ event: "click", target: "avatar", placement: "top" }}
				>
					<Avatar
						class="w-full"
						src={data.user.avatar}
						border="border-4 border-surface-300-600-token hover:!border-primary-500 transition"
						cursor="cursor-pointer"
					/>
					<div class="card variant-filled-surface items-stretch isolate" data-popup="avatar">
						<a
							href="/profile"
							class="btn flex items-center justify-start hover:variant-ghost-secondary rounded-md gap-2"
						>
							<FasUser />Profil
						</a>
						<SignOutButton
							class="btn flex items-center justify-start hover:variant-ghost-error rounded-md gap-2"
						>
							<FasRightFromBracket />Kijelentkezés
						</SignOutButton>
						<div class="arrow variant-filled-surface -z-10" />
					</div>
				</div>
			{:else}
				<AppRailLink
					href="/auth/login"
					tooltip={{ name: "login", text: "Bejelentkezés", placement: "right" }}
				>
					<FasRightToBracket />
				</AppRailLink>
			{/if}
		</svelte:fragment>
	</AppRail>
	<slot />
</AppShell>
