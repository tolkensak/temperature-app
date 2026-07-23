// pages/HomePage.tsx
import React, { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { BoilingVerdict, CelsiusInput, FahrenheitInput } from "../components/BoilingVerdict";

export function HomePage() {
    const celsius = useAppStore((state) => state.celsius);
    const fahrenheit = useAppStore((state) => state.fahrenheit);
    const history = useAppStore((state) => state.history);
    const isTimerRunning = useAppStore((state) => state.isTimerRunning);
    const setCelsius = useAppStore((state) => state.setCelsius);
    const setFahrenheit = useAppStore((state) => state.setFahrenheit);
    const toggleTimer = useAppStore((state) => state.toggleTimer);
    const resetAll = useAppStore((state) => state.resetAll);
    const clearHistory = useAppStore((state) => state.clearHistory);
    const addHistory = useAppStore((state) => state.addHistory);
    const temperatureDisplay = useAppStore((state) => state.temperatureDisplay);
    const canAddHistory = useAppStore((state) => state.canAddHistory);
    const historyPanelRef = useRef<HTMLDivElement | null>(null);

    // Timer effect - now using Zustand!
    useEffect(() => {
        if (!isTimerRunning) return;

        const interval = setInterval(() => {
            setCelsius(celsius + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [isTimerRunning, celsius, setCelsius]);

    // Add to history when celsius changes
    useEffect(() => {
        if (canAddHistory) {
            addHistory(`🌡️ ${temperatureDisplay()} at ${new Date().toLocaleTimeString()}`);
        }
    }, [celsius, addHistory, canAddHistory]);

    const handleReset = useCallback(() => {
        resetAll();
        clearHistory();
    }, [resetAll, clearHistory]);

    const handleToggleTimer = useCallback(() => {
        toggleTimer();
    }, [toggleTimer]);

    const handleScrollToHistory = useCallback(() => {
        historyPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <div>
            <h2>🏠 Home</h2>

            <div className="space-top-2"><Link to="/settings" className="link-a">⚙️ Link to Settings Page</Link></div>
            <div className="space-top"><Link to="/xxx" className="link-a">🚫 Test Not Found Page (404)</Link></div>

            <div className="space-top-2">
                <CelsiusInput celsius={celsius} onCelsiusChange={(e) => setCelsius(Number(e.target.value))} />
            </div>
            <div className="space-top">
                <FahrenheitInput fahrenheit={fahrenheit} onFahrenheitChange={(e) => setFahrenheit(Number(e.target.value))} />
            </div>

            <div className="space-top-1">
                <BoilingVerdict celsius={celsius} />
            </div>

            <div className="space-top-2">
                <button onClick={handleReset}>🔄️ Reset</button>
                <button onClick={handleToggleTimer} className="space-left">{isTimerRunning ? "⏹️ Stop Timer" : "▶️ Start Timer"}</button>
                <button onClick={handleScrollToHistory} className="space-left">📜 Scroll to History</button>
            </div>

            <div ref={historyPanelRef} className="space-top-2">
                <h4>📜 History</h4>
                {history.length === 0 ? (
                    <div className="gray-text space-top-1">No history yet. Change the temperature!</div>
                ) : (
                    <div>
                        <div className="gray-text space-top-1">Total: {history.length} entries</div>
                        <ul className="space-top-1">
                            {history.map((entry, index) => (
                                <li key={index}>{entry}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
