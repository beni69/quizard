import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";

export const EXPIRY = 86400000; // 1 day

export interface Token {
	id: string;
}

export const decode = (token: string) => {
	try {
		return (jwt.verify(token, JWT_SECRET) as Token).id;
	} catch (e) {
		return false;
	}
};

export const sign = (token: Token) => jwt.sign(token, JWT_SECRET, { expiresIn: EXPIRY });
