// pages/WeatherPage.tsx
import { useCallback } from 'react';
import { useWeatherApi, cities, weatherDescription } from '../hooks/useWeatherApi';
import useAppStore from '../store/useAppStore';

export function WeatherPage() {
    const city = useAppStore((state) => state.city);
    const setCity = useAppStore((state) => state.setCity);
    const refreshCount = useAppStore((state) => state.refreshCount);
    const ResetRefreshCount = useAppStore((state) => state.ResetRefreshCount);
    const incrementRefreshCount = useAppStore((state) => state.incrementRefreshCount);
    const weatherTemperatureDisplay = useAppStore((state) => state.weatherTemperatureDisplay);

    // React Query - handles loading, error, data, caching, and refetching!
    const {
        data: weatherData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useWeatherApi(city);

    const handleCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setCity(e.target.value);
        ResetRefreshCount();
    }, [setCity, ResetRefreshCount]);

    const handleRefresh = useCallback(() => {
        refetch();
        incrementRefreshCount();
    }, [refetch, incrementRefreshCount]);

    return (
        <div>
            <h2>🌤️ Weather</h2>

            <div className="wrap-box space-top-2">
                {isLoading && <div>⏳ Loading weather data...</div>}
                {error && <div className="error">❌ {(error as Error).message}</div>}
                {weatherData && !isLoading && !error && (
                    <div>
                        <h4>📍 {weatherData.city}</h4>
                        <div className="space-top">{weatherDescription(weatherData.weatherCode)}</div>
                        <div className="space-top">
                            🌡️ Temperature: {weatherTemperatureDisplay(weatherData.temperature)}
                        </div>
                        <div className="space-top">💨 Wind Speed: {weatherData.windSpeed} km/h</div>
                        {isFetching && <div className="space-top">🔄 Refreshing...</div>}
                    </div>
                )}
            </div>

            <div className="space-top-2">
                <select value={city} onChange={handleCityChange}>
                    {Object.entries(cities).map(([cityName, cityData]) => (
                        <option key={cityName} value={cityName}>{cityData.text}</option>
                    ))}
                </select>

                <button className="space-left" onClick={handleRefresh}>
                    {isFetching ? '⏳ Refreshing...' : '🔄 Refresh'}
                </button>
            </div>

            <div className="space-top-2 gray-text">
                Weather has refreshed {refreshCount} times.
            </div>
        </div>
    );
}