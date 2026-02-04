'use client';

import { useState, useEffect } from 'react';
import { GameState, IdentityMap, Player } from '@/lib/games/social-identity-map/model';
import { IdentityMapEditor } from './IdentityMapEditor';

interface GameRoomProps {
    game: GameState;
    playerId: string;
    onUpdateMap: (subjectId: string, map: IdentityMap) => Promise<void>;
    onSetPresenter: (presenterId: string | null, subjectId: string | null) => Promise<void>;
}

export function GameRoom({ game, playerId, onUpdateMap, onSetPresenter }: GameRoomProps) {
    const [activeSubjectId, setActiveSubjectId] = useState<string>(playerId);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const me = game.players.find(p => p.id === playerId);
    const presenter = game.presenterId ? game.players.find(p => p.id === game.presenterId) : null;
    const presentingSubject = game.presentingSubjectId ? game.players.find(p => p.id === game.presentingSubjectId) : null;

    const isPresenting = game.presenterId === playerId;

    // Determine what map to show
    let viewMap: IdentityMap | null = null;
    let viewTitle = "";
    let isReadOnly = false;

    if (game.presenterId) {
        // Someone is sharing
        const p = game.players.find(p => p.id === game.presenterId);
        if (p && game.presentingSubjectId) {
            viewMap = p.maps[game.presentingSubjectId] || { given: [], chosen: [], core: [] };
            viewTitle = `${p.name} กำลังแบ่งปันแผนที่ของ ${presentingSubject?.name}`;
            isReadOnly = !isPresenting;
        }
    } else {
        // Nobody is sharing, show local editor
        const subject = game.players.find(p => p.id === activeSubjectId);
        viewMap = me?.maps[activeSubjectId] || { given: [], chosen: [], core: [] };
        viewTitle = activeSubjectId === playerId ? "แผนที่ตัวตนของคุณ" : `กำลังร่างแผนที่ให้ ${subject?.name}`;
        isReadOnly = false;
    }

    const handleSetPresenter = async (pId: string | null, sId: string | null) => {
        if (isPending) return;
        setIsPending(true);
        try {
            await onSetPresenter(pId, sId);
        } finally {
            setIsPending(false);
        }
    };

    const handleUpdateMap = async (subjectId: string, map: IdentityMap) => {
        // Updates might be frequent, but let's still prevent concurrent ones if possible
        // or just let it be async. Given it's a map editor, maybe we don't block the whole UI
        // but we should pass the loading state down.
        setIsPending(true);
        try {
            await onUpdateMap(subjectId, map);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col md:flex-row text-white overflow-hidden">
            {/* Sidebar - Hidden on mobile unless toggled */}
            <div className={`
                ${isSidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} 
                md:relative md:flex md:w-64 bg-neutral-800 border-r border-neutral-700 p-4 flex-col
            `}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">ห้อง: {game.roomId}</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">ผู้เล่น</p>
                        <div className="space-y-1">
                            {game.players.map(p => (
                                <button
                                    key={p.id}
                                    disabled={!!game.presenterId || isPending}
                                    onClick={() => {
                                        setActiveSubjectId(p.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full p-2 rounded text-left flex items-center justify-between transition ${activeSubjectId === p.id && !game.presenterId
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-neutral-700 text-gray-300'
                                        } ${game.presenterId === p.id ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <span className="truncate">{p.name} {p.id === playerId && '(คุณ)'}</span>
                                    {game.presenterId === p.id && (
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-700 space-y-3">
                    {/* Controls */}
                    {game.presenterId === null ? (
                        <button
                            onClick={() => handleSetPresenter(playerId, activeSubjectId)}
                            disabled={isPending}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            แบ่งปันแผนที่นี้
                        </button>
                    ) : isPresenting ? (
                        <button
                            onClick={() => handleSetPresenter(null, null)}
                            disabled={isPending}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition animate-pulse flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            หยุดแบ่งปัน
                        </button>
                    ) : (
                        <div className="text-center p-3 bg-blue-900/30 border border-blue-500/50 rounded text-sm text-blue-300">
                            กำลังดูการนำเสนอของ {presenter?.name}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
                {/* Header */}
                <div className="h-16 border-b border-neutral-700 flex items-center justify-between px-4 md:px-6 bg-neutral-800/50 flex-shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg md:text-xl font-semibold truncate">{viewTitle}</h1>
                    </div>
                    <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap ${isReadOnly ? 'bg-amber-900/50 text-amber-500' : 'bg-green-900/50 text-green-500'}`}>
                        {isReadOnly ? 'อ่านอย่างเดียว' : 'กำลังแก้ไข'}
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto bg-neutral-900 pb-20 md:pb-8">
                    {viewMap && (
                        <div className="min-h-full flex items-start justify-center p-4">
                            <IdentityMapEditor
                                map={viewMap}
                                readOnly={isReadOnly}
                                loading={isPending}
                                onChange={(newMap) => handleUpdateMap(activeSubjectId, newMap)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
