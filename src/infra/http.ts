type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HTTPResponse<T> = {
  response: Response;
  body: T;
};

export type HTTPClient = {
  request: <I, O>(method: HTTPMethod, path: string, data?: I) => Promise<HTTPResponse<O>>;
  get: <O>(path: string) => Promise<HTTPResponse<O>>;
  post: <I, O>(path: string, data: I) => Promise<HTTPResponse<O>>;
  patch: <I, O>(path: string, data: I) => Promise<HTTPResponse<O>>;
  delete: <O>(path: string) => Promise<HTTPResponse<O>>;
};

export const createHTTPClient = (baseURL: string): HTTPClient => {
  const request = async <I, O>(
    method: HTTPMethod,
    path: string,
    data?: I
  ): Promise<HTTPResponse<O>> => {
    const url = `${baseURL}${path}`;
    const options: {
      method: HTTPMethod;
      headers: {
        'Content-Type': string;
      };
      body?: string;
    } = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    const res = await fetch(url, options);
    const body = await res.json();

    return {
      response: res,
      body,
    };
  };

  const get = async <O>(path: string): Promise<HTTPResponse<O>> => {
    return request<void, O>('GET', path);
  };
  const post = async <I, O>(path: string, data: I) => {
    return request<I, O>('POST', path, data);
  };
  const patch = async <I, O>(path: string, data: I) => {
    return request<I, O>('PATCH', path, data);
  };
  const deleteMethod = async <O>(path: string) => {
    return request<void, O>('DELETE', path);
  };

  return {
    request,
    get,
    post,
    patch,
    delete: deleteMethod,
  };
};
