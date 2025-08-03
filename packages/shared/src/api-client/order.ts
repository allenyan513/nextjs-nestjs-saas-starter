import { authFetch } from './auth-fetch';
import {
  CreateOneTimePaymentDto,
  CreateOneTimePaymentResponse,
  OrderEntity,
} from '@repo/shared';

export const order = {
  findAllProducts: () => authFetch(`/orders/products`, 'GET', {}),
  createOne: (
    dto: CreateOneTimePaymentDto,
  ): Promise<CreateOneTimePaymentResponse> =>
    authFetch('/orders/create', 'POST', dto),
  findAll: (): Promise<OrderEntity[]> => authFetch('/orders', 'GET', {}),
  findOne: (id: string) => authFetch(`/orders/${id}`, 'GET', {}),
  deleteOne: (id: string) => authFetch(`/orders/${id}`, 'DELETE', {}),
};
