import { auth } from './auth';
import { s3 } from './s3';
import { user } from './user';
import { order } from './order';

export const api = {
  auth: auth,
  s3: s3,
  user: user,
  order: order,
};
