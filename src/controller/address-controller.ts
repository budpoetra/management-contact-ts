import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import {
    CreateAddressRequest,
    GetAddressRequest,
    UpdateAddressRequest,
} from "../model/address-model";
import { AddressService } from "../service/address-service";

export class AddressController {
    static async create(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.contact_id);

            const request = req.body as CreateAddressRequest;
            request.contact_id = contactId;

            const response = await AddressService.create(req.user!, request);

            res.status(201).json({
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
            const request: GetAddressRequest = {
                id: Number(req.params.id),
                contact_id: Number(req.params.contact_id),
            };

            const response = await AddressService.get(req.user!, request);

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
            const request = req.body as UpdateAddressRequest;
            request.id = Number(req.params.id);
            request.contact_id = Number(req.params.contact_id);

            const response = await AddressService.update(req.user!, request);

            res.status(201).json({
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
            const request: GetAddressRequest = {
                id: Number(req.params.id),
                contact_id: Number(req.params.contact_id),
            };

            await AddressService.remove(req.user!, request);

            res.status(200).json({
                data: "Success",
            });
        } catch (error) {
            next(error);
        }
    }

    static async list(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.contact_id);

            const response = await AddressService.list(req.user!, contactId);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
}
