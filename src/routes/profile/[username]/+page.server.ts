import db from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import Pagination from "$lib/server/pagintation.js";
import z from "zod";

const pagination = new Pagination(10);

const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0))
});

export async function load({ locals, params, url }) {
    const user = await db.authUser.findUnique({
        where: {
            username: params.username
        },
        select: {
            username: true,
            displayName: true,
            createdSets: {
                where: {
                    visibility: "PUBLIC"
                },
                orderBy: {
                    publishedAt: "desc"
                }
            },
            createdAt: true,
            avatar: true
        }
    });

    if (!user) throw error(404);

    const { session, user: currentUser } = await locals.auth.validateUser();
    if (session && currentUser.username === user.username) throw redirect(302, "/profile");

    const { page } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries()));
    console.log(page, url.searchParams.entries())
    const queryResult = await pagination.safeQuery(user.createdSets, page);

    return { user, ...queryResult };
}