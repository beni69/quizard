import {sequence} from "@sveltejs/kit/hooks";
import { prepareStylesSSR } from '@svelteuidev/core';
import {handleHooks} from "@lucia-auth/sveltekit";
import auth from "$lib/server/auth";

export const handle = sequence(prepareStylesSSR, handleHooks(auth), async ({event, resolve}) =>{
    const start = Date.now();
    const response = await resolve(event);
    const end = Date.now();
    console.info(`<${new Date(end).toLocaleString()}> ${event.request.method} ${new URL(event.request.url).pathname} -> ${response.status} ${response.ok ? "OK" : "ERROR"} (${end - start}ms)`);
    return response;
});
