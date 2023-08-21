import 'dotenv/config';
import { Strategy, Profile } from "passport-google-oidc";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOidcStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '955903274664-ps373qf3a0ia4oadt9btl3nb4skpge13.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:8080/auth/google/callback',
            scope: ['profile', 'email'],
        });
    }

    async validate(profile: Profile, done: (err: any, user: any) => void) {
        return done(null, profile);
    }
}