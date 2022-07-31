import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { getInstance } from "@src/common/database";
import { generateToken } from "@src/common/utils";
import { CustomRequest, HttpStatus } from "@src/common/types";
import { comparePassword, encryptPassword, userValidator } from "./utils";

export async function getUsers(_: Request, res: Response) {
  const users = await getInstance().user.findMany();
  return res.json({ users });
}

export async function createUser({ body: user }: CustomRequest<User>, res: Response) {
  const validate = userValidator(user);
  if (!validate.isValid) {
    const { message } = validate || "Error inesperado al crear el usuario";
    return res.status(HttpStatus.BAD_REQUEST).json({ error: true, message });
  }

  try {
    const password = encryptPassword(user.password || "");

    const newUser = await getInstance().user.create({
      data: {
        ...user,
        password,
      },
    });
    return res.json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.SERVER_ERROR).send();
  }
}

export async function updateUser({ body: user, params }: CustomRequest<User>, res: Response) {
  const validate = userValidator(user, true);
  if (!validate.isValid) {
    const { message } = validate || "Error inesperado al crear el usuario";
    return res.status(HttpStatus.BAD_REQUEST).json({ error: true, message });
  }

  try {
    const id = Number(params.id);
    const password = user.password ? encryptPassword(user.password) : undefined;
    const updatedUser = await getInstance().user.update({
      where: { id },
      data: {
        ...user,
        password,
      },
    });
    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.SERVER_ERROR).send();
  }
}

export async function updatePassword(
  { body, params }: CustomRequest<Pick<User, "password">>,
  res: Response,
) {
  if (!params.id || !body.password) {
    return res.status(HttpStatus.BAD_REQUEST).send();
  }

  try {
    const id = Number(params.id);
    const password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
    await getInstance().user.update({
      where: { id },
      data: {
        password,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.SERVER_ERROR).send();
  }

  return res.status(HttpStatus.NO_CONTENT).send();
}

export async function deleteUser({ params }: Request, res: Response) {
  if (!params.id) {
    return res.status(HttpStatus.BAD_REQUEST).send();
  }

  try {
    const id = Number(params.id);
    await getInstance().user.delete({ where: { id } });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.SERVER_ERROR).send();
  }

  return res.status(HttpStatus.NO_CONTENT).send();
}

export async function login({ body: { email, password } }: Request, res: Response) {
  if (!email || !password) return res.status(HttpStatus.BAD_REQUEST);

  try {
    const user = await getInstance().user.findUnique({
      where: { email },
    });
    if (user && comparePassword(password, user.password)) {
      return res.json({
        token: generateToken(user.id),
        user: {
          ...user,
          password: undefined,
        },
      });
    }
  } catch (err) {
    return res.status(HttpStatus.SERVER_ERROR).send();
  }

  return res.status(HttpStatus.NOT_FOUND).send();
}
