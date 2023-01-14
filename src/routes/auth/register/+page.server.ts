import { genSalt, hash } from "$lib/server/crypto";
import prisma from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

const schema = z.object({
	email: z.string().email(),
	name: z.string().min(3),
	password: z.string().min(8),
});

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const user = schema.safeParse(Object.fromEntries(await request.formData()));
		if (!user.success) return fail(400, { formError: user.error.flatten().fieldErrors });

		const { email, name, password: _passwd } = user.data;
		const salt = genSalt();
		const password = await hash(_passwd, salt);

		// check if user already exists
		const emailTaken = !!(await prisma.user.findUnique({ where: { email } }));
		if (emailTaken) return fail(400, { taken: "email" } as const);

		const nameTaken = !!(await prisma.user.findUnique({ where: { name } }));
		if (nameTaken) return fail(400, { taken: "name" } as const);

		return prisma.user
			.create({
				data: {
					email,
					name,
					password,
					salt: salt.toString("base64"),
					avatar: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${name}`,
				},
			})
			.then(() => undefined)
			.catch((e) => {
				console.error(e);
				return fail(500, { error: "Something went wrong" });
			});
	},
};

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user) throw redirect(302, "/profile");
};
