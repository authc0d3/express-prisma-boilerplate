import express from "express";
import { checkAuth } from "@src/common/middlewares";
import { getUsers, createUser, updateUser, updatePassword, deleteUser, login } from "./services";

const router = express.Router();

router.get("/", checkAuth, getUsers);
router.post("/", checkAuth, createUser);
router.post("/login", login);
router.put("/:id", checkAuth, updateUser);
router.put("/:id/update-password", updatePassword);
router.delete("/:id", checkAuth, deleteUser);

export default router;
