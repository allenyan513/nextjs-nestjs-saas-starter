import { S3SignedUrlEntity, S3GetSignedUrlDto } from '@repo/shared';
import { authFetch } from './auth-fetch';

export const s3 = {
  getSignedUrl: (dto: S3GetSignedUrlDto): Promise<S3SignedUrlEntity> =>
    authFetch('/s3/getSignedUrl', 'POST', dto),
};
