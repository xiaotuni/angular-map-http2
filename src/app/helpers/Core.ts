// 访问接口
import ApiClient from './ApiClient';
import clientMiddleware from './clientMiddleware';
export const Client = clientMiddleware(new ApiClient(null));