// api.tsx - Fixed version

// ✅ Add this type definition at the top
interface CustomFetchOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

// Core generic fetch wrapper that handles JSON parsing and HTTP errors.
async function http<T>(url: string, options: CustomFetchOptions = {}): Promise<T> {
    const { body, ...customConfig } = options;

    const config: RequestInit = {
        ...customConfig,
        headers: {
            'Content-Type': 'application/json',
            ...(customConfig.headers || {}),
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    // ✅ Make sure we're returning the parsed JSON
    const data = await response.json();
    return data as T;
}

// Typed API methods exposed to the application
export const api = {
    get: <T>(url: string, options?: Omit<CustomFetchOptions, 'body' | 'method'>) => {
        return http<T>(url, {...options, method: 'GET' });
    },

            post: <T>(url: string, body: unknown, options?: Omit<CustomFetchOptions, 'body' | 'method'>) => {
        return http<T>(url, {...options, method: 'POST', body });
    },

                    put: <T>(url: string, body: unknown, options?: Omit<CustomFetchOptions, 'body' | 'method'>) => {
        return http<T>(url, {...options, method: 'PUT', body });
    },

                            delete: <T>(url: string, options?: Omit<CustomFetchOptions, 'body' | 'method'>) => {
        return http<T>(url, {...options, method: 'DELETE' });
    },
};
