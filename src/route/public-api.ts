import express from "express";
import { UserController } from "../controller/user-controller";

const publicRouter = express.Router();

publicRouter.get("/api/ping", (req, res) => {
    res.status(200).json({
        message: "pong",
    });
});

publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);

export { publicRouter };
