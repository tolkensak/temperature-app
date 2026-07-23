// pages/SettingsPage.tsx
import useAppStore from '../store/useAppStore';

export function SettingsPage() {
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const autoRefresh = useAppStore((state) => state.autoRefresh);
  const toggleAutoRefresh = useAppStore((state) => state.toggleAutoRefresh);
  const temperatureUnit = useAppStore((state) => state.temperatureUnit);
  const toggleTemperatureUnit = useAppStore((state) => state.toggleTemperatureUnit);
  const temperatureUnitDisplay = useAppStore((state) => state.temperatureUnitDisplay);

  return (
    <div>
      <h2>⚙️ Settings</h2>
      <div className="wrap-box space-top-2">
        <h4>Appearance</h4>
        <div className="space-top-1"><button onClick={toggleDarkMode}>{darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}</button></div>
        <div className="space-top-1">Current: {darkMode ? 'Dark' : 'Light'} Mode</div>
      </div>
      <div className="wrap-box space-top-1">
        <h4>Weather</h4>
        <div className="space-top-1"><button onClick={() => toggleAutoRefresh()}>{autoRefresh ? '⏹️ Disable Auto-Refresh' : '▶️ Enable Auto-Refresh'}</button></div>
        <div className="space-top-1">Auto-Refresh: {autoRefresh ? 'Enabled ✅' : 'Disabled ❌'}</div>
      </div>
      <div className="wrap-box space-top-1">
        <h4>Temperature</h4>
        <div className="space-top-1"><button onClick={toggleTemperatureUnit}>🌡️ Switch to {temperatureUnitDisplay(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}</button></div>
        <div className="space-top-1">Current: {temperatureUnitDisplay(temperatureUnit)}</div>
      </div>
    </div>
  );
}
