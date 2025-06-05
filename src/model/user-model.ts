import { User } from "@prisma/client";

type UserResponse = {
    username: string;
    name: string;
    token?: string;
};

type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
};

type LoginUserRequest = {
    username: string;
    password: string;
};

type UpdateUserRequest = {
    name?: string;
    password?: string;
};

function toUserResponse(user: User): UserResponse {
    return {
        username: user.username ?? "",
        name: user.name ?? "",
    };
}

export {
    UserResponse,
    CreateUserRequest,
    toUserResponse,
    LoginUserRequest,
    UpdateUserRequest,
};
