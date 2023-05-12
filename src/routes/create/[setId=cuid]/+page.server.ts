import { error, fail } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";

export async function load({locals, params}) {
    const session = await locals.auth.validate();
    if (!session) throw error(401);

    const learningSet = await db.learningSet.findFirst({
        where: {
            id: params.setId,
            userId: session.userId
        },
        include: {
            cards: true
        }
    });

    if(!learningSet) throw error(404);

    return {
        cards: learningSet.cards
    };
}

const createCardSchema = z.object({
    term: z.string().min(1).max(50, "A fogalom maximum 50 karakter lehet!"),
    definition: z.string().min(1).max(1000, "A definíció maximum 1000 karakter lehet!")
});

export const actions = {
    async createCard({locals, params, request}) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findFirst({
            where: {
                id: params.setId,
                userId: session.userId
            }
        });

        if(!learningSet) throw error(404);

        const result = createCardSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail<FieldErrors<z.infer<typeof createCardSchema>>>(400, { errors: result.error.flatten().fieldErrors });

        await db.card.create({
            data: {
                term: result.data.term,
                definition: result.data.definition,
                learningSet: {
                    connect: {
                        id: learningSet.id
                    }
                }
            }
        });
    }
}