import z from "zod";

const cuidSchema = z.string().cuid();

export function match(query: string) {
    return cuidSchema.safeParse(query).success;
}