/// <reference types="unplugin-icons/types/svelte" />

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type UserAttributes = {
			email: string,
			username: string,
			displayName: string,
			avatar: string,
			createdAt: Date,
			updatedAt: Date
		};
	}
}

/// <reference types="@sveltejs/kit" />
declare global {
	namespace App {
		interface Locals {
			auth: import("lucia-auth").AuthRequest;
		}
	}
}

export { };