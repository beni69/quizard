import { compare } from "$lib/server/crypto";
import prisma from "$lib/server/db";
import { EXPIRY, sign } from "$lib/server/jwt";
import { fail, redirect } from "@sveltejs/kit";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const login = schema.safeParse(Object.fromEntries(await request.formData()));
		if (!login.success) return fail(400, { formError: login.error.flatten().fieldErrors });
		const { email, password } = login.data;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await compare(password, user.password, Buffer.from(user.salt, "base64"))))
			return fail(400, { error: "Invalid email or password" });

		cookies.set("token", sign({ id: user.id }), {
			path: "/",
			maxAge: EXPIRY,
			secure: true,
			sameSite: "lax",
		});

		throw redirect(302, "/profile");
	},
};

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user) throw redirect(302, "/profile");
};
