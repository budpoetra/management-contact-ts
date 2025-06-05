import {
    ContactResponse,
    CreateContactRequest,
    SearchContactRequest,
    toContactResponse,
    UpdateContactRequest,
} from "../model/contact-model";
import Validation from "../validation/validation";
import { ContactValidation } from "../validation/contact-validation";
import { Contact, User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { logger } from "../app/logging";
import ResponseError from "../error/response-error";
import { Pageable } from "../model/page";

export class ContactService {
    static async create(
        user: User,
        req: CreateContactRequest
    ): Promise<ContactResponse> {
        const createRequest = Validation.validate(
            req,
            ContactValidation.CREATE
        );

        const record = {
            ...createRequest,
            ...{ username: user.username! }, // Assuming the user has a username field
        };

        const contact = await prismaClient.contact.create({
            data: record,
        });

        return toContactResponse(contact);
    }

    static async checkContactExists(
        username: string,
        contactId: number
    ): Promise<Contact> {
        const contact = await prismaClient.contact.findUnique({
            where: {
                id: contactId,
                username: username,
            },
        });

        if (!contact) {
            throw new ResponseError(
                404,
                `Contact with id ${contactId} not found for user ${username}`
            );
        }

        return contact;
    }

    static async get(user: User, id: number): Promise<ContactResponse> {
        const contact = await this.checkContactExists(user.username!, id);

        return toContactResponse(contact);
    }

    static async update(
        user: User,
        req: UpdateContactRequest
    ): Promise<ContactResponse> {
        const updateRequest = Validation.validate(
            req,
            ContactValidation.UPDATE
        );

        // Check if the contact exists for the user
        const contact = await this.checkContactExists(
            user.username!,
            updateRequest.id
        );

        // Update the contact with the new data
        const updatedContact = await prismaClient.contact.update({
            where: {
                id: contact.id,
                username: user.username!,
            },
            data: {
                first_name: updateRequest.first_name,
                last_name: updateRequest.last_name,
                email: updateRequest.email,
                phone: updateRequest.phone,
            },
        });

        return toContactResponse(updatedContact);
    }

    static async remove(
        user: User,
        contactId: number
    ): Promise<ContactResponse> {
        // Check if the contact exists for the user
        await this.checkContactExists(user.username!, contactId);

        // Delete the contact
        const contact = await prismaClient.contact.delete({
            where: {
                id: contactId,
                username: user.username!,
            },
        });

        return toContactResponse(contact);
    }

    static async search(
        user: User,
        req: SearchContactRequest
    ): Promise<Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(
            req,
            ContactValidation.SEARCH
        );

        const { name, email, phone, page, size } = searchRequest;

        // Build the where clause based on the search criteria
        const where: any = {
            username: user.username!,
        };

        if (name) {
            where.OR = [
                { first_name: { contains: name, mode: "insensitive" } },
                { last_name: { contains: name, mode: "insensitive" } },
            ];
        }
        if (email) {
            where.email = { contains: email, mode: "insensitive" };
        }
        if (phone) {
            where.phone = { contains: phone };
        }

        // Fetch contacts with pagination
        const [contacts, total] = await Promise.all([
            prismaClient.contact.findMany({
                where,
                skip: (page - 1) * size,
                take: size,
            }),

            prismaClient.contact.count({ where }),
        ]);

        return {
            data: contacts.map((contact) => toContactResponse(contact)),
            paging: {
                current_page: page,
                total_page: Math.ceil(total / size),
                size: size,
            },
        };
    }
}
