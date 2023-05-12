import { error, redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";

export const actions = {
	async default ({ locals }) {
		const session = await locals.auth.validate();
		if (!session) throw error(401);

		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
		
		throw redirect(302, "/");
	}
};
