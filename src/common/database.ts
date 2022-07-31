import { PrismaClient } from "@prisma/client";

const db = {
  instance: new PrismaClient(),
};

export type DataBase = typeof db;

Object.freeze(db);

export const getInstance = () => db.instance;
