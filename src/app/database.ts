import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
    log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
    ],
});

prismaClient.$on("error", (e) => {
    logger.error("Error: " + e);
});

prismaClient.$on("query", (e) => {
    logger.debug("Query: " + e.query);
    logger.debug("Params: " + e.params);
    logger.debug("Duration: " + e.duration + "ms");
});

prismaClient.$on("info", (e) => {
    logger.info("Info: " + e.message);
});

prismaClient.$on("warn", (e) => {
    logger.warn("Warning: " + e.message);
});
