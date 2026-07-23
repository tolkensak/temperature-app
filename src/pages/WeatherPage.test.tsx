// pages/WeatherPage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ IMPORT THIS!
import { WeatherPage } from './WeatherPage';
import useAppStore from '../store/useAppStore';

// Mock the store
vi.mock('../store/useAppStore', () => ({
    default: vi.fn(),
}));

// ✅ Mock the useWeatherQuery hook
vi.mock('../hooks/useWeatherQuery', () => ({
    useWeatherQuery: vi.fn(),
    cities: {
        Almaty: { lat: 43.2516, lon: 76.9089, text: "🇰🇿 Almaty" },
        "New York": { lat: 40.7143, lon: -74.006, text: "🗽 New York" },
        London: { lat: 51.5074, lon: -0.1278, text: "🇬🇧 London" },
        Tokyo: { lat: 35.6895, lon: 139.6917, text: "🇯🇵 Tokyo" },
    },
    weatherDescription: vi.fn((code) => {
        const codes: Record<number, string> = {
            0: '☀️ Clear sky',
            1: '🌤️ Mainly clear',
            2: '⛅ Partly cloudy',
            3: '☁️ Overcast',
        };
        return codes[code] || 'Unknown';
    }),
}));

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

describe('WeatherPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                city: 'Almaty',
                setCity: vi.fn(),
                refreshCount: 0,
                ResetRefreshCount: vi.fn(),
                incrementRefreshCount: vi.fn(),
                weatherTemperatureDisplay: (temp: number) => `${temp}°C`,
                autoRefresh: false,
            };
            return selector(state);
        });
    });

    it('renders the weather page with loading state', async () => {
        // ✅ Mock useWeatherQuery to return loading state
        const { useWeatherQuery } = await import('../hooks/useWeatherQuery');
        (useWeatherQuery as any).mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(
            <QueryClientProvider client={new QueryClient()}>
                <WeatherPage />
            </QueryClientProvider>
        );

        expect(screen.getByText('🌤️ Weather')).toBeInTheDocument();
        expect(screen.getByText('⏳ Loading weather data...')).toBeInTheDocument();
    });

    it('renders the weather page with data', async () => {
        // ✅ Mock useWeatherQuery to return data
        const { useWeatherQuery } = await import('../hooks/useWeatherQuery');
        (useWeatherQuery as any).mockReturnValue({
            data: {
                city: 'Almaty',
                temperature: 25,
                weatherCode: 0,
                windSpeed: 10,
            },
            isLoading: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(
            <QueryClientProvider client={new QueryClient()}>
                <WeatherPage />
            </QueryClientProvider>
        );

        expect(screen.getByText('🌤️ Weather')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('📍 Almaty')).toBeInTheDocument();
        });
        expect(screen.getByText('☀️ Clear sky')).toBeInTheDocument();
        expect(screen.getByText('🌡️ Temperature: 25°C')).toBeInTheDocument();
        expect(screen.getByText('💨 Wind Speed: 10 km/h')).toBeInTheDocument();
    });

    it('renders the weather page with error state', async () => {
        // ✅ Mock useWeatherQuery to return error
        const { useWeatherQuery } = await import('../hooks/useWeatherQuery');
        (useWeatherQuery as any).mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
            error: new Error('Failed to fetch weather'),
            refetch: vi.fn(),
            isFetching: false,
        });

        render(
            <QueryClientProvider client={new QueryClient()}>
                <WeatherPage />
            </QueryClientProvider>
        );

        expect(screen.getByText('🌤️ Weather')).toBeInTheDocument();
        expect(screen.getByText('❌ Failed to fetch weather')).toBeInTheDocument();
    });

    it('calls refetch when refresh button is clicked', async () => {
        const mockRefetch = vi.fn();
        const mockIncrementRefreshCount = vi.fn();

        // ✅ Update store mock to include the increment function
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                city: 'Almaty',
                setCity: vi.fn(),
                refreshCount: 0,
                ResetRefreshCount: vi.fn(),
                incrementRefreshCount: mockIncrementRefreshCount,
                weatherTemperatureDisplay: (temp: number) => `${temp}°C`,
                autoRefresh: false,
            };
            return selector(state);
        });

        // ✅ Mock useWeatherQuery
        const { useWeatherQuery } = await import('../hooks/useWeatherQuery');
        (useWeatherQuery as any).mockReturnValue({
            data: {
                city: 'Almaty',
                temperature: 25,
                weatherCode: 0,
                windSpeed: 10,
            },
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
            isFetching: false,
        });

        render(
            <QueryClientProvider client={new QueryClient()}>
                <WeatherPage />
            </QueryClientProvider>
        );

        const refreshButton = screen.getByText('🔄 Refresh');
        await userEvent.click(refreshButton);

        expect(mockRefetch).toHaveBeenCalled();
        expect(mockIncrementRefreshCount).toHaveBeenCalled();
    });
});