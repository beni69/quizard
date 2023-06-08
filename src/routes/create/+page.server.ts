import { error, fail, redirect } from "@sveltejs/kit";
import db from "$lib/server/db";
import z from "zod";
import Pagination from "$lib/server/pagintation";

const pagination = new Pagination(10);
const searchParamsSchema = z.object({
    page: z.preprocess(Number, z.number().int().nonnegative().default(0).catch(0)),
});

export async function load({ locals, url }) {
    const session = await locals.auth.validate();
    if (!session)
        if (url.searchParams.get("redirectToLoginIfUnauthorized") != null) throw redirect(302, "/auth/login");
        else throw error(401);

    const { page } = searchParamsSchema.parse(Object.fromEntries(url.searchParams.entries()));

    return {
        learningSets: pagination.safeQuery(db.learningSet.findMany({
            where: {
                authorId: session.userId
            },
            include: {
                author: {
                    select: {
                        displayName: true,
                        avatar: true
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                cards: true,
                features: true
            }
        }), page)
    };
}

const createSetSchema = z.object({
    name: z.string().min(4, "A tananyag neve túl rövid!").max(32, "A tananyag neve maximum 32 karakter lehet!"),
    description: z.string().max(500, "A tananyag leírása maximum 500 karakter lehet!")
});

export const actions = {
    async new({ locals, request }) {
        const session = await locals.auth.validate();
        if (!session) throw error(401);

        const result = createSetSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { name, description } = result.data;

        const workingOnCount = await db.learningSet.count({
            where: {
                authorId: session.userId,
                publishedAt: null
            }
        });

        if (workingOnCount >= 5) throw error(403, "Egyszerre legfeljebb 5 tananyagon dolgozhatsz! Továbbiakat csak akkor hozhatsz létre, ha valamelyiket közzéteszed, vagy törlöd.");

        const createdSet = await db.learningSet.create({
            data: {
                name,
                description,
                visibility: "UNPUBLISHED",
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