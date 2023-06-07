import { error, fail } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";

export async function load({ locals, params }) {
    const session = await locals.auth.validate();

    const learningSet = await db.learningSet.findUnique({
        where: {
            id: params.setId
        },
        include: {
            cards: true
        }
    });

    if (!learningSet) throw error(404);
    if (learningSet.publishedAt == null || (learningSet.visibility === "UNPUBLISHED" && learningSet.authorId !== session?.userId)) throw error(403);

    return { learningSet, userId: session?.userId };
}

const reportSchema = z.object({
    inapropriate: z.preprocess(value => value === "on", z.boolean()).optional().default(false).catch(false),
    copyright: z.preprocess(value => value === "on", z.boolean()).optional().default(false).catch(false),
    spam: z.preprocess(value => value === "on", z.boolean()).optional().default(false).catch(false),
    misleading: z.preprocess(value => value === "on", z.boolean()).optional().default(false).catch(false),
    privacy: z.preprocess(value => value === "on", z.boolean()).optional().default(false).catch(false),
    customReason: z.string().trim().min(10, "Az egyéb ok leírása túl rövid!").max(500).optional().catch(undefined)
}).refine(fields => Object.values(fields).some(Boolean), { path: ["general"], message: "Legalább egy okot jelölj meg!" });

export const actions = {
    async toggleLike({ locals, params }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);
        if (learningSet.authorId === session.userId) throw error(403);

        const like = await db.userLikeOnLearningSet.findUnique({
            where: {
                userId_learningSetId: {
                    learningSetId: learningSet.id,
                    userId: session.userId
                }
            }
        });

        if (!like) await db.userLikeOnLearningSet.create({
            data: {
                userId: session.userId,
                learningSetId: learningSet.id
            }
        });
        else await db.userLikeOnLearningSet.delete({
            where: {
                userId_learningSetId: {
                    learningSetId: like.learningSetId,
                    userId: like.userId
                }
            }
        });
    },
    async toggleBookmark({ locals, params }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });

        if (!learningSet) throw error(404);
        if (learningSet.authorId === session.userId) throw error(403);

        const bookmark = await db.userBookmarkOnLearningSet.findUnique({
            where: {
                userId_learningSetId: {
                    learningSetId: learningSet.id,
                    userId: session.userId
                }
            }
        });

        if (!bookmark) await db.userBookmarkOnLearningSet.create({
            data: {
                userId: session.userId,
                learningSetId: learningSet.id
            }
        });
        else await db.userBookmarkOnLearningSet.delete({
            where: {
                userId_learningSetId: {
                    learningSetId: bookmark.learningSetId,
                    userId: bookmark.userId
                }
            }
        });
    },
    async report({ locals, params, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const learningSet = await db.learningSet.findUnique({
            where: {
                id: params.setId
            }
        });
        if (!learningSet) throw error(404);

        if (learningSet.authorId === session.userId) throw error(403);

        const result = reportSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { inapropriate, misleading, privacy, spam, copyright, customReason } = result.data;

        await db.userReportOnLearningSet.upsert({
            create: {
                copyright,
                inapropriate,
                misleading,
                privacy,
                spam,
                customReason,
                learningSetId: learningSet.id,
                reporterId: session.userId
            },
            where: {
                learningSetId_reporterId: {
                    learningSetId: learningSet.id,
                    reporterId: session.userId
                }
            },
            update: {
                copyright,
                inapropriate,
                misleading,
                privacy,
                spam,
                customReason
            }
        });
    }
};