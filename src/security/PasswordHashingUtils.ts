import * as config from 'config';
import * as bcrypt from 'bcrypt';

export class PasswordEncryptionUtils {
    public static async hashPassword(password: string): Promise<string> {
        const hashingRounds: number = config.get('security.hashingRounds');
        return await bcrypt.hash(password, hashingRounds);
    }

    public static async isPasswordEqualToHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
