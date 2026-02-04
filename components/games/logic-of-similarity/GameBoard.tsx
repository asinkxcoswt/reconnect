
'use client';
import React, { useState, useEffect } from 'react';
import { GameState, Card as CardType } from '@/lib/gameModel';
import { Card } from './Card';
import { PlayerHand } from './PlayerHand';
import { Modal, PromptModal, AlertModal } from './Modal';

interface GameBoardProps {
    game: GameState;
    playerId: string;
    onRefresh: () => void;
    onAction: (action: 'play', subAction?: string, cardIds?: string[]) => Promise<void>;
    onStart: () => Promise<void>;
    onResetToLobby: () => Promise<void>;
    onUpdateMoney: (targetPlayerId: string, amount: number) => Promise<void>;
    onUpdateName: (newName: string) => Promise<void>;
}

export function GameBoard({ game, playerId, onRefresh, onAction, onStart, onResetToLobby, onUpdateMoney, onUpdateName }: GameBoardProps) {
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [recoveryModal, setRecoveryModal] = useState<{ isOpen: boolean; url: string; name: string }>({ isOpen: false, url: '', name: '' });
    const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; message: string }>({ isOpen: false, title: '', message: '' });
    const [kickConfirm, setKickConfirm] = useState<{ isOpen: boolean; targetId: string; name: string }>({ isOpen: false, targetId: '', name: '' });
    const [editMoneyModal, setEditMoneyModal] = useState<{ isOpen: boolean; targetId: string; name: string; amount: string }>({ isOpen: false, targetId: '', name: '', amount: '' });
    const [renameModal, setRenameModal] = useState<{ isOpen: boolean; name: string }>({ isOpen: false, name: '' });
    const [roomInviteModal, setRoomInviteModal] = useState<{ isOpen: boolean; url: string }>({ isOpen: false, url: '' });
    const [abortConfirm, setAbortConfirm] = useState(false);
    const [isPending, setIsPending] = useState(false);

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
        if (selectedCardIds.length === 0 || isPending) return;
        setIsPending(true);
        try {
            await onAction('play', 'reveal', selectedCardIds);
            setSelectedCardIds([]);
        } finally {
            setIsPending(false);
        }
    };

    const handleSkip = async () => {
        if (isPending) return;
        setIsPending(true);
        try {
            await onAction('play', 'skip');
            setSelectedCardIds([]);
        } finally {
            setIsPending(false);
        }
    };

    const handleCopyInvite = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            alert('คัดลอกลิงก์เชิญเรียบร้อยแล้ว')
        } catch (err) {
            console.error('Clipboard failed:', err);
        }
    };

    const openRecovery = (targetPlayerId: string) => {
        if (!isHost) return;
        const target = game.players.find(p => p.id === targetPlayerId);
        if (!target) return;
        const url = `${window.location.origin}${window.location.pathname}?roomId=${game.roomId}&playerId=${target.id}`;
        setRecoveryModal({ isOpen: true, url, name: target.name });
    };

    const handleKick = (targetId: string, name: string) => {
        setKickConfirm({ isOpen: true, targetId, name });
    };

    const handleKickConfirm = async () => {
        const { targetId } = kickConfirm;
        setIsPending(true);
        try {
            await fetch('/api/games/logic-of-similarity', {
                method: 'POST',
                body: JSON.stringify({ action: 'remove-player', roomId: game.roomId, playerId, targetPlayerId: targetId }),
            });
            setKickConfirm({ ...kickConfirm, isOpen: false });
        } finally {
            setIsPending(false);
        }
    };

    const handleEditMoney = (p: { id: string, name: string, money: number }) => {
        if (!isHost) return;
        setEditMoneyModal({ isOpen: true, targetId: p.id, name: p.name, amount: p.money.toString() });
    };

    const handleUpdateMoneySubmit = async () => {
        const amount = parseInt(editMoneyModal.amount);
        if (isNaN(amount) || isPending) return;
        setIsPending(true);
        try {
            await onUpdateMoney(editMoneyModal.targetId, amount);
            setEditMoneyModal({ ...editMoneyModal, isOpen: false });
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
        } finally {
            setIsPending(false);
        }
    };

    const shareRoomLink = async () => {
        const url = `${window.location.origin}${window.location.pathname}?roomId=${game.roomId}`;
        setRoomInviteModal({ isOpen: true, url });
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(game.roomId);
            alert("คัดลอกรหัสห้องแล้ว")
        } catch (err) {
            console.error('Clipboard failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-200">ห้อง: {game.roomId}</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{game.status}</p>
                    </div>
                    <button
                        onClick={copyRoomId}
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors group flex items-center gap-1 text-xs font-bold text-gray-400"
                        title="คัดลอกรหัสห้อง"

                    >
                        <span>คัดลอก</span>
                    </button>
                </div>

                <div className="text-right">
                    <p className="font-mono font-bold text-green-400 text-xl">${me.money}</p>
                    <p className="text-sm text-gray-400 font-medium">{me.name} (คุณ)</p>
                </div>
            </div>

            {/* Lobby State */}
            {game.status === 'lobby' && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <h2 className="text-2xl font-bold">กำลังรอผู้เล่น...</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {game.players.map(p => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    if (isHost && p.id !== playerId) openRecovery(p.id);
                                    if (p.id === playerId) setRenameModal({ isOpen: true, name: p.name });
                                }}
                                className={`px-6 py-3 rounded-full flex items-center gap-2 border-2 transition-all ${p.id === playerId ? 'cursor-pointer hover:bg-blue-800/40' : (isHost && game.hostId !== p.id ? 'cursor-pointer hover:border-purple-500' : '')} ${p.id === playerId ? 'bg-blue-900/40 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-700 border-transparent'}`}
                            >
                                <div className={`w-3 h-3 rounded-full ${p.id === playerId ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className="font-bold flex items-center gap-1">
                                    {p.name} {p.id === playerId && <span className="text-[10px] opacity-50">✎</span>}
                                </span> {p.id === game.hostId ? '👑' : ''}
                                {p.id === playerId && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full ml-1 uppercase">คุณ</span>}
                                <div
                                    onClick={(e) => { if (isHost) { e.stopPropagation(); handleEditMoney(p); } }}
                                    className={`ml-2 px-3 py-1 rounded-full font-mono font-bold text-sm transition-all ${isHost ? 'bg-green-600/30 text-green-400 hover:bg-green-600/50 cursor-pointer shadow-sm' : 'text-green-500'}`}
                                >
                                    ${p.money} {isHost && '✎'}
                                </div>
                                {isHost && p.id !== playerId && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleKick(p.id, p.name); }}
                                        className="ml-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors border border-red-500/30"
                                        title="เชิญออก"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {isHost && (
                        <button
                            onClick={shareRoomLink}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 py-2 px-6 rounded-xl text-sm font-bold transition-all"
                        >
                            + เชิญเพื่อน
                        </button>
                    )}
                    {isHost && game.players.length >= 2 && (
                        <button
                            onClick={async () => {
                                if (isPending) return;
                                setIsPending(true);
                                try { await onStart(); } finally { setIsPending(false); }
                            }}
                            disabled={isPending}
                            className="mt-8 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-900/20 transition-all border-b-4 border-green-800 active:border-b-0 active:translate-y-1 flex items-center gap-2"
                        >
                            {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isPending ? 'กำลังเริ่ม...' : 'เริ่มเกม'}
                        </button>
                    )}
                    {isHost && game.players.length < 2 && (
                        <p className="text-yellow-500 font-medium">ต้องการผู้เล่นอย่างน้อย 2 คนเพื่อเริ่มเกม</p>
                    )}
                    {!isHost && (
                        <p className="animate-pulse text-gray-500 italic">กำลังรอโฮสต์เริ่มเกม...</p>
                    )}
                </div>
            )}

            {/* Game State */}
            {(game.status === 'playing' || game.status === 'finished') && (
                <div className="flex flex-col h-full">
                    {/* Opponents Areas */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        {game.players.filter(p => p.id !== playerId).map(p => (
                            <div
                                key={p.id}
                                onClick={() => openRecovery(p.id)}
                                className={`bg-gray-800 p-4 rounded-xl border-2 relative group min-w-[150px] transition-all ${isHost ? 'cursor-pointer hover:border-purple-500' : ''} ${game.players[game.currentPlayerIndex].id === p.id ? 'border-yellow-500 shadow-lg shadow-yellow-900/20' : 'border-gray-700'}`}
                            >
                                {isHost && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleKick(p.id, p.name); }}
                                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                        title="เชิญออก"
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="flex justify-between mb-2 items-center">
                                    <span className="font-bold text-gray-200">{p.name}</span>
                                    <span className="text-green-400 font-mono font-bold">${p.money}</span>
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
                                                <div className="flex items-center gap-2">
                                                    <div className="font-mono text-gray-400 text-sm">
                                                        {p.money}
                                                    </div>
                                                    <div className={`font-mono font-bold text-lg ${net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                        ({net > 0 ? `+${net}` : net === 0 ? '+0' : net})
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>


                                {isHost && (
                                    <div className="w-full space-y-4 pt-4 border-t border-gray-700">
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={async () => {
                                                    if (isPending) return;
                                                    setIsPending(true);
                                                    try { await onStart(); } finally { setIsPending(false); }
                                                }}
                                                disabled={isPending}
                                                className="w-full cursor-pointer bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/40 transition-all border-b-4 border-green-800 active:border-b-0 active:translate-y-1 text-lg flex items-center justify-center gap-2"
                                            >
                                                {isPending && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                                {isPending ? 'กำลังดำเนินการ...' : 'เล่นรอบถัดไป'}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (isPending) return;
                                                    setIsPending(true);
                                                    try { await onResetToLobby(); } finally { setIsPending(false); }
                                                }}
                                                disabled={isPending}
                                                className="cursor-pointer bg-gray-600/20 hover:bg-gray-600/30 disabled:opacity-50 text-gray-400 border border-gray-500/50 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {isPending && <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />}
                                                ไปที่ล็อบบี้
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* My Area */}
                    <div
                        className={`mt-auto bg-gray-800/50 p-4 rounded-t-3xl backdrop-blur-sm border-t border-gray-700 relative transition-all`}
                    >
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
                                        disabled={isPending}
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        ข้าม
                                    </button>
                                    <button
                                        onClick={handleReveal}
                                        disabled={selectedCardIds.length === 0 || isPending}
                                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black rounded-lg font-bold flex items-center gap-2"
                                    >
                                        {isPending && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
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

                    {isHost && game.status === 'playing' && (
                        <button
                            onClick={() => setAbortConfirm(true)}
                            className="mt-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wider"
                        >
                            หยุดเกม / กลับล็อบบี้
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}

            <Modal
                isOpen={recoveryModal.isOpen}
                onClose={() => setRecoveryModal({ ...recoveryModal, isOpen: false })}
                title={`ลิงก์เชิญสำหรับ ${recoveryModal.name}`}
                actions={
                    <button
                        onClick={() => handleCopyInvite(recoveryModal.url)}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>คัดลอกลิงก์</span>
                        <span className="text-xl">📋</span>
                    </button>
                }
            >
                <div className="space-y-4 text-center">
                    <p className="text-gray-400">ส่งลิงก์ด้านล่างนี้ให้เพื่อนเพื่อเข้าร่วมในฐานะ <span className="text-white font-bold">{recoveryModal.name}</span>:</p>
                    <div className="bg-black/40 p-4 rounded-2xl break-all font-mono text-xs text-purple-400 border border-purple-500/20 shadow-inner select-all">
                        {recoveryModal.url}
                    </div>
                </div>
            </Modal>

            <AlertModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
                title={infoModal.title}
                message={infoModal.message}
                type="success"
            />

            <Modal
                isOpen={kickConfirm.isOpen}
                onClose={() => setKickConfirm({ ...kickConfirm, isOpen: false })}
                title={`เชิญ ${kickConfirm.name} ออก?`}
                actions={
                    <>
                        <button
                            onClick={handleKickConfirm}
                            disabled={isPending}
                            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/40 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isPending && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isPending ? 'กำลังดำเนินการ...' : 'เชิญออก'}
                        </button>
                        <button
                            onClick={() => setKickConfirm({ ...kickConfirm, isOpen: false })}
                            className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                        >
                            ยกเลิก
                        </button>
                    </>
                }
            >
                <div className="text-center">
                    <p className="text-gray-300">คุณต้องการเชิญ <span className="text-white font-bold">{kickConfirm.name}</span> ออกจากห้องใช่หรือไม่?</p>
                </div>
            </Modal>

            <PromptModal
                isOpen={editMoneyModal.isOpen}
                onClose={() => setEditMoneyModal({ ...editMoneyModal, isOpen: false })}
                title={`แก้ไขเงินของ ${editMoneyModal.name}`}
                placeholder="จำนวนเงิน..."
                value={editMoneyModal.amount}
                onChange={(val) => setEditMoneyModal({ ...editMoneyModal, amount: val })}
                onSubmit={handleUpdateMoneySubmit}
                submitLabel="บันทึก"
            />

            <PromptModal
                isOpen={renameModal.isOpen}
                onClose={() => setRenameModal({ ...renameModal, isOpen: false })}
                title="เปลี่ยนชื่อของคุณ"
                placeholder="ระบุชื่อใหม่..."
                value={renameModal.name}
                onChange={(val) => setRenameModal({ ...renameModal, name: val })}
                onSubmit={handleUpdateNameSubmit}
                submitLabel="บันทึก"
            />

            <Modal
                isOpen={roomInviteModal.isOpen}
                onClose={() => setRoomInviteModal({ ...roomInviteModal, isOpen: false })}
                title="เชิญเพื่อน"
                actions={
                    <button
                        onClick={() => handleCopyInvite(roomInviteModal.url)}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>คัดลอกลิงก์</span>
                        <span className="text-xl">📋</span>
                    </button>
                }
            >
                <div className="space-y-4 text-center">
                    <p className="text-gray-400">ส่งลิงก์ด้านล่างนี้ให้เพื่อนเพื่อเข้าร่วมเกม:</p>
                    <div className="bg-black/40 p-4 rounded-2xl break-all font-mono text-xs text-purple-400 border border-purple-500/20 shadow-inner select-all">
                        {roomInviteModal.url}
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={abortConfirm}
                onClose={() => setAbortConfirm(false)}
                title="หยุดเกมและกลับไปที่ล็อบบี้?"
                actions={
                    <>
                        <button
                            onClick={async () => {
                                if (isPending) return;
                                setIsPending(true);
                                try { await onResetToLobby(); setAbortConfirm(false); } finally { setIsPending(false); }
                            }}
                            disabled={isPending}
                            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/40 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isPending && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isPending ? 'กำลังดำเนินการ...' : 'หยุดเกมและกลับล็อบบี้'}
                        </button>
                        <button
                            onClick={() => setAbortConfirm(false)}
                            className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                        >
                            เล่นต่อ
                        </button>
                    </>
                }
            >
                <div className="text-center">
                    <p className="text-gray-300">คุณต้องการหยุดเกมและพาผู้เล่นทุกคนกลับไปที่หน้าล็อบบี้ใช่หรือไม่? ความคืบหน้าในรอบนี้จะหายไป</p>
                </div>
            </Modal>
        </div>
    );
}
