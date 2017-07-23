// 访问接口
import ApiClient from './ApiClient';
import ClientMiddleware from './ClientMiddleware';
export const Client = ClientMiddleware(new ApiClient(null));