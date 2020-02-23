import * as config from 'config';
import {JsonWebToken} from '../../../src/config/helper/JsonWebToken';
import {sign} from "jsonwebtoken";
import {User} from "../../../src/entity/User";
import {UserDataGenerator} from "../data-generator/UserDataGenerator";
import {UserRole} from "../../../src/enum/UserRole";
import {getRepository} from "typeorm";

export class SecurityConfig {

    public static async createFakeTokenWithoutUser(): Promise<string> {
        const user: User = UserDataGenerator.createUser('test@mail.com', '1qazXSW@', 'John', 'Doe', UserRole.MANAGER);
        const savedUser = await getRepository(User).save(user);

        return SecurityConfig.createFakeToken(savedUser.id.toHexString());
    }

    public static createFakeToken(userId: string): string {
        const applicationSecret: string = config.get('security.secret');
        const tokenBody: JsonWebToken = new JsonWebToken();

        tokenBody.setupAuthenticationToken(userId);

        return sign(Object.assign({}, tokenBody), applicationSecret);
    }
}