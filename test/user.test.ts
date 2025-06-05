// Mengimpor supertest untuk melakukan pengujian HTTP
import supertest from "supertest";
import bcrypt from "bcrypt";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject register new user if request is invalid", async () => {
        const response = await supertest(web).post("/api/users").send({
            username: "",
            password: "",
            name: "",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it("should register new user", async () => {
        const response = await supertest(web).post("/api/users").send({
            username: "testuser",
            password: "testpassword",
            name: "Test User",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should user be login with valid account", async () => {
        const response = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Test User");
        expect(response.body.data.token).toBeDefined();
    });

    it("should reject login with invalid account", async () => {
        const response = await supertest(web).post("/api/users/login").send({
            username: "invaliduser",
            password: "invalidpassword",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });
});

describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should get user data", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .get("/api/users/current")
            .set("X-API-TOKEN", login.body.data.token);

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Test User");
    });

    it("should reject get user data if token is invalid", async () => {
        const response = await supertest(web)
            .get("/api/users/current")
            .set("X-API-TOKEN", "invalidtoken");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should be able update user data", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", login.body.data.token)
            .send({
                name: "Updated User",
                password: "newpassword",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Updated User");
    });

    it("should reject update user data if token is invalid", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "invalidtoken")
            .send({
                name: "Updated User",
                password: "newpassword",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });

    it("should reject update user data if request is invalid", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", login.body.data.token)
            .send({
                name: "",
                password: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it("should update user data without changing password", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", login.body.data.token)
            .send({
                name: "Updated User",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Updated User");
    });

    it("should update user data without changing name", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", login.body.data.token)
            .send({
                password: "newpassword",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Test User");

        const user = await UserTest.get();
        expect(await bcrypt.compare("newpassword", user.password!)).toBe(true);
    });
});

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should logout user", async () => {
        const login = await supertest(web).post("/api/users/login").send({
            username: "testuser",
            password: "testpassword",
        });

        const response = await supertest(web)
            .delete("/api/users/logout")
            .set("X-API-TOKEN", login.body.data.token);

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.username).toBe("testuser");
        expect(response.body.data.name).toBe("Test User");

        const user = await UserTest.get();
        expect(user.token).toBeNull();
    });

    it("should reject logout if token is invalid", async () => {
        const response = await supertest(web)
            .delete("/api/users/logout")
            .set("X-API-TOKEN", "invalidtoken");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBe("Unauthorized");
    });
});
