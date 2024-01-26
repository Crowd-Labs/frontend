import { postReq } from './abstract';

export function testList(data: {}): Promise<any> {
  return postReq({
    url: 'http://localhost:8080/api',
    data: data,
  });
}
