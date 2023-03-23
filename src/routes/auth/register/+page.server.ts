import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import z from "zod";
import auth from "$lib/server/auth";
import db from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
	if (session) throw redirect(302, "/profile");
};

const schema = z.object({
	email: z.string({ required_error: "Email address is required!", invalid_type_error: "Invalid email address!" }).min(1, "Email address is required!").email("Invalid email address!"),
	name: z.string().min(3, "Name must be at least 3 characters long!"),
	password: z.string().min(8, "Password must be at least 8 characters long!"),
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.validate();
		if (session) throw error(401);

		const result = schema.safeParse(Object.fromEntries(await request.formData()));
		if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

		const { email, name, password } = result.data;

		// check if user already exists

		const emailTaken = await db.user.findUnique({ where: { email } }) != null;
		if (emailTaken) return fail<FieldErrors<z.infer<typeof schema>>>(400, { errors: { email: ["Email is already in use!"] } });

		const nameTaken = await db.user.findUnique({ where: { name } }) != null;
		if (nameTaken) return fail<FieldErrors<z.infer<typeof schema>>>(400, { errors: { name: ["Username is already taken!"] } });

		await auth.createUser({
			primaryKey: {
				password,
				providerId: "email",
				providerUserId: email
			},
			attributes: {
				email,
				name,
				avatar: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${name}`,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
	}
};
