// pages/HomePage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';  // ✅ fireEvent imported
import { BrowserRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import useAppStore from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
    default: vi.fn(),
}));

describe('SettingsPage', () => {
    it('renders the settings page', () => {
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                darkMode: false,
                autoRefresh: false,
                temperatureUnit: 'celsius',
                toggleDarkMode: vi.fn(),
                toggleAutoRefresh: vi.fn(),
                toggleTemperatureUnit: vi.fn(),
                temperatureUnitDisplay: () => 'Fahrenheit (°F)',
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('⚙️ Settings')).toBeInTheDocument();
        expect(screen.getByText('🌙 Switch to Dark Mode')).toBeInTheDocument();
        expect(screen.getByText('▶️ Enable Auto-Refresh')).toBeInTheDocument();
        expect(screen.getByText('🌡️ Switch to Fahrenheit (°F)')).toBeInTheDocument();
    });

    it('calls toggleDarkMode when Switch to Dark Mode button is clicked', () => {
        const mockFunctionToTest = vi.fn();

        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                darkMode: false,
                autoRefresh: false,
                temperatureUnit: 'celsius',
                toggleDarkMode: mockFunctionToTest,
                toggleAutoRefresh: vi.fn(),
                toggleTemperatureUnit: vi.fn(),
                temperatureUnitDisplay: () => 'Fahrenheit (°F)',
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        const buttonToTest = screen.getByText('🌙 Switch to Dark Mode');
        fireEvent.click(buttonToTest);
        expect(mockFunctionToTest).toHaveBeenCalled();
    });

    it('calls toggleAutoRefresh when Enable Auto-Refresh button is clicked', () => {
        const mockFunctionToTest = vi.fn();

        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                darkMode: false,
                autoRefresh: false,
                temperatureUnit: 'celsius',
                toggleDarkMode: vi.fn(),
                toggleAutoRefresh: mockFunctionToTest,
                toggleTemperatureUnit: vi.fn(),
                temperatureUnitDisplay: () => 'Fahrenheit (°F)',
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        const buttonToTest = screen.getByText('▶️ Enable Auto-Refresh');
        fireEvent.click(buttonToTest);
        expect(mockFunctionToTest).toHaveBeenCalled();
    });

    it('calls toggleTemperatureUnit when Switch to Fahrenheit (°F) button is clicked', () => {
        const mockFunctionToTest = vi.fn();

        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                darkMode: false,
                autoRefresh: false,
                temperatureUnit: 'celsius',
                toggleDarkMode: vi.fn(),
                toggleAutoRefresh: vi.fn(),
                toggleTemperatureUnit: mockFunctionToTest,
                temperatureUnitDisplay: () => 'Fahrenheit (°F)',
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        const buttonToTest = screen.getByText('🌡️ Switch to Fahrenheit (°F)');
        fireEvent.click(buttonToTest);
        expect(mockFunctionToTest).toHaveBeenCalled();
    });
});
