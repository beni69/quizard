// little helper to protect routes
// if the user is not logged in, redirect to /auth/login
// if the user is logged in, will make the type system sure the user != null
// usage (+page|layout.server.ts):
// export { load } from "$lib/server/protected";

import type { User } from "@prisma/client";
import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load = (async ({ parent }): Promise<{ user: User }> => {
	const { user } = (await parent()) as { user: User | null };
	if (!user) throw redirect(302, "/auth/login");

	return { user };
}) satisfies ServerLoad;
