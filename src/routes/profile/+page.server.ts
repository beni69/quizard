import { error } from "@sveltejs/kit";

export async function load({locals}) {
    const {session, user} = await locals.auth.validateUser();
    if (!session) throw error(401);

    return { user };
}
