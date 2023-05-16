import db from "$lib/server/db";
import z from "zod";

const pageSize = 20;

const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0)),
    sortBy: z.enum(["name", "score", "publishedAt"]).default("publishedAt").catch("publishedAt"),
    sortDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
    query: z.string().max(50).optional().catch(undefined)
});

export async function load({ url }) {
    const { page, sortBy, sortDirection, query } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries())) as { page: number, sortBy: "name" | "score" | "publishedAt", sortDirection: "asc" | "desc", query?: string }; // fsr zod doesn't infer that query is optional

    const [count, records] = await Promise.all([
        db.learningSet.count(),
        db.learningSet.findMany({
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
                }
            }
        })
    ]);

    let currentPage = page;
    if (page * pageSize > count) currentPage = 0

    return {
        currentPage,
        totalCount: count,
        matches: {
            count: records.length,
            records: records.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
        }
    };
}