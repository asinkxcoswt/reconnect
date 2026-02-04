
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
                                                    c.color === 'purple' ? 'bg-purple-600' :
                                                        'bg-yellow-400'
                                            }`}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Field Logic / Finished Screen */}
                    {game.status === 'finished' && (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-700 animate-in fade-in zoom-in duration-300">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4 animate-bounce">💰</div>
                                    <h2 className="text-4xl font-extrabold text-white mb-2">จบเกม!</h2>
                                    <div className="bg-green-500/20 text-green-400 py-2 px-6 rounded-full inline-block font-bold text-xl border border-green-500/50">
                                        เงินรางวัลกองกลาง: ${game.winners?.reduce((sum, w) => sum + w.amountWon, 0) || 0}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {game.players.map(p => {
                                        const win = game.winners?.find(w => w.playerId === p.id);
                                        const loss = game.losers?.find(l => l.playerId === p.id);
                                        const net = (win?.amountWon || 0) - (loss?.amountLost || 0);

                                        return (
                                            <div key={p.id} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-bold text-lg">{p.name}</div>
                                                    {p.id === playerId && <span className="text-xs bg-blue-500 px-2 py-0.5 rounded text-white font-medium uppercase tracking-wider">คุณ</span>}
                                                </div>
                                                <div className={`font-mono font-bold text-lg ${net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {net > 0 ? `+${net}` : net === 0 ? '0' : net}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-2xl font-bold transition-all"
                                    >
                                        กลับสู่ล็อบบี้
                                    </button>
                                    {isHost && (
                                        <button
                                            onClick={onStart}
                                            className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/20 transition-all border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                                        >
                                            รอบถัดไป
                                        </button>
                                    )}
                                </div>
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
