import { prismaClient } from "../app/database";
import { NextFunction, Response, Request } from "express";
import { UserRequest } from "../type/user-request";

export const authMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.get("X-API-TOKEN");

        console.log("Token: ", token);

        if (token) {
            const user = await prismaClient.user.findFirst({
                where: {
                    token: token,
                },
            });

            if (user) {
                req.user = user;
                next();
                return;
            }
        }

        res.status(401)
            .json({
                errors: "Unauthorized",
            })
            .end();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
