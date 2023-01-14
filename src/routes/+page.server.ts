import prisma from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
	sets: prisma.learningSet.findMany();
};
