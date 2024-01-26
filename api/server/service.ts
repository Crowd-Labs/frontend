import axios, { AxiosRequestConfig, Method } from 'axios';

interface PendingType {
  url: string | undefined;
  method: Method | undefined;
  params: object;
  data: object;
  cancel: Function;
}

const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

const service = axios.create({
  withCredentials: false,
  timeout: 35000,
});

const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 从数组中移除记录
      pending.splice(item, 1);
    }
  }
};

service.interceptors.request.use(
  (request) => {
    removePending(request);
    request.cancelToken = new CancelToken((c) => {
      pending.push({
        url: request.url,
        method: request.method,
        params: request.params,
        data: request.data,
        cancel: c,
      });
    });
    request.baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    return request;
  },
  (error) => {},
);

service.interceptors.response.use(
  (response) => {
    removePending(response.config);
    if (typeof response.data === 'string') { 
      response.data = JSON.parse(response.data);
    }
    return response;
  },
  (error) => {
    return error;
  },
);

export default service;
