import type { Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.validate();
		if (!session) throw error(401);

		auth.invalidateSession(session.sessionId);
		locals.setSession(null);
		
		throw redirect(302, "/");
	}
};
