import { error, fail, redirect } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";

export async function load({ locals, url }) {
    const session = await locals.auth.validate();
    if (!session)
        if (url.searchParams.get("redirectToLoginIfUnauthorized") != null) throw redirect(302, "/auth/login");
        else throw error(401);

    return {
        learningSets: db.learningSet.findMany({
            where: {
                authorId: session.userId
            }
        })
    };
}

const createSetSchema = z.object({
    name: z.string().min(1, "A tananyag nevet meg kell adni!").max(50, "A tananyag neve maximum 50 karakter lehet!"),
    description: z.string().max(1000, "A tananyag leírása maximum 1000 karakter lehet!"),
    visibility: z.enum(["public", "private", "unlisted"]).transform(visibility => visibility.toUpperCase() as "PUBLIC" | "PRIVATE" | "UNLISTED"),
});

export const actions = {
    async new({ locals, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const result = createSetSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { name, description, visibility } = result.data;

        const createdSet = await db.learningSet.create({
            data: {
                name,
                description,
                visibility,
                author: {
                    connect: {
                        id: session.userId
                    }
                }
            }
        });

        throw redirect(302, `/create/${createdSet.id}`);
    }
};