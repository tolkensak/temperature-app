// components/BoilingVerdict.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BoilingVerdict } from './BoilingVerdict';

describe('BoilingVerdict', () => {
    it('displays "BOILING!" for 100°C', () => {
        render(<BoilingVerdict celsius={100} />);
        expect(screen.getByText('🔥 Water is BOILING!')).toBeInTheDocument();
    });

    it('displays "FROZEN!" for 0°C', () => {
        render(<BoilingVerdict celsius={0} />);
        expect(screen.getByText('❄️ Water is FROZEN!')).toBeInTheDocument();
    });

    it('displays "liquid" for 25°C', () => {
        render(<BoilingVerdict celsius={25} />);
        expect(screen.getByText('💧 Water is liquid.')).toBeInTheDocument();
    });
});
