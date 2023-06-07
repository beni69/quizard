import db from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import Pagination from "$lib/server/pagintation.js";
import z from "zod";

const pagination = new Pagination(5);

const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0))
});

export async function load({ locals, params, url }) {
    const profileUser = await db.authUser.findUnique({
        where: {
            username: params.username
        },
        select: {
            username: true,
            displayName: true,
            createdSets: {
                where: {
                    visibility: "PUBLIC",
                    publishedAt: {
                        not: null
                    }
                },
                orderBy: {
                    publishedAt: "desc"
                },
                include: {
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
            },
            id: true,
            createdAt: true,
            avatar: true
        }
    });

    if (!profileUser) throw error(404);
    const { createdSets, ...clientUserData } = profileUser;

    const { session, user } = await locals.auth.validateUser();
    if (session && user.username === profileUser.username) throw redirect(302, "/profile");

    const { page } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries()));

    return {
        user,
        profileUser: clientUserData, 
        createdSets: pagination.safeQuery(createdSets, page),
        publishedSetCount: db.learningSet.count({
            where: {
                author: {
                    username: profileUser.username  
                },
                publishedAt: {
                    not: null
                },
                visibility: "PUBLIC"
            }
        }),
        receivedLikeCount: db.userLikeOnLearningSet.count({
            where: {
                learningSet: {
                    author: {
                       username: profileUser.username 
                    }
                }
            }
        })
    };
}