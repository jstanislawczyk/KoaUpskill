import * as config from 'config';

export class JsonWebToken {
    public iss: string;
    public sub: string;
    public iat: number;
    public exp: number;

    setupAuthenticationToken(userId: string): void {
        const dayInSeconds = 86400;
        const appName: string = config.get('app.name');

        this.sub = userId;
        this.iss = appName;
        this.iat = Date.now() / 1000;
        this.exp = this.iat + dayInSeconds;
    }
}