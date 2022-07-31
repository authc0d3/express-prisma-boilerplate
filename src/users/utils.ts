import { User } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import addErrros from "ajv-errors";
import bcrypt from "bcrypt";
import { ValidationResult } from "@src/common/types";

type ValidCreateUserType = Omit<User, "createdAt" | "updatedAt"> & {
  readonly id?: number;
  readonly lastname?: string;
};

type ValidUpdateUserType = ValidCreateUserType & {
  readonly email?: string;
  readonly password?: string;
};

// TODO: Configure i18n to correctly set messages
const createUserSchema: JSONSchemaType<ValidCreateUserType> = {
  type: "object",
  properties: {
    id: { type: "number", nullable: true },
    firstname: { type: "string" },
    lastname: { type: "string", nullable: true },
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
  required: ["firstname", "email", "password"],
  errorMessage: {
    type: "Los datos no tienen el formato adecuado",
    required: {
      firstname: "Debe indicar un nombre",
    },
    properties: {
      email: "Debe indicar un e-mail válido",
      password:
        "La contraseña debe tener una longitud mínima de 8 caracteres, y debe contener al menos una caracter en mayúsculas, uno en minúsculas, un número y un carácter especial",
    },
  },
};

const updateUserSchema: JSONSchemaType<ValidUpdateUserType> = {
  type: "object",
  properties: {
    id: { type: "number", nullable: true },
    firstname: { type: "string" },
    lastname: { type: "string", nullable: true },
    email: { type: "string", format: "email", nullable: true },
    password: { type: "string", format: "password", nullable: true },
  },
  required: ["firstname"],
  errorMessage: {
    type: "Los datos no tienen el formato adecuado",
    required: {
      firstname: "Debe indicar un nombre",
    },
    properties: {
      email: "Debe indicar un e-mail válido",
      password:
        "La contraseña debe tener una longitud mínima de 8 caracteres, y debe contener al menos una caracter en mayúsculas, uno en minúsculas, un número y un carácter especial",
    },
  },
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function userValidator(user: User, isUpdate?: boolean): ValidationResult {
  const ajv = new Ajv({ allErrors: true });
  ajv.addFormat("password", PASSWORD_REGEX);
  addFormats(ajv, ["email"]);
  addErrros(ajv);

  const validator = ajv.compile(isUpdate ? updateUserSchema : createUserSchema);
  const isValid = validator(user);
  return {
    isValid,
    message: validator.errors?.at(0)?.message,
  };
}

export const encryptPassword = (password: string): string =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const comparePassword = (plain: string, encrypted: string): boolean =>
  bcrypt.compareSync(plain, encrypted);
