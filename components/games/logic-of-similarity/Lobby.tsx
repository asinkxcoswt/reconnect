
'use client';
import React, { useState } from 'react';

interface LobbyProps {
    onJoin: (roomId: string, playerName: string) => void;
    onCreate: (playerName: string) => void;
    loading?: boolean;
}

export function Lobby({ onJoin, onCreate, loading }: LobbyProps) {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <div className="w-full max-w-md bg-neutral-800 p-8 rounded-2xl shadow-xl space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Logic of Similarity
                    </h1>
                    <p className="text-gray-400">ความจริงที่คุณเลือกเผย</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">ชื่อของคุณ</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="ใส่ชื่อของคุณ"
                        />
                    </div>

                    {!isJoining ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => playerName && onCreate(playerName)}
                                disabled={!playerName || loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                สร้างห้องใหม่
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-neutral-800 text-gray-400">หรือ</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsJoining(true)}
                                className="w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition cursor-pointer"
                            >
                                เข้าร่วมห้องที่มีอยู่
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    รหัสห้อง (เพื่อเข้าร่วม)
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    placeholder="เช่น x7z9q2"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsJoining(false)}
                                    className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition cursor-pointer"
                                >
                                    กลับ
                                </button>
                                <button
                                    onClick={() => playerName && roomId && onJoin(roomId, playerName)}
                                    disabled={!playerName || !roomId || loading}
                                    className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    เข้าร่วมห้อง
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
