import { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { getInstance } from "@src/common/database";

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "";

export const getAuthToken = (headers: IncomingHttpHeaders): string =>
  headers?.authorization?.split(" ")?.at(1) || "";

export function generateToken(userId: number): string {
  const iat = Date.now();
  const exp = iat + Number(process.env.TOKEN_EXPIRATION_TIME);
  return jwt.sign(
    {
      userId,
      iat,
      exp,
    },
    TOKEN_SECRET_KEY,
  );
}

export function isValidToken(headers: IncomingHttpHeaders): boolean {
  try {
    const token = getAuthToken(headers);
    const claims = jwt.verify(token, TOKEN_SECRET_KEY);
    return (
      typeof claims === "object" &&
      claims.userId &&
      claims.exp &&
      claims.exp < Date.now() + Number(process.env.TOKEN_EXPIRATION_TIME)
    );
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getCurrentUser(headers: IncomingHttpHeaders): Promise<User | null> {
  try {
    const token = getAuthToken(headers);
    const claims = jwt.verify(token, TOKEN_SECRET_KEY);
    const id = typeof claims === "object" && claims.id ? claims.id : undefined;
    if (id !== undefined) {
      return await getInstance().user.findUnique({ where: { id } });
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}
