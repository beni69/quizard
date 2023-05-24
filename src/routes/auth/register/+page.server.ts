import { error, fail, redirect } from "@sveltejs/kit";
import z from "zod";
import auth from "$lib/server/auth";
import db from "$lib/server/db";
import { superValidate, setError } from "sveltekit-superforms/server";

const registrationSchema = z.object({
	email: z.string().min(1, "Az e-mail cím kitöltése szükséges!").email("Érvénytelen e-mail cím!"),
	username: z.string().min(3, "A felhasználónév legalább 3 karakter hosszú kell legyen!").max(24, "A felhasználónév legfeljebb 24 karakter hosszú lehet!").regex(/^\w+$/, "A felhasználónév csak alfanumerikus karaktereket tartalmazhat!"),
	password: z.string().min(8, "A jelszó legalább 8 karakter hosszú kell legyen!"),
	confirmPassword: z.string()
}).refine(({ password, confirmPassword }) => password === confirmPassword, { message: "A jelszavak nem egyeznek!", path: ["confirmPassword"] });

export async function load({ locals }) {
	const session = await locals.auth.validate();
	if (session) throw error(403);

	const form = await superValidate(registrationSchema);
	return { form };
};

export const actions = {
	async default({ request, locals }) {
		const session = await locals.auth.validate();
		if (session) throw error(403);

		const form = await superValidate(request, registrationSchema);
		if (!form.valid) return fail(400, { form });

		const { email, username, password } = form.data;

		// check if user already exists

		const emailTaken = await db.authUser.findUnique({ where: { email } }) != null;
		if (emailTaken) return setError(form, "email", "Az e-mail cím már foglalt!");

		const nameTaken = await db.authUser.findUnique({ where: { username } }) != null;
		if (nameTaken) return setError(form, "username", "A felhasználónév már foglalt!");

		await auth.createUser({
			primaryKey: {
				password,
				providerId: "email",
				providerUserId: email
			},
			attributes: {
				email,
				username,
				displayName: username,
				avatar: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}`,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});

		throw redirect(302, "/auth/login");
	}
};
