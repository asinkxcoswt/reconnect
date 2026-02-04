
import React from 'react';
import { Card as CardType } from '@/lib/gameModel';
import { Card } from './Card';

interface PlayerHandProps {
    hand: CardType[];
    selectedCardIds: string[];
    onToggleCard: (id: string) => void;
}

export function PlayerHand({ hand, selectedCardIds, onToggleCard }: PlayerHandProps) {
    return (
        <div className="flex justify-center -space-x-4 p-4 min-h-[140px]">
            {hand.map((card) => (
                <Card
                    key={card.id}
                    color={card.color}
                    selected={selectedCardIds.includes(card.id)}
                    onClick={() => onToggleCard(card.id)}
                />
            ))}
        </div>
    );
}
