import { ZodType } from "zod";

class Validation {
    static validate<T>(data: T, schema: ZodType): T {
        return schema.parse(data);
    }
}

export default Validation;
