// App.tsx - With Zustand!
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WeatherPage } from "./pages/WeatherPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import useAppStore from "./store/useAppStore";

function Navigation() {
    return (
        <nav className="app-nav">
            <Link className="link" to="/">🏠 Home</Link>
            <Link className="link" to="/weather">🌤️ Weather</Link>
            <Link className="link" to="/settings">⚙️ Settings</Link>
            <Link className="link" to="/about">ℹ️ About</Link>
        </nav>
    );
}

function AppContent() {
    const darkMode = useAppStore((state) => state.darkMode);

    return (
        <div className={`app-content ${darkMode ? "dark-mode" : ""}`}>
            <h1 className="space-top-1">🌡️ Temperature App</h1>
            <div className="space-top-2"><Navigation /></div>
            <div className="space-top-2">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
