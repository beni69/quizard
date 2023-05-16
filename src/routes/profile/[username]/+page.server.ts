import db from "$lib/server/db";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
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
                }
            },
            createdAt: true,
            avatar: true
        }
    });

    if (!user) throw error(404);

    return { user }
}