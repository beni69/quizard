import prisma from "$lib/db";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { sets: prisma.learningSet.findMany() };
}
