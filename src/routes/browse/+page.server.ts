import db from "$lib/server/db";
import Pagination from "$lib/server/pagintation.js";
import z from "zod";

const pagination = new Pagination(20);

const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0)),
    sortBy: z.enum(["name", "score", "publishedAt"]).default("publishedAt").catch("publishedAt"),
    sortDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
    query: z.string().max(50).optional().catch(undefined)
});

export async function load({ url }) {
    const { page, sortBy, sortDirection, query } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries())) as { page: number, sortBy: "name" | "score" | "publishedAt", sortDirection: "asc" | "desc", query?: string }; // fsr zod doesn't infer that query is optional

    const [totalCount, {matchedRecords, matchCount, currentPage, pageCount}] = await Promise.all([
        db.learningSet.count(),
        pagination.safeQuery(db.learningSet.findMany({
            where: {
                AND: [
                    {
                        visibility: "PUBLIC"
                    },
                    {
                        OR: [
                            {
                                name: {
                                    contains: query
                                }
                            },
                            {
                                description: {
                                    contains: query
                                }
                            },
                            {
                                tags: query == null ? undefined : {
                                    hasSome: query.split(" ").filter(word => word.startsWith("#")).map(tag => tag.slice(1))
                                }
                            }
                        ]
                    }
                ]
            },
            orderBy: sortBy === "score" ? {
                likes: {
                    _count: sortDirection
                }
            } : {
                [sortBy]: sortDirection
            },
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
                },
                features: true
            }
        }), page)
    ]);
    
    return {
        currentPage,
        pageCount,
        totalCount,
        matches: {
            count: matchCount,
            records: matchedRecords
        },
        featured: db.featureOnLearningSet.findMany({
            include: {
                learningSet: {
                    include: {
                        likes: true,
                        bookmarks: true,
                        author: true,
                        features: true
                    }
                }
            },
            where: {
                learningSet: {
                    visibility: "PUBLIC"
                }
            }
        })
    };
}