// hooks/useWeatherQuery.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeatherQuery } from './useWeatherQuery';
import useAppStore from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
    default: vi.fn(),
}));

// ✅ Use mockImplementation instead of mockResolvedValue
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useWeatherQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = { autoRefresh: false };
            return selector(state);
        });
    });

    it('fetches weather data successfully', async () => {
        const mockWeatherData = {
            current_weather: {
                temperature: 25,
                weathercode: 0,
                windspeed: 10,
            },
        };

        // ✅ Use mockImplementation
        mockFetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockWeatherData),
            });
        });

        const { result } = renderHook(() => useWeatherQuery('Almaty'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual({
            city: 'Almaty',
            temperature: 25,
            weatherCode: 0,
            windSpeed: 10,
        });
    });

    it('handles network errors', async () => {
        // ✅ Use mockImplementation with rejection
        mockFetch.mockImplementation(() => {
            return Promise.reject(new Error('Network error'));
        });

        const { result } = renderHook(() => useWeatherQuery('Almaty'), {
            wrapper: createWrapper(),
        });

        await waitFor(
            () => {
                expect(result.current.isError).toBe(true);
            },
            { timeout: 5000 }
        );

        expect(result.current.error).toBeDefined();
        expect(result.current.error instanceof Error).toBe(true);
    });

    it('handles HTTP errors', async () => {
        // ✅ Use mockImplementation with a response that has ok: false
        mockFetch.mockImplementation(() => {
            return Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: () => Promise.resolve({ message: 'City not found' }),
            });
        });

        const { result } = renderHook(() => useWeatherQuery('Almaty'), {
            wrapper: createWrapper(),
        });

        await waitFor(
            () => {
                expect(result.current.isError).toBe(true);
            },
            { timeout: 5000 }
        );

        expect(result.current.error).toBeDefined();
        // ✅ Now this should work because response.ok is false
        expect(result.current.error?.message).toContain('HTTP error');
        expect(result.current.error?.message).toContain('404');
    });

    it('handles malformed data from API', async () => {
        // ✅ Response with missing current_weather
        mockFetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve({ something: 'unexpected' }),
            });
        });

        const { result } = renderHook(() => useWeatherQuery('Almaty'), {
            wrapper: createWrapper(),
        });

        await waitFor(
            () => {
                expect(result.current.isError).toBe(true);
            },
            { timeout: 5000 }
        );

        expect(result.current.error).toBeDefined();
        expect(result.current.error instanceof Error).toBe(true);
    });
});
