import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { UserRouter } from "./users";

// Server configs
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(morgan(process.env.MORGAN_MODE || "common"));
app.use(cors());

// Routes
app.get("/", (_: Request, res: Response) =>
  res.json({ message: "Welcome to TS Server with Prisma! ⚡" }),
);
app.use("/users", UserRouter);

// Run server
app.listen(port, () => {
  console.log(`⚡ Server is running on port ${port}`);
});

export default app;
