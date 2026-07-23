// pages/HomePage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';  // ✅ fireEvent imported
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import useAppStore from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
    default: vi.fn(),
}));

describe('HomePage', () => {
    it('renders the home page title', () => {
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                celsius: 0,
                fahrenheit: 32,
                history: [],
                isTimerRunning: false,
                setCelsius: vi.fn(),
                setFahrenheit: vi.fn(),
                toggleTimer: vi.fn(),
                resetAll: vi.fn(),
                clearHistory: vi.fn(),
                addHistory: vi.fn(),
                temperatureDisplay: () => '0°C',
                canAddHistory: false,
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        expect(screen.getByText('🏠 Home')).toBeInTheDocument();
        expect(screen.getByText('❄️ Water is FROZEN!')).toBeInTheDocument();
    });

    it('displays the correct temperature', () => {
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                celsius: 25,
                fahrenheit: 77,
                history: [],
                isTimerRunning: false,
                setCelsius: vi.fn(),
                setFahrenheit: vi.fn(),
                toggleTimer: vi.fn(),
                resetAll: vi.fn(),
                clearHistory: vi.fn(),
                addHistory: vi.fn(),
                temperatureDisplay: () => '25°C',
                canAddHistory: false,
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        const celsiusInput = screen.getByDisplayValue('25');
        expect(celsiusInput).toBeInTheDocument();
    });

    it('calls toggleTimer when Start Timer button is clicked', () => {
        const mockToggleTimer = vi.fn();

        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                celsius: 0,
                fahrenheit: 32,
                history: [],
                isTimerRunning: false,
                setCelsius: vi.fn(),
                setFahrenheit: vi.fn(),
                toggleTimer: mockToggleTimer,
                resetAll: vi.fn(),
                clearHistory: vi.fn(),
                addHistory: vi.fn(),
                temperatureDisplay: () => '0°C',
                canAddHistory: false,
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        const startButton = screen.getByText('▶️ Start Timer');
        fireEvent.click(startButton);  // ✅ Now fireEvent is defined!
        expect(mockToggleTimer).toHaveBeenCalled();
    });

    it('shows "No history yet" when history is empty', () => {
        (useAppStore as any).mockImplementation((selector: any) => {
            const state = {
                celsius: 0,
                fahrenheit: 32,
                history: [],
                isTimerRunning: false,
                setCelsius: vi.fn(),
                setFahrenheit: vi.fn(),
                toggleTimer: vi.fn(),
                resetAll: vi.fn(),
                clearHistory: vi.fn(),
                addHistory: vi.fn(),
                temperatureDisplay: () => '0°C',
                canAddHistory: false,
            };
            return selector(state);
        });

        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        expect(screen.getByText('No history yet. Change the temperature!')).toBeInTheDocument();
    });
});
