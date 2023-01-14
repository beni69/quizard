import prisma from "$lib/server/db";
import { decode } from "$lib/server/jwt";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get("token");
	if (!token) return { user: null };

	const id = decode(token);
	if (!id) return { user: null };

	const user = await prisma.user.findUnique({ where: { id } });
	return { user };
};
