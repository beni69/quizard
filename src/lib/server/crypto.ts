import type { BinaryLike } from "node:crypto";
import { randomBytes, scrypt as _scrypt } from "node:crypto";

const scrypt = async (raw: BinaryLike, salt: Buffer, length: number) =>
	new Promise<Buffer>((res, rej) =>
		_scrypt(raw, salt, length, (err, derivedKey) => {
			if (err) rej(err);
			else res(derivedKey);
		})
	);

export const hash = (raw: string, salt: Buffer) =>
	scrypt(raw, salt, 64).then((b) => b.toString("base64"));

export const compare = (raw: string, dbHash: string, salt: Buffer) =>
	scrypt(raw, salt, 64).then((b) => b.toString("base64") === dbHash);

export const genSalt = () => randomBytes(64);
