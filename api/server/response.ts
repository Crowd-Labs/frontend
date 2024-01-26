import { FCObject } from './fc_object';

export default class Response extends FCObject {
  public data?: ResponseData;
  public code?: number;
  public msg?: string;

  constructor(data: {}) {
    super(data);
    if (!data) {
      return;
    }
    if (!Array.isArray(data)) {
      this.modelAddProperty.call(this, data);
    } 
  }
}

export class ResponseData {
  public error?: XLError;
}

export class XLError {
  public reason?: string;
  public details?: string;
}
