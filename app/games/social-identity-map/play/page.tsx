'use client';

import { useState, useEffect } from 'react';
import { IdentityMap, GameState } from '@/lib/games/social-identity-map/model';
import { Lobby } from '@/components/games/social-identity-map/Lobby';
import { GameRoom } from '@/components/games/social-identity-map/GameRoom';
import { supabase } from '@/lib/supabase';

export default function SocialIdentityMapPage() {
    const [game, setGame] = useState<GameState | null>(null);
    const [playerId, setPlayerId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Sync with Supabase Realtime
    useEffect(() => {
        if (!game?.roomId) return;

        // Initial fetch
        const fetchLatest = async () => {
            const res = await fetch(`/api/games/social-identity-map?roomId=${game.roomId}`);
            const data = await res.json();
            if (data.game) setGame(data.game);
        };
        fetchLatest();

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
                        setGame(newState);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [game?.roomId]);

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

    const handleUpdateMap = async (map: IdentityMap) => {
        if (!game) return;
        // Optimistic update? Maybe later.

        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({
                action: 'update_map',
                roomId: game.roomId,
                playerId,
                map
            }),
        });
    };

    const handleSetPresenter = async (presenterId: string | null) => {
        if (!game) return;
        await fetch('/api/games/social-identity-map', {
            method: 'POST',
            body: JSON.stringify({
                action: 'set_presenter',
                roomId: game.roomId,
                presenterId // if null, we stop sharing
            }),
        });
    };

    if (loading) {
        return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>;
    }

    if (game && playerId) {
        return (
            <GameRoom
                game={game}
                playerId={playerId}
                onUpdateMap={handleUpdateMap}
                onSetPresenter={handleSetPresenter}
            />
        );
    }

    return (
        <Lobby
            onCreate={handleCreate}
            onJoin={handleJoin}
        />
    );
}
