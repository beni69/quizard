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
	email: z.string().min(1, "Az e-mail cím kitöltése szükséges!").email("Érvénytelen e-mail cím!"),
	password: z.string().min(8, "A jelszó legalább 8 karakter hosszú kell legyen!"),
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
			return fail<FieldErrors<z.infer<typeof schema>>>(400, { errors: { email: ["Téves e-mail cím vagy jelszó."] } });
		}
	}
};
