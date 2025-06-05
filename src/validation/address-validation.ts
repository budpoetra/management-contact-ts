import { ZodType, z } from "zod";

export class AddressValidation {
    static readonly CREATE: ZodType = z.object({
        contact_id: z.number().positive(),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        province: z.string().min(1, "Province is required"),
        country: z.string().min(1, "Country is required"),
        postal_code: z.string().optional().nullable(),
    });

    static readonly GET: ZodType = z.object({
        id: z.number().positive(),
        contact_id: z.number().positive(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        contact_id: z.number().positive(),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        province: z.string().min(1, "Province is required"),
        country: z.string().min(1, "Country is required"),
        postal_code: z.string().optional().nullable(),
    });

    static readonly REMOVE: ZodType = z.object({
        id: z.number().positive(),
        contact_id: z.number().positive(),
    });
}
