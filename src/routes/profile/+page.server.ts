import db from "$lib/server/db";
import { error, fail } from "@sveltejs/kit";
import z from "zod";

export async function load({ locals }) {
    const { session, user } = await locals.auth.validateUser();
    if (!session) throw error(401);

    return {
        user,
        publishedSetCount: db.learningSet.count({
            where: {
                authorId: session.userId,
                visibility: "PUBLIC"
            }
        }),
        receivedLikeCount: db.userLikeOnLearningSet.count({
            where: {
                learningSet: {
                    authorId: session.userId
                }
            }
        })
    };
}

const updateDisplayNameSchema = z.object({
    displayName: z.string().trim().min(1, "A megjelenítendő nevet meg kell adni!").max(24, "A megjelenítendő név maximum 24 karakter lehet!")
});

export const actions = {
    async updateDisplayName({ locals, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const result = updateDisplayNameSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { displayName } = result.data;

        await db.authUser.update({
            where: { id: session.userId },
            data: { displayName }
        });
    }
};
