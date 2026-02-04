
'use client';
import React, { useState } from 'react';

interface LobbyProps {
    onJoin: (roomId: string, playerName: string) => void;
    onCreate: (playerName: string) => void;
}

export function Lobby({ onJoin, onCreate }: LobbyProps) {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Color Majority
            </h1>

            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อเล่น</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ใส่ชื่อของคุณ"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onCreate(name)}
                        disabled={!name}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        สร้างห้อง
                    </button>
                    <button
                        onClick={() => roomId && onJoin(roomId, name)}
                        disabled={!name || !roomId}
                        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        เข้าร่วมห้อง
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">รหัสห้อง (เพื่อเข้าร่วม)</label>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น x7z9q2"
                    />
                </div>
            </div>
        </div>
    );
}
