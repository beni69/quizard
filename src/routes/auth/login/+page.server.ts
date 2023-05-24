import { fail, redirect, error } from "@sveltejs/kit";
import auth from "$lib/server/auth";
import z from "zod";
import { superValidate, message } from "sveltekit-superforms/server";

const loginSchema = z.object({
	email: z.string().min(1, "Az e-mail cím kitöltése szükséges!").email("Érvénytelen e-mail cím!"),
	password: z.string().min(8, "A jelszó legalább 8 karakter hosszú kell legyen!"),
});

export async function load({locals}) {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/profile");

	const form = await superValidate(loginSchema);
	return { form };
}

export const actions = {
	async default({ request, locals }) {
		const session = await locals.auth.validate();
		if (session) throw error(401);

		const form = await superValidate(request, loginSchema);
		if (!form.valid) return fail(400, { form });

		const { email, password } = form.data;

		try {
			const key = await auth.useKey("email", email, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch (error) {
			return message(form, "Téves e-mail cím vagy jelszó!", { status: 400 });
		}

		return { form };
	}
};
