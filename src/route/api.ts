import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";
import { AddressController } from "../controller/address-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User routes
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/logout", UserController.logout);

// Contact routes
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:id", ContactController.get);
apiRouter.put("/api/contacts/:id", ContactController.update);
apiRouter.delete("/api/contacts/:id", ContactController.remove);
apiRouter.get("/api/contacts", ContactController.search);

// Address routes
apiRouter.post("/api/contacts/:contact_id/addresses", AddressController.create);
apiRouter.get("/api/contacts/:contact_id/addresses/:id", AddressController.get);
apiRouter.put(
    "/api/contacts/:contact_id/addresses/:id",
    AddressController.update
);
apiRouter.delete(
    "/api/contacts/:contact_id/addresses/:id",
    AddressController.remove
);
apiRouter.get("/api/contacts/:contact_id/addresses", AddressController.list);
