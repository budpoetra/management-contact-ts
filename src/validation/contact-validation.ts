import { ZodType, z } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(1).max(100),
        last_name: z.string().optional(),
        email: z.string().email("Invalid email format").optional(),
        phone: z.string().optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().int().positive("ID must be a positive integer"),
        first_name: z.string().min(1).max(100),
        last_name: z.string().optional(),
        email: z.string().email("Invalid email format").optional(),
        phone: z.string().optional(),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email("Invalid email format").optional(),
        phone: z.string().min(1).optional(),
        page: z
            .number()
            .int()
            .positive("Page must be a positive integer")
            .default(1),
        size: z
            .number()
            .int()
            .positive("Size must be a positive integer")
            .default(10),
    });
}
