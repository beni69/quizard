import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";
import z from "zod";
import { error } from "console";

export const load = (async ({ locals }) => {
	const session = await locals.validate();
	if (session) throw redirect(302, "/profile");
}) satisfies PageServerLoad;

const schema = z.object({
	email: z.string().min(1, "Email address is required!").email("Invalid email address!"),
	password: z.string().min(8, "Passwords are at least 8 characters long!"),
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.validate();
		if (session) throw error(401);

		const result = schema.safeParse(Object.fromEntries(await request.formData()));
		if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });
		
		const { email, password } = result.data;
		
		try {
			const key = await auth.useKey("email", email, password);
			const session = await auth.createSession(key.userId);
			locals.setSession(session);
		} catch (error) {
			return fail<FieldErrors<z.infer<typeof schema>>>(400, { errors: { email: ["Invalid email or password!"] } });
		}
	}
};
