// useAppStoreHooks.ts
import useAppStore from '../store/useAppStore';

export const useDarkMode = () => {
    const darkMode = useAppStore((state) => state.darkMode);
    const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

    return { darkMode, toggleDarkMode };
};

export const useCelsius = () => {
    const celsius = useAppStore((state) => state.celsius);
    const setCelsius = useAppStore((state) => state.setCelsius);

    return { celsius, setCelsius };
};

export const useFahrenheit = () => {
    const fahrenheit = useAppStore((state) => state.fahrenheit);
    const setFahrenheit = useAppStore((state) => state.setFahrenheit);

    return { fahrenheit, setFahrenheit };
};

export const useHistory = () => {
    const history = useAppStore((state) => state.history);
    const addHistory = useAppStore((state) => state.addHistory);
    const clearHistory = useAppStore((state) => state.clearHistory);

    return { history, addHistory, clearHistory };
};

export const useCity = () => {
    const city = useAppStore((state) => state.city);
    const setCity = useAppStore((state) => state.setCity);

    return { city, setCity };
};

export const useRefreshCount = () => {
    const refreshCount = useAppStore((state) => state.refreshCount);
    const incrementRefreshCount = useAppStore((state) => state.incrementRefreshCount);

    return { refreshCount, incrementRefreshCount };
};

export const useAutoRefresh = () => {
    const autoRefresh = useAppStore((state) => state.autoRefresh);
    const toggleAutoRefresh = useAppStore((state) => state.toggleAutoRefresh);

    return { autoRefresh, toggleAutoRefresh };
};

export const useTemperatureUnit = () => {
    const temperatureUnit = useAppStore((state) => state.temperatureUnit);
    const toggleTemperatureUnit = useAppStore((state) => state.toggleTemperatureUnit);

    return { temperatureUnit, toggleTemperatureUnit };
};

export const useTimer = () => {
    const isTimerRunning = useAppStore((state) => state.isTimerRunning);
    const toggleTimer = useAppStore((state) => state.toggleTimer);

    return { isTimerRunning, toggleTimer };
};

export const useUtil = () => {
    const resetAll = useAppStore((state) => state.resetAll);
    const temperatureDisplay = useAppStore((state) => state.temperatureDisplay);
    const temperatureUnitDisplay = useAppStore((state) => state.temperatureUnitDisplay);
    const weatherTemperatureDisplay = useAppStore((state) => state.weatherTemperatureDisplay);

    return {
        resetAll,
        temperatureDisplay,
        temperatureUnitDisplay,
        weatherTemperatureDisplay,
    };
};
