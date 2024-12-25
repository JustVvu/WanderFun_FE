
const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface IErrorResponse {
  code: string;
  description: string
}

interface ApiResponse {
  data: IErrorResponse;
  statusCode: string;
  message: string;
}

async function client<T>(
  endpoint: string,
  config: RequestInit = {}
): Promise<T> {
  // Check if baseURL is defined
  if (!baseURL) {
    throw new Error('API URL is not configured');
  }

  // Check if endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  try {
    const response = await fetch(`${baseURL}${normalizedEndpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      const apiResponse: ApiResponse = {
        data: data.data,
        statusCode: data.statusCode,
        message: data.message,
      };
      return apiResponse.data as T;
    }

    return null as T;
  } catch (error) {
    throw error;
  }
}

export default client;
