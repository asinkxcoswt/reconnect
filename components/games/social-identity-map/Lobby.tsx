'use client';

import { useState } from 'react';

interface LobbyProps {
    onCreate: (playerName: string) => void;
    onJoin: (roomId: string, playerName: string) => void;
}

export function Lobby({ onCreate, onJoin }: LobbyProps) {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Social Identity Map</h1>
                    <p className="text-gray-400">Share your story through your traits</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your name"
                        />
                    </div>

                    {!isJoining ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => playerName && onCreate(playerName)}
                                disabled={!playerName}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create New Room
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-neutral-800 text-gray-400">Or</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsJoining(true)}
                                className="w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
                            >
                                Join Existing Room
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room ID
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter Room ID"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsJoining(false)}
                                    className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => playerName && roomId && onJoin(roomId, playerName)}
                                    disabled={!playerName || !roomId}
                                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Join Room
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
