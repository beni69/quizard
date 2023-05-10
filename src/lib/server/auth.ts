import lucia from "lucia-auth";
import adapterPrisma from "@lucia-auth/adapter-prisma";
import prisma from "$lib/server/db";
import { dev } from "$app/environment";

const auth = lucia({
    adapter: adapterPrisma(prisma),
    env: dev ? "DEV" : "PROD",
    transformUserData: (data)=>({
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    })
});

export default auth;