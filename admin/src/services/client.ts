

const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  data: T;
  statusCode: string;
  message: string;
  error: boolean;
  errorType: string;
}

async function client<T>(
  endpoint: string,
  config: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Check if baseURL is defined
  if (!baseURL) {
    throw new Error('API URL is not configured');
  }

  // Check if endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  console.log(`${baseURL}${normalizedEndpoint}`);
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
      const apiResponse: ApiResponse<T> = {
        data: data.data,
        statusCode: data.statusCode,
        message: data.message,
        error: data.error,
        errorType: data.errorType,
      };
      console.log(apiResponse);
      return apiResponse;
    }

    return {
      data: '',
      statusCode: '',
      message: '',
      error: true,
      errorType: 'Invalid Content-Type',
    } as ApiResponse<T>;
  } catch (error) {
    throw error;
  }
}

export default client;
