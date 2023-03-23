/// <reference types="unplugin-icons/types/svelte" />

/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import("$lib/server/lucia").Auth;
	type UserAttributes = {
		email: string,
		name: string,
		avatar: string,
		createdAt: Date,
		updatedAt: Date
	};
}

/// <reference types="@sveltejs/kit" />
declare namespace App {
	// interface Error {}
	interface Locals {
		validate: import("@lucia-auth/sveltekit").Validate;
		validateUser: import("@lucia-auth/sveltekit").ValidateUser;
		setSession: import("@lucia-auth/sveltekit").SetSession;
	}
	// interface PageData {}
	// interface Platform {}
}

type FieldErrors<T> = {
	errors: Partial<{
		[K in keyof T]: string[];
	}>
}
