export class Error {
    public code: number;
    public message: string;

    public toJson(): string {
        return JSON.stringify(this);
    }
}