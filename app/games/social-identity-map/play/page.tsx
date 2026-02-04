'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IdentityMap, GameState } from '@/lib/games/social-identity-map/model';
import { Lobby } from '@/components/games/social-identity-map/Lobby';
import { GameRoom } from '@/components/games/social-identity-map/GameRoom';
import { AlertModal, PromptModal } from '@/components/games/social-identity-map/Modal';
import { supabase } from '@/lib/supabase';

function GameContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [game, setGame] = useState<GameState | null>(null);
    const [playerId, setPlayerId] = useState<string>(searchParams.get('playerId') || '');
    const [loading, setLoading] = useState(false);
    const [kickedModal, setKickedModal] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [joinName, setJoinName] = useState('');

    const initialRoomId = searchParams.get('roomId');
    const hasSyncedUrl = useRef(false);

    // Initial fetch if roomId in URL
    useEffect(() => {
        if (initialRoomId && !game) {
            const fetchInitial = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/games/social-identity-map?roomId=${initialRoomId}`);
                    const data = await res.json();
                    if (data.game) {
                        setGame(data.game);
                        // If no playerId in state/params, prompt to join
                        if (!playerId) {
                            setIsJoinModalOpen(true);
                        }
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchInitial();
        }
    }, [initialRoomId, game, playerId]);

    // Sync with Supabase Realtime
    useEffect(() => {
        if (!game?.roomId) return;

        // Update URL if missing or mismatch
        const currentRoomIdInUrl = searchParams.get('roomId') || '';
        const currentPlayerIdInUrl = searchParams.get('playerId') || '';

        if (currentRoomIdInUrl !== (game.roomId || '') || currentPlayerIdInUrl !== (playerId || '')) {
            const params = new URLSearchParams(searchParams.toString());
            let changed = false;

            if (game.roomId && currentRoomIdInUrl !== game.roomId) {
                params.set('roomId', game.roomId);
                changed = true;
            }

            if (playerId && currentPlayerIdInUrl !== playerId) {
                params.set('playerId', playerId);
                changed = true;
            }

            if (changed) {
                hasSyncedUrl.current = true;
                router.replace(`${pathname}?${params.toString()}`);
            }
        }

        const channel = supabase
            .channel(`game-${game.roomId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'games',
                    filter: `id=eq.${game.roomId}`,
                },
                (payload) => {
                    const newState = (payload.new as any).state as GameState;
                    if (newState) {
                        // Check if I was kicked (players list is small, this is cheap)
                        const stillInGame = newState.players.some(p => p.id === playerId);
                        if (!stillInGame && playerId) {
                            setKickedModal(true);
                            setGame(null);
                            setPlayerId('');
                            router.push(pathname);
                            return;
                        }
                        setGame(newState);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [game?.roomId, playerId, pathname, router, searchParams]);

    const handleCreate = async (playerName: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/games/social-identity-map', {
                method: 'POST',
                body: JSON.stringify({ action: 'create', playerName }),
            });
            const data = await res.json();
            if (data.success) {
                setPlayerId(data.playerId);
                setGame(data.game);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (roomId: string, playerName: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/games/social-identity-map', {
                method: 'POST',
                body: JSON.stringify({ action: 'join', roomId, playerName }),
            });
            const data = await res.json();
            if (data.success) {
                setPlayerId(data.playerId);
                setGame(data.game);
            } else {
                alert(data.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSubmit = () => {
        if (!initialRoomId || !joinName.trim()) return;
        handleJoin(initialRoomId, joinName.trim());
        setIsJoinModalOpen(false);
    };

    const handleUpdateMap = async (subjectId: string, map: IdentityMap) => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({
                action: 'update_map',
                roomId: game.roomId,
                playerId,
                subjectId,
                map
            }),
        });
    };

    const handleSetPresenter = async (presenterId: string | null, subjectId: string | null) => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({
                action: 'set_presenter',
                roomId: game.roomId,
                presenterId,
                subjectId
            }),
        });
    };

    const handleUpdateName = async (newName: string) => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({ action: 'update_name', roomId: game.roomId, playerId, newName }),
        });
    };

    const handleResetToLobby = async () => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({ action: 'reset-to-lobby', roomId: game.roomId, playerId }),
        });
    };

    const handleKick = async (targetId: string) => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({ action: 'kick', roomId: game.roomId, playerId, targetId }),
        });
    };

    if (loading && !game) {
        return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>;
    }

    if (game && playerId) {
        return (
            <GameRoom
                game={game}
                playerId={playerId}
                onUpdateMap={handleUpdateMap}
                onSetPresenter={handleSetPresenter}
                onUpdateName={handleUpdateName}
                onResetToLobby={handleResetToLobby}
                onKickPlayer={handleKick}
            />
        );
    }

    return (
        <>
            <Lobby
                onCreate={handleCreate}
                onJoin={handleJoin}
                loading={loading}
            />
            <AlertModal
                isOpen={kickedModal}
                onClose={() => setKickedModal(false)}
                title="ถูกเชิญออก"
                message="คุณไม่พบรายชื่อในห้องนี้แล้ว"
                type="warning"
            />
            <PromptModal
                isOpen={isJoinModalOpen && !kickedModal}
                onClose={() => setIsJoinModalOpen(false)}
                title="ยินดีต้อนรับ!"
                placeholder="ระบุชื่อของคุณเพื่อเข้าร่วม..."
                value={joinName}
                onChange={setJoinName}
                onSubmit={handleJoinSubmit}
                submitLabel="เข้าร่วมเกม"
            />
        </>
    );
}

export default function SocialIdentityMapPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>}>
            <GameContent />
        </Suspense>
    );
}
