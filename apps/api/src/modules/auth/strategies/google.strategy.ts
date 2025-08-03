import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private logger = new Logger('GoogleStrategy');

  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;
    if (!clientID || !clientSecret || !callbackURL) {
      const logger = new Logger('GoogleStrategy');
      logger.warn(
        'Google OAuth environment variables are not set. Google login will not work properly.',
      );
    }
    super({
      clientID: clientID || 'placeholder',
      clientSecret: clientSecret || 'placeholder',
      callbackURL: callbackURL || 'http://localhost/placeholder',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    this.logger.debug('Google validate', profile);
    const {
      provider,
      id,
      displayName,
      email,
      email_verified,
      verified,
      picture,
    } = profile;
    return this.authService.validateOAuthLogin({
      provider: provider,
      providerAccountId: id,
      email: email,
      name: displayName,
      avatarUrl: picture,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
