import { toast } from 'sonner';

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
     console.log('client', `${baseURL}${normalizedEndpoint}`);
     console.log('config', config)
    const response = await fetch(`${baseURL}${normalizedEndpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    console.log(response);

    if (!response.ok) {
      const errorMessage = await response.text();
      const defaultError = response.status >= 500 
        ? 'Internal server error.'
        : 'An error occurred.';

      // Only show toast error once with appropriate message
      toast.error(errorMessage || defaultError);
      throw new Error(errorMessage || defaultError);
    }


    const data = await response.json();
    console.log(data);
    return data as T;
  } catch (error) {
    // Only show toast error if it wasn't already shown from response error
    if (!(error instanceof Error && error.message.includes('error'))) {
      toast.error('An unexpected error occurred');
    }
    throw error;
  }
}

export default client;
