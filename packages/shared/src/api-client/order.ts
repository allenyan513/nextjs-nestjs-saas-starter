import { authFetch } from './auth-fetch';
import {
  CreateOneTimePaymentDto,
  CreateOneTimePaymentResponse,
  OrderEntity,
} from '../types';

export const order = {
  findAllProducts: () => authFetch(`/api/orders/products`, 'GET', {}),
  createOne: (
    dto: CreateOneTimePaymentDto,
  ): Promise<CreateOneTimePaymentResponse> =>
    authFetch('/api/orders/create', 'POST', dto),
  findAll: (): Promise<OrderEntity[]> => authFetch('/api/orders', 'GET', {}),
  findOne: (id: string) => authFetch(`/api/orders/${id}`, 'GET', {}),
  deleteOne: (id: string) => authFetch(`/api/orders/${id}`, 'DELETE', {}),
};
