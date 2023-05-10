import { error } from "@sveltejs/kit";
import db from "$lib/server/db";

export async function load({ locals, params }) {
    const session = await locals.validate();

    const learningSet = await db.learningSet.findUnique({
        where: {
            id: params.setId
        },
        include: {
            cards: true
        }
    });

    if (!learningSet) throw error(404);
    if (learningSet.visibility === "PRIVATE" && learningSet.userId !== session?.userId) throw error(403);

    return { learningSet, userId: session?.userId };
}