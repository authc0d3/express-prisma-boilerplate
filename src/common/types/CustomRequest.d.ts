import { Request } from "express";

export interface CustomRequest<T> extends Request {
  readonly body: T;
}
