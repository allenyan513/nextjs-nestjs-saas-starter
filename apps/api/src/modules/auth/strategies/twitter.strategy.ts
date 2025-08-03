import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  private logger = new Logger('TwitterStrategy');

  constructor(private authService: AuthService) {
    const clientID = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const callbackURL = process.env.TWITTER_CALLBACK_URL;
    if (!clientID || !clientSecret || !callbackURL) {
      const logger = new Logger('TwitterStrategy');
      logger.warn(
        'Twitter OAuth environment variables are not set. Twitter login will not work properly.',
      );
    }
    super({
      clientType: 'confidential',
      clientID: clientID || 'placeholder',
      clientSecret: clientSecret || 'placeholder',
      callbackURL: callbackURL || 'http://localhost/placeholder',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    this.logger.debug('Arguments received in TwitterStrategy validate:', {
      accessToken,
      refreshToken,
      profile,
    });
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
