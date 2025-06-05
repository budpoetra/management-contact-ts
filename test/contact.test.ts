import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";

describe("POST /api/contact", () => {
    beforeEach(async () => {
        await UserTest.create();
    });
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should create contact with valid request", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@gmail.com",
                phone: "1234567890",
            });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.first_name).toBe("John");
        expect(response.body.data.last_name).toBe("Doe");
    });

    it("should reject create contact with invalid request", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .send({
                first_name: "",
                last_name: "",
                email: "invalid-email",
                phone: "not-a-phone-number",
            });

        logger.debug(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
    });

    it("should reject create contact without authentication", async () => {
        const response = await supertest(web).post("/api/contacts").send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@gmail.com",
            phone: "1234567890",
        });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});

describe("GET /api/contacts/:id", () => {
    let contactId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should get contact by id", async () => {
        const response = await supertest(web)
            .get(`/api/contacts/${contactId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.id).toBe(contactId);
    });

    it("should return 404 for non-existing contact", async () => {
        const response = await supertest(web)
            .get("/api/contacts/9999")
            .set("X-API-TOKEN", "testtoken");

        logger.debug(response.body);

        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
    });

    it("should reject get contact without authentication", async () => {
        const response = await supertest(web).get(`/api/contacts/${contactId}`);

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});

describe("PUT /api/contacts/:id", () => {
    let contactId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should update contact with valid request", async () => {
        const response = await supertest(web)
            .put(`/api/contacts/${contactId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                first_name: "Jane Updated",
                last_name: "Doe Updated",
                email: "newemail@gmail.com",
                phone: "0987654321",
            });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.id).toBe(contactId);
        expect(response.body.data.first_name).toBe("Jane Updated");
        expect(response.body.data.last_name).toBe("Doe Updated");
        expect(response.body.data.email).toBe("newemail@gmail.com");
        expect(response.body.data.phone).toBe("0987654321");
    });

    it("should reject update contact with invalid request", async () => {
        const response = await supertest(web)
            .put(`/api/contacts/${contactId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                first_name: "",
                last_name: "",
                email: "invalid-email",
                phone: "not-a-phone-number",
            });

        logger.debug(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
    });

    it("should reject update contact without authentication", async () => {
        const response = await supertest(web)
            .put(`/api/contacts/${contactId}`)
            .send({
                first_name: "Jane Updated",
                last_name: "Doe Updated",
                email: "newemail@gmail.com",
                phone: "0987654321",
            });

        logger.debug(response.body);

        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});

describe("DELETE /api/contacts/:id", () => {
    let contactId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should delete contact by id", async () => {
        const response = await supertest(web)
            .delete(`/api/contacts/${contactId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBe("Success");
    });

    it("should return 404 for non-existing contact", async () => {
        const response = await supertest(web)
            .delete("/api/contacts/9999")
            .set("X-API-TOKEN", "testtoken");

        logger.debug(response.body);

        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
    });

    it("should reject delete contact without authentication", async () => {
        const response = await supertest(web).delete(
            `/api/contacts/${contactId}`
        );

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});

describe("GET /api/contacts", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should return contacts with all parameters", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({
                page: 1,
                name: "John",
                email: "johndoe@gmail.com",
                phone: "1234567890",
            });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].first_name).toBe("John");
        expect(response.body.data[0].last_name).toBe("Doe");
        expect(response.body.data[0].email).toBe("johndoe@gmail.com");
        expect(response.body.data[0].phone).toBe("1234567890");
    });

    it("should return contacts with only name parameter", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({ name: "J" });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return contacts with only email parameter", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({ email: "johndoe@gmail.com" });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].email).toBe("johndoe@gmail.com");
    });

    it("should return contacts with only phone parameter", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({ phone: "1234567890" });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].phone).toBe("1234567890");
    });

    it("should return empty array for non-matching search", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({ name: "NonExisting" });

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(0);
    });

    it("should reject search contacts without authentication", async () => {
        const response = await supertest(web).get("/api/contacts").query({
            name: "John",
        });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });

    it("should return 200 for empty query parameters", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("X-API-TOKEN", "testtoken")
            .query({});

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});
