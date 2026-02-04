'use client';

import { useState, useEffect } from 'react';
import { GameState, IdentityMap, Player } from '@/lib/games/social-identity-map/model';
import { IdentityMapEditor } from './IdentityMapEditor';
import { PromptModal, AlertModal, Modal } from './Modal';

interface GameRoomProps {
    game: GameState;
    playerId: string;
    onUpdateMap: (subjectId: string, map: IdentityMap) => Promise<void>;
    onSetPresenter: (presenterId: string | null, subjectId: string | null) => Promise<void>;
    onUpdateName: (newName: string) => Promise<void>;
    onResetToLobby: () => Promise<void>;
    onKickPlayer: (targetId: string) => Promise<void>;
}

export function GameRoom({ game, playerId, onUpdateMap, onSetPresenter, onUpdateName, onResetToLobby, onKickPlayer }: GameRoomProps) {
    const [activeSubjectId, setActiveSubjectId] = useState<string>(playerId);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [renameModal, setRenameModal] = useState<{ isOpen: boolean; name: string }>({ isOpen: false, name: '' });
    const [abortConfirm, setAbortConfirm] = useState(false);
    const [roomInviteModal, setRoomInviteModal] = useState<{ isOpen: boolean; url: string }>({ isOpen: false, url: '' });

    const me = game.players.find(p => p.id === playerId);
    const presenter = game.presenterId ? game.players.find(p => p.id === game.presenterId) : null;
    const presentingSubject = game.presentingSubjectId ? game.players.find(p => p.id === game.presentingSubjectId) : null;
    const isHost = game.hostId === playerId;

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
        setIsPending(true);
        try {
            await onUpdateMap(subjectId, map);
        } finally {
            setIsPending(false);
        }
    };

    const handleUpdateNameSubmit = async () => {
        if (!renameModal.name.trim() || isPending) return;
        setIsPending(true);
        try {
            await onUpdateName(renameModal.name.trim());
            setRenameModal({ ...renameModal, isOpen: false });
        } catch (err) {
            console.error("Failed to update name:", err);
        } finally {
            setIsPending(false);
        }
    };

    const handleResetToLobby = async () => {
        if (isPending) return;
        setIsPending(true);
        try {
            await onResetToLobby();
            setAbortConfirm(false);
        } catch (err) {
            console.error("Failed to reset room:", err);
        } finally {
            setIsPending(false);
        }
    };

    const handleKick = async (targetId: string, targetName: string) => {
        if (isPending || !confirm(`คุณแน่ใจหรือไม่ว่าต้องการเชิญ ${targetName} ออกจากกลุ่ม?`)) return;
        setIsPending(true);
        try {
            await onKickPlayer(targetId);
        } catch (err) {
            console.error("Failed to kick player:", err);
        } finally {
            setIsPending(false);
        }
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(game.roomId);
            alert("คัดลอกรหัสห้องแล้ว");
        } catch (err) {
            console.error('Clipboard failed:', err);
        }
    };

    const shareRoomLink = () => {
        const url = `${window.location.origin}${window.location.pathname}?roomId=${game.roomId}`;
        setRoomInviteModal({ isOpen: true, url });
    };

    const handleCopyInvite = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            alert('คัดลอกลิงก์เชิญเรียบร้อยแล้ว');
            setRoomInviteModal({ ...roomInviteModal, isOpen: false });
        } catch (err) {
            console.error('Clipboard failed:', err);
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
                    <div className="flex items-center gap-2 overflow-hidden">
                        <h2 className="text-xl font-bold truncate">ห้อง: {game.roomId}</h2>
                        <button
                            onClick={copyRoomId}
                            className="bg-neutral-700 hover:bg-neutral-600 p-1.5 rounded transition shadow-sm text-[10px] text-neutral-300 flex-shrink-0"
                            title="คัดลอกรหัสห้อง"
                        >
                            คัดลอก
                        </button>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">ผู้เล่น</p>
                        <div className="space-y-1">
                            {game.players.map(p => (
                                <div key={p.id} className="group relative flex flex-col gap-1">
                                    <button
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
                                        <span className="truncate pr-8">{p.name} {p.id === playerId && '(คุณ)'}</span>
                                        {game.presenterId === p.id && (
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                        )}
                                    </button>

                                    {/* Kick Button (Host only, not for self) */}
                                    {isHost && p.id !== playerId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleKick(p.id, p.name);
                                            }}
                                            disabled={isPending}
                                            className="absolute right-2 top-2 p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-neutral-800/80 rounded"
                                            title="เชิญออก"
                                        >
                                            <span className="text-[10px]">🚫</span>
                                        </button>
                                    )}

                                    {p.id === playerId && (
                                        <button
                                            onClick={() => setRenameModal({ isOpen: true, name: p.name })}
                                            className="text-[10px] text-gray-500 hover:text-blue-400 self-end px-2"
                                        >
                                            แก้ไขชื่อ ✎
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={shareRoomLink}
                        className="w-full py-2 px-3 bg-neutral-700/50 hover:bg-neutral-700 border border-neutral-600 rounded text-xs text-neutral-300 font-bold transition flex items-center justify-center gap-2"
                    >
                        + เชิญเพื่อน
                    </button>
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

                    {isHost && (
                        <button
                            onClick={() => setAbortConfirm(true)}
                            disabled={isPending}
                            className="w-full py-1 text-[10px] text-gray-600 hover:text-red-400 uppercase tracking-widest transition"
                        >
                            กลับล็อบบี้
                        </button>
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

            {/* Modals */}
            <PromptModal
                isOpen={renameModal.isOpen}
                onClose={() => setRenameModal({ ...renameModal, isOpen: false })}
                title="เปลี่ยนชื่อของคุณ"
                placeholder="ระบุชื่อใหม่..."
                value={renameModal.name}
                onChange={(val) => setRenameModal({ ...renameModal, name: val })}
                onSubmit={handleUpdateNameSubmit}
                submitLabel="บันทึก"
                isPending={isPending}
            />

            <Modal
                isOpen={roomInviteModal.isOpen}
                onClose={() => setRoomInviteModal({ ...roomInviteModal, isOpen: false })}
                title="เชิญเพื่อน"
                actions={
                    <button
                        onClick={() => handleCopyInvite(roomInviteModal.url)}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>คัดลอกลิงก์</span>
                        📋
                    </button>
                }
            >
                <div className="space-y-4 text-center">
                    <p className="text-neutral-400 text-sm">ส่งลิงก์ด้านล่างนี้ให้เพื่อนเพื่อเข้าร่วมเกม:</p>
                    <div className="bg-neutral-800 p-4 rounded-2xl break-all font-mono text-xs text-blue-400 border border-neutral-700 shadow-inner select-all">
                        {roomInviteModal.url}
                    </div>
                </div>
            </Modal>

            {/* Back to Lobby Confirmation */}
            {abortConfirm && (
                <Modal
                    isOpen={abortConfirm}
                    onClose={() => setAbortConfirm(false)}
                    title="กลับล็อบบี้?"
                    actions={
                        <>
                            <button
                                onClick={handleResetToLobby}
                                disabled={isPending}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                ยืนยันกลับล็อบบี้
                            </button>
                            <button
                                onClick={() => setAbortConfirm(false)}
                                disabled={isPending}
                                className="w-full py-2 text-neutral-400 hover:text-white font-medium"
                            >
                                ยกเลิก
                            </button>
                        </>
                    }
                >
                    <p className="text-neutral-300">คุณต้องการพาผู้เล่นทุกคนกลับไปที่หน้าล็อบบี้ใช่หรือไม่?</p>
                </Modal>
            )}
        </div>
    );
}
