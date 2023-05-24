import db from "$lib/server/db";
import { error } from "@sveltejs/kit";
import Pagination from "$lib/server/pagintation";
import z from "zod";

const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0))
});

const pagination = new Pagination(20);

export async function load({ locals, url }) {
    const { session, user } = await locals.auth.validateUser();
    if (!session) throw error(401);

    const { page } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries()));

    const [totalCount, { currentPage, pageCount, matchCount, matchedRecords }] = await Promise.all([
        db.userBookmarkOnLearningSet.count({
            where: {
                userId: session.userId
            }
        }),
        pagination.safeQuery(db.userBookmarkOnLearningSet.findMany({
            where: {
                userId: session.userId,
                learningSet: {
                    OR: [
                        {
                            visibility: "PUBLIC"
                        },
                        {
                            visibility: "UNLISTED"
                        }
                    ]
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                learningSet: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                avatar: true
                            }
                        },
                        likes: {
                            select: {
                                userId: true
                            }
                        },
                        bookmarks: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        }), page)
    ]);

    return {
        user,
        currentPage,
        pageCount,
        totalCount,
        matches: {
            matchCount,
            matchedRecords: matchedRecords.map(({ learningSet }) => learningSet)
        }
    };
}