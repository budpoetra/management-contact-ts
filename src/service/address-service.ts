import { Address, User } from "@prisma/client";
import {
    AddressResponse,
    CreateAddressRequest,
    GetAddressRequest,
    RemoveAddressRequest,
    toAddressResponse,
    UpdateAddressRequest,
} from "../model/address-model";
import Validation from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../app/database";
import ResponseError from "../error/response-error";

export class AddressService {
    static async create(
        user: User,
        req: CreateAddressRequest
    ): Promise<AddressResponse> {
        const createdAddress = Validation.validate(
            req,
            AddressValidation.CREATE
        );

        await ContactService.checkContactExists(
            user.username!,
            createdAddress.contact_id
        );

        const address = await prismaClient.address.create({
            data: {
                contact_id: createdAddress.contact_id,
                street: createdAddress.street,
                city: createdAddress.city,
                province: createdAddress.province,
                country: createdAddress.country,
                postal_code: createdAddress.postal_code ?? null,
            },
        });

        if (!address) {
            throw new ResponseError(500, "Failed to create address");
        }

        return toAddressResponse(address);
    }

    static async checkAddressExists(
        id: number,
        contactId: number
    ): Promise<Address> {
        const address = await prismaClient.address.findUnique({
            where: {
                id: id,
                contact_id: contactId,
            },
        });

        if (!address) {
            throw new ResponseError(
                404,
                `Address with id ${id} not found for contact ${contactId}`
            );
        }

        return address;
    }

    static async get(
        user: User,
        req: GetAddressRequest
    ): Promise<AddressResponse> {
        const validatedRequest = Validation.validate(
            req,
            AddressValidation.GET
        );

        await ContactService.checkContactExists(
            user.username!,
            validatedRequest.contact_id
        );

        const address = await this.checkAddressExists(
            validatedRequest.id,
            validatedRequest.contact_id
        );

        return toAddressResponse(address);
    }

    static async update(
        user: User,
        req: UpdateAddressRequest
    ): Promise<AddressResponse> {
        const updatedAddress = Validation.validate(
            req,
            AddressValidation.UPDATE
        );

        await ContactService.checkContactExists(
            user.username!,
            updatedAddress.contact_id
        );

        await this.checkAddressExists(
            updatedAddress.id,
            updatedAddress.contact_id
        );

        const address = await prismaClient.address.update({
            where: {
                id: updatedAddress.id,
                contact_id: updatedAddress.contact_id,
            },
            data: {
                street: updatedAddress.street,
                city: updatedAddress.city,
                province: updatedAddress.province,
                country: updatedAddress.country,
                postal_code: updatedAddress.postal_code ?? null,
            },
        });

        if (!address) {
            throw new ResponseError(404, "Address not found");
        }

        return toAddressResponse(address);
    }

    static async remove(user: User, req: RemoveAddressRequest): Promise<void> {
        const validatedRequest = Validation.validate(
            req,
            AddressValidation.REMOVE
        );

        await ContactService.checkContactExists(
            user.username!,
            validatedRequest.contact_id
        );

        await this.checkAddressExists(
            validatedRequest.id,
            validatedRequest.contact_id
        );

        const deletedAddress = await prismaClient.address.delete({
            where: {
                id: validatedRequest.id,
                contact_id: validatedRequest.contact_id,
            },
        });

        if (!deletedAddress) {
            throw new ResponseError(404, "Address not found");
        }
    }

    static async list(
        user: User,
        contactId: number
    ): Promise<Array<AddressResponse>> {
        await ContactService.checkContactExists(user.username!, contactId);

        const addresses = await prismaClient.address.findMany({
            where: {
                contact_id: contactId,
            },
        });

        return addresses.map(toAddressResponse);
    }
}
