import { NextFunction, Request, Response } from "express";
import { isValidToken } from "@src/common/utils";
import { HttpStatus } from "../types";

export function checkAuth({ headers }: Request, res: Response, next: NextFunction) {
  if (isValidToken(headers)) {
    return next();
  }
  return res.status(HttpStatus.UNAUTHORIZED).send();
}
