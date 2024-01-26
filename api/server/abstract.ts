import { AxiosRequest } from './types';
import service from './service';

function _axios<T>(_axiosRequest: AxiosRequest):Promise<T> {
  return new Promise<T>((resolve, reject) => {
    service({
      url: _axiosRequest.url,
      method: _axiosRequest.method,
      headers: _axiosRequest.headers,
      data: _axiosRequest.data,
      params: _axiosRequest.params,
      responseType: _axiosRequest.responseType,
    })
      .then((response: any) => {
        if (response.status === 200) {
          resolve(response.data)
         // resolve(new Response(response.data));
        } else {
          resolve(response.data)
         // resolve(new Response(response.data));
        }
      })
      .catch((error: any) => {
        const message =
          error?.data?.errorMessage || error?.message || 'req failed';
        reject({
          message: message,
          data: null,
        });
      });
  });
}
export const postReq = (_axiosRequest: AxiosRequest) => {
  return _axios({
    url: _axiosRequest.url,
    headers: _axiosRequest.headers,
    method: 'POST',
    data: _axiosRequest.data,
    params: _axiosRequest.params,
  });
};

export const getReq = <T>(_axiosRequest: AxiosRequest | string,params?:Record<string,any>):Promise<T> => {
  if (typeof _axiosRequest === 'string') { 
    return _axios<T>({
      url: _axiosRequest,
      params,
    })
  }
  return _axios<T>({
    url: _axiosRequest.url,
    headers: _axiosRequest.headers,
    method: 'GET',
    data: _axiosRequest.data,
    params: _axiosRequest.params ,
  });
};
