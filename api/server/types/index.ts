export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export interface AxiosRequest {
  baseURL?: string;
  url?: string ;
  data?: object;
  params?: object;
  method?: Method;
  headers?: {};
  timeout?: number;
  responseType?: ResponseType;
}

export interface AxiosResponse {
  data: any;
  headers: object;
  request?: object;
  status: number;
  statusText: string;
  config: AxiosRequest;
}

export interface CustomResponse {
  readonly status: boolean;
  readonly message: string;
  data: any;
  origin?: any;
}

export interface Dashboard {
  TVL: number;
  cumulativeTVL: number;
  cumulativeTraders: number;
  cumulativeTransactions: number;
  numberOfTraders: number;
  numberOfTransactions: number;
  price: number;
  tradingPairs: number;
  tradingVolume: number;
  snapshotTime: string;
}
