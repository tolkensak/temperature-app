// store/useAppStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
// import logger from './logger';

interface TemperatureUnit {
    name: string;
    sign: string;
}

type TemperatureUnits = Record<string, TemperatureUnit>;

const temperatureUnits: TemperatureUnits = {
    celsius: { name: "Celsius", sign: '°C' },
    fahrenheit: { name: "Fahrenheit", sign: '°F' },
};

interface RoundNumber {
    (num: number, digits?: number): number;
}

const roundNumber: RoundNumber = (num, digits = 2) => {
    const factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
};

interface ConvertCelsiusToFahrenheit {
    (celsius: number): number;
}

const convertCelsiusToFahrenheit: ConvertCelsiusToFahrenheit = (celsius) => {
    return roundNumber(celsius * 9 / 5 + 32);
};

interface ConvertFahrenheitToCelsius {
    (fahrenheit: number): number;
}

const convertFahrenheitToCelsius: ConvertFahrenheitToCelsius = (fahrenheit) => {
    return roundNumber((fahrenheit - 32) * 5 / 9);
};

//---------------------------------------------

interface TemperatureState {
    celsius: number;
    fahrenheit: number;
    history: string[];
    canAddHistory: boolean;
    isTimerRunning: boolean;
    // Temperature actions
    setCelsius: (value: number) => void;
    setFahrenheit: (value: number) => void;
    addHistory: (entry: string) => void;
    clearHistory: () => void;
    toggleTimer: () => void;
}

type AllowedTemperatureUnits = 'celsius' | 'fahrenheit';

interface SettingsState {
    darkMode: boolean;
    temperatureUnit: AllowedTemperatureUnits;
    autoRefresh: boolean;
    // Settings actions
    toggleDarkMode: () => void;
    toggleAutoRefresh: () => void;
    toggleTemperatureUnit: () => void;
}

interface WeatherState {
    city: string;
    refreshCount: number;
    // Weather actions
    setCity: (city: string) => void;
    ResetRefreshCount: () => void;
    incrementRefreshCount: () => void;
}

// Combined Store Interface
interface AppStore extends TemperatureState, SettingsState, WeatherState {
    // Reset
    resetAll: () => void;
    
    // Computed values
    temperatureDisplay: () => string;
    temperatureUnitDisplay: (unit: AllowedTemperatureUnits) => string;
    weatherTemperatureDisplay: (temperature: number) => string;
}

// CREATE THE ZUSTAND STORE!
const useAppStore = create<AppStore>()(
    devtools(
        persist(
            // logger(
                (set, get) => ({
                    // ============ STATE ============

                    // Settings
                    darkMode: false,
                    temperatureUnit: 'celsius',
                    autoRefresh: false,

                    // Temperature
                    celsius: 0,
                    fahrenheit: 32,
                    history: [],
                    canAddHistory: false,
                    isTimerRunning: false,

                    city: 'Almaty',
                    refreshCount: 0,

                    // ============ ACTIONS ============

                    // Settings actions
                    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

                    toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),

                    toggleTemperatureUnit: () => set((state) => ({
                        temperatureUnit: state.temperatureUnit === 'celsius'
                            ? 'fahrenheit'
                            : 'celsius'
                    })),

                    toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),

                    // Temperature actions
                    setCelsius: (value) => set((state) => ({
                        celsius: value,
                        fahrenheit: convertCelsiusToFahrenheit(value),
                        canAddHistory: true,
                    })),

                    setFahrenheit: (value) => set((state) => ({
                        celsius: convertFahrenheitToCelsius(value),
                        fahrenheit: value,
                        canAddHistory: true,
                    })),

                    addHistory: (entry) => set((state) => ({
                        history: [...state.history, entry],
                        canAddHistory: false,
                    })),

                    clearHistory: () => set({ history: [] }),

                    setCity: (city) => set({ city }),

                    ResetRefreshCount: () => set((state) => ({ refreshCount: 0 })),
                    incrementRefreshCount: () => set((state) => ({ refreshCount: state.refreshCount + 1 })),

                    // Reset
                    resetAll: () => set({
                        celsius: 0,
                        fahrenheit: 32,
                        history: [],
                        isTimerRunning: false,
                    }),

                    // ============ COMPUTED VALUES ============

                    temperatureUnitDisplay: (unit) => {
                        return `${temperatureUnits[unit].name} (${temperatureUnits[unit].sign})`;
                    },

                    temperatureDisplay: () => {
                        const state = get();
                        const value = state.temperatureUnit === 'celsius' ? state.celsius : state.fahrenheit;
                        return `${value}${temperatureUnits[state.temperatureUnit].sign}`;
                    },

                    weatherTemperatureDisplay: (temperature) => {
                        const state = get();
                        const temp = state.temperatureUnit === 'fahrenheit' ? convertCelsiusToFahrenheit(temperature) : temperature;
                        return `${temp}${temperatureUnits[state.temperatureUnit].sign}`;
                    },

                }),
                {
                    name: 'temperature-app-storage', // localStorage key
                    partialize: (state) => ({
                        // Only persist these fields
                        darkMode: state.darkMode,
                        temperatureUnit: state.temperatureUnit,
                        celsius: state.celsius,
                        fahrenheit: state.fahrenheit,
                        history: state.history,
                        city: state.city,
                        autoRefresh: state.autoRefresh,
                    }),
                }
            // )
        ),
        { name: 'Temperature App' } // DevTools label
    )
);

export default useAppStore;
