import { User } from "@prisma/client";
import { prismaClient } from "../src/app/database";
import bcrypt from "bcrypt";

class UserTest {
    static async delete() {
        const user = await prismaClient.user.findUnique({
            where: {
                username: "testuser",
            },
        });

        if (user) {
            // Menghapus user yang sudah ada
            await prismaClient.user.delete({
                where: {
                    username: "testuser",
                },
            });
        }
    }

    static async create() {
        // Membuat user baru untuk pengujian
        await prismaClient.user.create({
            data: {
                username: "testuser",
                password: await bcrypt.hash("testpassword", 10),
                name: "Test User",
                token: "testtoken",
            },
        });
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: "testuser",
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}

class ContactTest {
    static async deleteAll() {
        await prismaClient.contact.deleteMany({
            where: {
                username: "testuser",
            },
        });
    }

    static async create() {
        const user = await UserTest.get();

        const newContact = await prismaClient.contact.create({
            data: {
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@gmail.com",
                phone: "1234567890",
                username: user.username!,
            },
        });

        return newContact;
    }
}

class AddressTest {
    static async deleteAll() {
        await prismaClient.address.deleteMany({
            where: {
                contact: {
                    username: "testuser",
                },
            },
        });
    }

    static async create(contactId: number) {
        const newAddress = await prismaClient.address.create({
            data: {
                contact_id: contactId,
                street: "123 Test St",
                city: "Test City",
                province: "Test Province",
                country: "Test Country",
                postal_code: "12345",
            },
        });

        return newAddress;
    }

    static async get(contactId: number, addressId: number) {
        const address = await prismaClient.address.findUnique({
            where: {
                id: addressId,
                contact_id: contactId,
            },
        });

        if (!address) {
            throw new Error(
                `Address with id ${addressId} not found for contact ${contactId}`
            );
        }

        console.log("Address found:", address);

        return address;
    }

    static async createMany(contactId: number, count: number) {
        for (let i = 0; i < count; i++) {
            await prismaClient.address.create({
                data: {
                    contact_id: contactId,
                    street: `Street ${i + 1}`,
                    city: `City ${i + 1}`,
                    province: `Province ${i + 1}`,
                    country: `Country ${i + 1}`,
                    postal_code: `PostalCode${i + 1}`,
                },
            });
        }
    }
}

export { UserTest, ContactTest, AddressTest };
