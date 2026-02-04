'use client';

import { useState } from 'react';

interface LobbyProps {
    onCreate: (playerName: string) => void;
    onJoin: (roomId: string, playerName: string) => void;
    loading?: boolean;
}

export function Lobby({ onCreate, onJoin, loading }: LobbyProps) {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Social Identity Map</h1>
                    <p className="text-gray-400">แบ่งปันเรื่องราวของคุณผ่านลักษณะเฉพาะตัว</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            ชื่อของคุณ
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="ใส่ชื่อของคุณ"
                        />
                    </div>

                    {!isJoining ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => playerName && onCreate(playerName)}
                                disabled={!playerName || loading}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                className="w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
                            >
                                เข้าร่วมห้องที่มีอยู่
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    รหัสห้อง
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="ใส่รหัสห้อง"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsJoining(false)}
                                    className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
                                >
                                    กลับ
                                </button>
                                <button
                                    onClick={() => playerName && roomId && onJoin(roomId, playerName)}
                                    disabled={!playerName || !roomId || loading}
                                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
