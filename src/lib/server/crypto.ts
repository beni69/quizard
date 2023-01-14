import { scrypt as _scrypt, randomBytes } from "node:crypto";
import type { BinaryLike } from "node:crypto";
// export { randomUUID } from "node:crypto";

const scrypt = async (raw: BinaryLike, salt: Buffer, length: number) =>
	new Promise<Buffer>((res, rej) =>
		_scrypt(raw, salt, length, (err, derivedKey) => {
			if (err) rej(err);
			else res(derivedKey);
		})
	);

export const hash = (raw: string, salt?: Buffer) =>
	scrypt(raw, salt || randomBytes(64), 64).then((b) => b.toString("hex"));

export const compare = async (raw: string, dbHash: string, salt: Buffer) =>
	(await scrypt(raw, salt, 64)).toString("hex") === dbHash;
