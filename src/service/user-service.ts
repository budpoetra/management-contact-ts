import { prismaClient } from "../app/database";
import ResponseError from "../error/response-error";
import {
    CreateUserRequest,
    LoginUserRequest,
    UpdateUserRequest,
    UserResponse,
    toUserResponse,
} from "../model/user-model";
import UserValidation from "../validation/user-validation";
import Validation from "../validation/validation";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { User } from "@prisma/client";

class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate<CreateUserRequest>(
            request,
            UserValidation.REGISTRATION
        );

        const duplicateUser = await prismaClient.user.count({
            where: {
                username: registerRequest.username,
            },
        });

        if (duplicateUser != 0) {
            throw new ResponseError(400, "Username already exists");
        }

        registerRequest.password = await bcrypt.hash(
            registerRequest.password,
            10
        );

        const user = await prismaClient.user.create({
            data: registerRequest,
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate<LoginUserRequest>(
            request,
            UserValidation.LOGIN
        );

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username,
            },
        });

        if (!user) {
            throw new ResponseError(400, "Invalid username or password");
        }

        const isPasswordValid = await bcrypt.compare(
            loginRequest.password,
            user.password!
        );

        if (!isPasswordValid) {
            throw new ResponseError(400, "Invalid username or password");
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username,
            },
            data: {
                token: uuid(),
            },
        });

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(
        user: User,
        request: UpdateUserRequest
    ): Promise<UserResponse> {
        const updateRequest = Validation.validate(
            request,
            UserValidation.UPDATE
        );

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username!,
            },
            data: user,
        });

        return toUserResponse(result);
    }

    static async logout(user: User): Promise<UserResponse> {
        await prismaClient.user.update({
            where: {
                username: user.username!,
            },
            data: {
                token: null,
            },
        });

        const response = toUserResponse(user);
        return response;
    }
}

export { UserService };
