import { error, fail, redirect } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";

export async function load({ locals, params }) {
    const session = await locals.auth.validate();
    if (!session) throw error(401);

    const learningSet = await db.learningSet.findFirst({
        where: {
            id: params.setId
        },
        include: {
            cards: true
        }
    });

    if (!learningSet) throw error(404);
    if (learningSet.visibility != "UNPUBLISHED" || learningSet.authorId !== session.userId) throw error(403);

    return {
        learningSet
    };
}

const publishSchema = z.object({
    visibility: z.enum(["public", "unlisted"]).transform(value => value.toUpperCase() as "PUBLIC" | "UNLISTED")
});

const updateSchema = z.object({
    name: z.string().min(4, "A tananyag neve legalább 4 karakter kell legyen!").max(32, "A tananyag neve maximum 32 karakter lehet!").optional(),
    description: z.string().max(500, "A leírás maximum 500 karakter lehet!").optional(),
    cards: z.preprocess(value => JSON.parse(String(value)), z.record(z.string().min(1, "A fogalom megadása kötelező!").max(50, "A fogalom maximum 50 karakter lehet!"), z.string().min(1, "A definíció megadása kötelező!").max(500, "A definíció maximum 500 karakter lehet!")).refine((value) => Object.entries(value).length < 100, "A tananyag legfeljebb 100 kártyából állhat!").optional()),
    tags: z.preprocess(value => JSON.parse(String(value)), z.array(z.string().min(1).max(16, "A címke maximum 16 karakter hosszú lehet!"))).optional()
});

export const actions = {
    async delete({ locals, params }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);
        if(learningSet.authorId !== session.userId) throw error(403);

        await db.learningSet.delete({
            where: {
                id: learningSet.id
            }
        });
    },
    async publish({ locals, params, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            },
            include: {
                cards: true
            }
        });

        if (!learningSet) throw error(404);
        if (learningSet.cards.length < 2) throw error(403);
        if (learningSet.visibility != "UNPUBLISHED" || learningSet.authorId !== session.userId) throw error(403);

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

    },
    async update({ locals, params, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);
        if (learningSet.visibility != "UNPUBLISHED" || learningSet.authorId !== session.userId) throw error(403);

        const result = updateSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { name, description, cards, tags } = result.data;

        // holy shit
        await db.$transaction([
            db.learningSet.update({
                where: {
                    id: learningSet.id
                },
                data: {
                    name,
                    description,
                    tags
                }
            }),
            ...Object.entries(cards ?? {}).map(([term, definition]) => db.card.upsert({
                where: {
                    learningSetId_term: {
                        learningSetId: learningSet.id,
                        term
                    }
                },
                create: {
                    learningSet: {
                        connect: {
                            id: learningSet.id
                        }
                    },
                    term,
                    definition
                },
                update: {
                    term,
                    definition
                }
            })),
            db.card.deleteMany({
                where: {
                    learningSetId: learningSet.id,
                    term: {
                        notIn: Object.keys(cards ?? {})
                    }
                }
            })
        ]);
    },
    async unpublish({ locals, params }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);
        if (learningSet.visibility === "UNPUBLISHED" || learningSet.authorId !== session.userId) throw error(403);

        await db.learningSet.update({
            where: {
                id: learningSet.id
            },
            data: {
                publishedAt: null,
                visibility: "UNPUBLISHED"
            }
        });

        throw redirect(302, `/create/${learningSet.id}`);
    }
}