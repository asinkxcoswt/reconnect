
import React from 'react';
import { Color } from '@/lib/gameModel';

interface CardProps {
    color: Color;
    onClick?: () => void;
    selected?: boolean;
    hidden?: boolean;
}

const colorMap: Record<Color, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-600',
};

export function Card({ color, onClick, selected, hidden }: CardProps) {
    if (hidden) {
        return (
            <div
                className="w-16 h-24 rounded-lg bg-gray-800 border-2 border-gray-600 shadow-md transform transition-transform hover:-translate-y-1"
            />
        );
    }

    return (
        <div
            onClick={onClick}
            className={`
        w-16 h-24 rounded-lg shadow-md border-2 
        ${colorMap[color]} 
        ${selected ? 'border-white -translate-y-4 shadow-xl' : 'border-black/10'}
        ${onClick ? 'cursor-pointer transform transition-all hover:-translate-y-2' : ''}
        flex items-center justify-center
      `}
        >
            <span className="sr-only">{color}</span>
        </div>
    );
}
