// hooks/useWeatherApi.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import useAppStore from '../store/useAppStore';

export interface WeatherData {
    city: string;
    temperature: number;
    weatherCode: number;
    windSpeed: number;
}

interface City {
    lat: number;
    lon: number;
    text: string;
}

type Cities = Record<string, City>;

// City coordinates
const cities: Cities = {
    Almaty: { lat: 43.2516, lon: 76.9089, text: "🇰🇿 Almaty" },
    "New York": { lat: 40.7143, lon: -74.006, text: "🗽 New York" },
    London: { lat: 51.5074, lon: -0.1278, text: "🇬🇧 London" },
    Tokyo: { lat: 35.6895, lon: 139.6917, text: "🇯🇵 Tokyo" },
    Sydney: { lat: -33.8688, lon: 151.2093, text: "🇦🇺 Sydney" },
    Moscow: { lat: 55.7558, lon: 37.6173, text: "🇷🇺 Moscow" },
    Dubai: { lat: 25.2048, lon: 55.2708, text: "🇦🇪 Dubai" },
    Singapore: { lat: 1.3521, lon: 103.8198, text: "🇸🇬 Singapore" },
    "Cape Town": { lat: -33.9249, lon: 18.4241, text: "🇿🇦 Cape Town" },
};

// Weather code mapping
const weatherCodes: Record<number, string> = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    51: "🌧️ Light drizzle",
    61: "🌧️ Rain",
    71: "❄️ Snow fall",
    80: "🌧️ Rain showers",
    95: "⛈️ Thunderstorm",
};

const weatherDescription = (weatherCode: number): string => {
    return weatherCodes[weatherCode] || 'Unknown';
};

// ✅ Fixed: BASE_URL should be a function, not a constant
const buildWeatherUrl = (cityName: string): string => {
    const location = cities[cityName] || cities["Almaty"];
    return `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`;
};

// ✅ Create a weather API client
export const weatherApi = {
    getWeather: async (city: string): Promise<WeatherData> => {
        // ✅ The API returns data in a specific format
        const response = await api.get<any>(buildWeatherUrl(city));
        
        // ✅ Transform the API response to our WeatherData format
        return {
            city: city,
            temperature: response.current_weather.temperature,
            weatherCode: response.current_weather.weathercode,
            windSpeed: response.current_weather.windspeed,
        };
    },
};

export function useWeatherApi(city: string) {
    const autoRefresh = useAppStore((state) => state.autoRefresh);

    return useQuery({
        queryKey: ['weather', city],
        queryFn: () => weatherApi.getWeather(city),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 2,
        refetchInterval: autoRefresh ? 30000 : false,
    });
}

export { cities, weatherDescription };
