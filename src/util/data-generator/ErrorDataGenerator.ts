import { Error } from "../../exception/Error";

export class ErrorDataGenerator {
    public static createError(code: number, message: string): Error {
        const error: Error = new Error();

        error.code = code;
        error.message = message;

        return error;
    }
}
