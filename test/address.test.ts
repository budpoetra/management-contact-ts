import supertest from "supertest";
import { UserTest, ContactTest, AddressTest } from "./test-util";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";

describe("POST to /api/contacts/:contact_id/addresses", () => {
    let contactId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should create a new address for the contact", async () => {
        const response = await supertest(web)
            .post(`/api/contacts/${contactId}/addresses`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "123 Test St",
                city: "Test City",
                province: "Test Province",
                country: "Test Country",
                postal_code: "12345",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.street).toBe("123 Test St");
        expect(response.body.data.city).toBe("Test City");
        expect(response.body.data.province).toBe("Test Province");
        expect(response.body.data.country).toBe("Test Country");
        expect(response.body.data.postal_code).toBe("12345");
    });

    it("should return 400 if required fields are missing", async () => {
        const response = await supertest(web)
            .post(`/api/contacts/${contactId}/addresses`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "",
                city: "Test City",
                province: "Test Province",
                country: "Test Country",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Street is required");
    });

    it("should return 404 if contact does not exist", async () => {
        const invalidContactId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .post(`/api/contacts/${invalidContactId}/addresses`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "123 Test St",
                city: "Test City",
                province: "Test Province",
                country: "Test Country",
                postal_code: "12345",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Contact with id ${invalidContactId} not found for user testuser`
        );
    });
});

describe("GET to /api/contacts/:contact_id/addresses/:id", () => {
    let contactId: number;
    let addressId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
        const address = await AddressTest.create(contactId);
        addressId = address.id;
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should retrieve the address for the contact", async () => {
        const response = await supertest(web)
            .get(`/api/contacts/${contactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("id", addressId);
        expect(response.body.data.street).toBe("123 Test St");
    });

    it("should return 404 if address does not exist", async () => {
        const invalidAddressId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .get(`/api/contacts/${contactId}/addresses/${invalidAddressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Address with id ${invalidAddressId} not found for contact ${contactId}`
        );
    });

    it("should return 404 if contact does not exist", async () => {
        const invalidContactId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .get(`/api/contacts/${invalidContactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Contact with id ${invalidContactId} not found for user testuser`
        );
    });
});

describe("PUT to /api/contacts/:contact_id/addresses/:id", () => {
    let contactId: number;
    let addressId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
        const address = await AddressTest.create(contactId);
        addressId = address.id;
        // await AddressTest.get(contactId, addressId);
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should update the address for the contact", async () => {
        const response = await supertest(web)
            .put(`/api/contacts/${contactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "456 Updated St",
                city: "Updated City",
                province: "Updated Province",
                country: "Updated Country",
                postal_code: "67890",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("id", addressId);
        expect(response.body.data.street).toBe("456 Updated St");
    });

    it("should return 404 if address does not exist", async () => {
        const invalidAddressId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .put(`/api/contacts/${contactId}/addresses/${invalidAddressId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "456 Updated St",
                city: "Updated City",
                province: "Updated Province",
                country: "Updated Country",
                postal_code: "67890",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Address with id ${invalidAddressId} not found for contact ${contactId}`
        );
    });

    it("should return 404 if contact does not exist", async () => {
        const invalidContactId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .put(`/api/contacts/${invalidContactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "456 Updated St",
                city: "Updated City",
                province: "Updated Province",
                country: "Updated Country",
                postal_code: "67890",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Contact with id ${invalidContactId} not found for user testuser`
        );
    });

    it("should return 400 if required fields are missing", async () => {
        const response = await supertest(web)
            .put(`/api/contacts/${contactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken")
            .send({
                street: "",
                city: "Updated City",
                province: "Updated Province",
                country: "Updated Country",
            });

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Street is required");
    });
});

describe("DELETE to /api/contacts/:contact_id/addresses/:id", () => {
    let contactId: number;
    let addressId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
        const address = await AddressTest.create(contactId);
        addressId = address.id;
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should delete the address for the contact", async () => {
        const response = await supertest(web)
            .delete(`/api/contacts/${contactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toBe("Success");
    });

    it("should return 404 if address does not exist", async () => {
        const invalidAddressId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .delete(`/api/contacts/${contactId}/addresses/${invalidAddressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Address with id ${invalidAddressId} not found for contact ${contactId}`
        );
    });

    it("should return 404 if contact does not exist", async () => {
        const invalidContactId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .delete(`/api/contacts/${invalidContactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Contact with id ${invalidContactId} not found for user testuser`
        );
    });

    it("should return 401 if unauthorized", async () => {
        const response = await supertest(web)
            .delete(`/api/contacts/${contactId}/addresses/${addressId}`)
            .set("X-API-TOKEN", "invalidtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Unauthorized");
    });
});

describe("GET to /api/contacts/:contact_id/addresses", () => {
    let contactId: number;

    beforeEach(async () => {
        await UserTest.create();
        const contact = await ContactTest.create();
        contactId = contact.id;
        await AddressTest.create(contactId);
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should list all addresses for the contact", async () => {
        const response = await supertest(web)
            .get(`/api/contacts/${contactId}/addresses`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return 404 if contact does not exist", async () => {
        const invalidContactId = 9999; // Assuming this ID does not exist

        const response = await supertest(web)
            .get(`/api/contacts/${invalidContactId}/addresses`)
            .set("X-API-TOKEN", "testtoken");

        logger.debug("Response body:", response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe(
            `Contact with id ${invalidContactId} not found for user testuser`
        );
    });
});
