import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import {
    CreateContactRequest,
    SearchContactRequest,
    UpdateContactRequest,
} from "../model/contact-model";
import { ContactService } from "../service/contact-service";

export class ContactController {
    static async create(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const request: CreateContactRequest =
                req.body as CreateContactRequest;

            const response = await ContactService.create(req.user!, request);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async get(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.id);

            const response = await ContactService.get(req.user!, contactId);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.id);
            let request: UpdateContactRequest =
                req.body as UpdateContactRequest;

            request = {
                ...request,
                id: contactId,
            };

            const response = await ContactService.update(req.user!, request);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async remove(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.id);

            await ContactService.remove(req.user!, contactId);

            res.status(200).json({
                data: "Success",
            });
        } catch (error) {
            next(error);
        }
    }

    static async search(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const request: SearchContactRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: Number(req.query.page) || 1,
                size: Number(req.query.size) || 10,
            };

            const response = await ContactService.search(req.user!, request);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
