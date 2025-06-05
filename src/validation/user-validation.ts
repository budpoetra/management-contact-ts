import { z, ZodType } from "zod";

class UserValidation {
    static readonly REGISTRATION: ZodType = z.object({
        username: z.string().min(5).max(20),
        name: z.string().min(5).max(20),
        password: z.string().min(6).max(20),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(5).max(20),
        password: z.string().min(6).max(20),
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(5).max(20).optional(),
        password: z.string().min(6).max(20).optional(),
    });
}

export default UserValidation;
