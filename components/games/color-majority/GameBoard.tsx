
'use client';
import React, { useState, useEffect } from 'react';
import { GameState, Card as CardType } from '@/lib/gameModel';
import { Card } from './Card';
import { PlayerHand } from './PlayerHand';

interface GameBoardProps {
    game: GameState;
    playerId: string;
    onRefresh: () => void;
    onAction: (action: 'play', subAction?: string, cardIds?: string[]) => Promise<void>;
    onStart: () => Promise<void>;
}

export function GameBoard({ game, playerId, onRefresh, onAction, onStart }: GameBoardProps) {
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

    const me = game.players.find(p => p.id === playerId);
    const isMyTurn = game.status === 'playing' && game.players[game.currentPlayerIndex].id === playerId;
    const isHost = game.hostId === playerId;

    if (!me) return <div>ข้อผิดพลาด: ไม่พบผู้เล่นในเกม</div>;

    const toggleCard = (id: string) => {
        if (selectedCardIds.includes(id)) {
            setSelectedCardIds(selectedCardIds.filter(c => c !== id));
        } else {
            // Validation: Can only select same color
            const card = me.hand.find(c => c.id === id);
            if (!card) return;

            if (selectedCardIds.length > 0) {
                const firstCard = me.hand.find(c => c.id === selectedCardIds[0]);
                if (firstCard && firstCard.color !== card.color) {
                    // Different color, reset selection or ignore? Let's reset to new color
                    setSelectedCardIds([id]);
                    return;
                }
            }
            setSelectedCardIds([...selectedCardIds, id]);
        }
    };

    const handleReveal = async () => {
        if (selectedCardIds.length === 0) return;
        await onAction('play', 'reveal', selectedCardIds);
        setSelectedCardIds([]);
    };

    const handleSkip = async () => {
        await onAction('play', 'skip');
        setSelectedCardIds([]);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl">
                <div>
                    <h2 className="text-xl font-bold text-gray-200">ห้อง: {game.roomId}</h2>
                    <p className="text-sm text-gray-400">สถานะ: {game.status}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-400">${me.money}</p>
                    <p className="text-sm text-gray-400">{me.name} (คุณ)</p>
                </div>
            </div>

            {/* Lobby State */}
            {game.status === 'lobby' && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <h2 className="text-2xl font-bold">กำลังรอผู้เล่น...</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {game.players.map(p => (
                            <div key={p.id} className="bg-gray-700 px-6 py-3 rounded-full flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                {p.name} {p.id === game.hostId ? '👑' : ''}
                            </div>
                        ))}
                    </div>
                    {isHost && game.players.length >= 2 && (
                        <button
                            onClick={onStart}
                            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl"
                        >
                            เริ่มเกม
                        </button>
                    )}
                    {isHost && game.players.length < 2 && (
                        <p className="text-yellow-500">ต้องการผู้เล่นอย่างน้อย 2 คนเพื่อเริ่มเกม</p>
                    )}
                    {!isHost && (
                        <p className="animate-pulse text-gray-400">กำลังรอโฮสต์เริ่มเกม...</p>
                    )}
                </div>
            )}

            {/* Game State */}
            {(game.status === 'playing' || game.status === 'finished') && (
                <div className="flex flex-col h-full">
                    {/* Opponents Areas */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        {game.players.filter(p => p.id !== playerId).map(p => (
                            <div key={p.id} className={`bg-gray-800 p-4 rounded-lg border-2 ${game.players[game.currentPlayerIndex].id === p.id ? 'border-yellow-500' : 'border-transparent'}`}>
                                <div className="flex justify-between mb-2">
                                    <span>{p.name}</span>
                                    <span className="text-green-400">${p.money}</span>
                                </div>
                                <div className="flex gap-1 mb-2">
                                    {/* Hidden Hand */}
                                    {Array.from({ length: p.hand.length }).map((_, i) => (
                                        <div key={i} className="w-4 h-6 bg-gray-600 rounded"></div>
                                    ))}
                                </div>
                                <div className="flex gap-1 flex-wrap max-w-[200px]">
                                    {/* Revealed Cards */}
                                    {p.revealedCards.map((c, i) => (
                                        <div key={i} className={`w-6 h-8 rounded ${c.color === 'red' ? 'bg-red-500' :
                                            c.color === 'blue' ? 'bg-blue-500' :
                                                c.color === 'green' ? 'bg-green-500' :
                                                    'bg-yellow-400'
                                            }`}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Field Logic / Finished Screen */}
                    {game.status === 'finished' && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full">
                                <h2 className="text-3xl font-bold mb-4 text-center">จบเกม!</h2>

                                <div className="space-y-4 mb-8">
                                    {game.winners && game.winners.length > 0 && (
                                        <div>
                                            <h3 className="text-green-400 font-bold mb-2">ผู้ชนะ</h3>
                                            {game.winners.map((w, i) => {
                                                const p = game.players.find(pl => pl.id === w.playerId);
                                                return <p key={i}>{p?.name || 'Unknown'} ชนะ ${w.amountWon}</p>
                                            })}
                                        </div>
                                    )}

                                    {game.losers && game.losers.length > 0 && (
                                        <div>
                                            <h3 className="text-red-400 font-bold mb-2">ผู้แพ้</h3>
                                            {game.losers.map((l, i) => {
                                                const p = game.players.find(pl => pl.id === l.playerId);
                                                return <p key={i}>{p?.name || 'Unknown'} แพ้ ${l.amountLost}</p>
                                            })}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold"
                                >
                                    กลับสู่ล็อบบี้
                                </button>
                            </div>
                        </div>
                    )}

                    {/* My Area */}
                    <div className="mt-auto bg-gray-800/50 p-4 rounded-t-3xl backdrop-blur-sm border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">การ์ดที่เปิดเผยแล้วของฉัน</h3>
                                <div className="flex gap-2 mt-2 min-h-[40px]">
                                    {me.revealedCards.map((c, i) => (
                                        <Card key={i} color={c.color} /> // Simplified small card? using normal for now
                                    ))}
                                </div>
                            </div>

                            {isMyTurn ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSkip}
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold"
                                    >
                                        ข้าม
                                    </button>
                                    <button
                                        onClick={handleReveal}
                                        disabled={selectedCardIds.length === 0}
                                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black rounded-lg font-bold"
                                    >
                                        เปิดเผยที่เลือก
                                    </button>
                                </div>
                            ) : (
                                <div className="text-gray-400 italic">
                                    กำลังรอ {game.players[game.currentPlayerIndex]?.name}...
                                </div>
                            )}
                        </div>

                        <PlayerHand
                            hand={me.hand}
                            selectedCardIds={selectedCardIds}
                            onToggleCard={toggleCard}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
