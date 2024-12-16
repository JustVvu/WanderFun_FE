
const baseURL = process.env.NEXT_PUBLIC_API_URL;

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
    console.log(response.status);

    const data = await response.json();
    return data as T;
  } catch (error) {
    throw error;
  }
}

export default client;
