'use client';

import { useState, useEffect } from 'react';
import { GameState, IdentityMap, Player } from '@/lib/games/social-identity-map/model';
import { IdentityMapEditor } from './IdentityMapEditor';

interface GameRoomProps {
    game: GameState;
    playerId: string;
    onUpdateMap: (map: IdentityMap) => void;
    onSetPresenter: (presenterId: string | null) => void;
}

export function GameRoom({ game, playerId, onUpdateMap, onSetPresenter }: GameRoomProps) {
    const me = game.players.find(p => p.id === playerId);
    const presenter = game.presenterId ? game.players.find(p => p.id === game.presenterId) : null;

    // Derived state: are we viewing the presenter or our own editor?
    // If there is a presenter, we view them (unless we are the presenter).
    // If no presenter, we view our own editor.

    const isPresenting = game.presenterId === playerId;

    // If I am presenting, I see my map (editable? maybe not while presenting to avoid jitter, but let's allow it).
    // If someone else is presenting, I see their map (read-only).

    const viewTargetPlayer = presenter || me;

    // For the list of players sidebar
    const otherPlayers = game.players.filter(p => p.id !== playerId);

    return (
        <div className="min-h-screen bg-neutral-900 flex text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Participants ({game.players.length})</h2>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {game.players.map(p => (
                        <div key={p.id} className={`p-3 rounded-lg flex items-center justify-between ${p.id === game.presenterId ? 'bg-blue-900/50 border border-blue-500' : 'bg-neutral-700'}`}>
                            <span className="font-medium truncate">{p.name} {p.id === playerId && '(You)'}</span>
                            {p.id === game.presenterId && (
                                <span className="text-xs text-blue-300 bg-blue-900 px-2 py-0.5 rounded-full">Presenting</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-700">
                    <p className="text-sm text-gray-400 mb-2">Room: {game.roomId}</p>

                    {/* Controls */}
                    {game.presenterId === null ? (
                        <button
                            onClick={() => onSetPresenter(playerId)}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition"
                        >
                            Share My Map
                        </button>
                    ) : isPresenting ? (
                        <button
                            onClick={() => onSetPresenter(null)}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition animate-pulse"
                        >
                            Stop Sharing
                        </button>
                    ) : (
                        <div className="text-center text-sm text-yellow-500 animate-pulse">
                            {presenter?.name} is sharing...
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-neutral-700 flex items-center justify-between px-6 bg-neutral-800/50">
                    <h1 className="text-xl font-semibold">
                        {game.presenterId ? `${presenter?.name}'s Identity Map` : 'Your Identity Map'}
                    </h1>
                    <div className="text-sm text-gray-400">
                        {game.presenterId ? 'View Only' : 'Editing Mode'}
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-auto bg-neutral-900 p-8 flex items-center justify-center">
                    {viewTargetPlayer && (
                        <div className="transform scale-75 md:scale-100 transition-transform duration-500">
                            <IdentityMapEditor
                                map={viewTargetPlayer.map}
                                readOnly={!!game.presenterId && !isPresenting}
                                onChange={(!game.presenterId || isPresenting) ? onUpdateMap : undefined}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
