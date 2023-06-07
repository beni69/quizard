import { error, fail } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";

export async function load({ locals, params }) {
    const session = await locals.auth.validate();
    if (!session) throw error(401);

    const learningSet = await db.learningSet.findFirst({
        where: {
            id: params.setId,
            authorId: session.userId
        },
        include: {
            cards: true
        }
    });

    if (!learningSet) throw error(404);

    return {
        cards: learningSet.cards
    };
}

const createCardSchema = z.object({
    term: z.string().min(1).max(50, "A fogalom maximum 50 karakter lehet!"),
    definition: z.string().min(1).max(1000, "A definíció maximum 1000 karakter lehet!")
});

const publishSchema = z.object({
    visibility: z.enum(["public", "unlisted"]).transform(value=>value.toUpperCase() as "PUBLIC" | "UNLISTED")
});

export const actions = {
    async createCard({ locals, params, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findFirst({
            where: {
                id: params.setId,
                authorId: session.userId
            }
        });

        if (!learningSet) throw error(404);

        const result = createCardSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { term, definition } = result.data;

        await db.card.create({
            data: {
                term,
                definition,
                learningSet: {
                    connect: {
                        id: learningSet.id
                    }
                }
            }
        });
    },
    async delete({locals, params}) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);

        await db.learningSet.delete({
            where: {
                id: learningSet.id
            }
        });
    },
    async publish({locals, params, request}) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if(!learningSet) throw error(404);
        if(learningSet.visibility != "UNPUBLISHED") throw error(403);
        
        const result = publishSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { visibility } = result.data;

        await db.learningSet.update({
            where: {
                id: learningSet.id
            },
            data: {
                publishedAt: new Date(),
                visibility
            }
        });
    
    }
}