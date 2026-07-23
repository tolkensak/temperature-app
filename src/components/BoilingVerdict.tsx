// components/BoilingVerdict.tsx
import React from 'react';

export const BoilingVerdict = React.memo(function BoilingVerdict({ celsius }: { celsius: number }) {
    let message;
    let color;

    if (celsius >= 100) {
        message = "🔥 Water is BOILING!";
        color = "red";
    } else if (celsius <= 0) {
        message = "❄️ Water is FROZEN!";
        color = "blue";
    } else {
        message = "💧 Water is liquid.";
        color = "green";
    }

    return <span style={{ color }}>{message}</span>;
});

interface CelsiusInputArgs {
    celsius: number;
    onCelsiusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CelsiusInput = React.memo(function CelsiusInputFunc({ celsius, onCelsiusChange }: CelsiusInputArgs) {
    return (
        <div>
            <label htmlFor="celsius-input">Enter celsius </label>
            <input id="celsius-input" type="number" className="space-left" value={celsius} onChange={onCelsiusChange} />
        </div>
    );
});

interface FahrenheitInputArgs {
    fahrenheit: number;
    onFahrenheitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FahrenheitInput = React.memo(function FahrenheitInputFunc({ fahrenheit, onFahrenheitChange }: FahrenheitInputArgs) {
    return (
        <div>
            <label htmlFor="fahrenheit-input">Enter fahrenheit </label>
            <input id="fahrenheit-input" type="number" className="space-left" value={fahrenheit} onChange={onFahrenheitChange} />
        </div>
    );
});
