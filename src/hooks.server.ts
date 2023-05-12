import { sequence } from "@sveltejs/kit/hooks";
import auth from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

const authenticate: Handle = async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event);
    return await resolve(event);
}

const log: Handle = async ({ event, resolve }) => {
    const start = Date.now();
    const response = await resolve(event);
    const end = Date.now();
    console.info(`<${new Date(end).toLocaleString()}> ${event.request.method} ${new URL(event.request.url).pathname} -> ${response.status} ${response.ok ? "OK" : "ERROR"} (${end - start}ms)`);
    return response;
}

export const handle = sequence(authenticate, log);
