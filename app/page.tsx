
'use client';

import { useState, useEffect } from 'react';
import { Lobby } from '@/components/game/Lobby';
import { GameBoard } from '@/components/game/GameBoard';
import { GameState } from '@/lib/gameModel';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [game, setGame] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Sync with Supabase Realtime
  useEffect(() => {
    if (!game?.roomId) return;

    // Initial fetch to ensure we have latest state
    const fetchLatest = async () => {
      const res = await fetch(`/api/game?roomId=${game.roomId}`);
      const data = await res.json();
      if (data.game) setGame(data.game);
    };
    fetchLatest();

    const channel = supabase
      .channel(`game-${game.roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game.roomId}`,
        },
        (payload) => {
          // Payload.new contains the new row data
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
      const res = await fetch('/api/game', {
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
      const res = await fetch('/api/game', {
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

  const handleStart = async () => {
    if (!game) return;
    await fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify({ action: 'start', roomId: game.roomId, playerId }),
    });
  };

  const handleAction = async (action: 'play', subAction?: string, cardIds?: string[]) => {
    if (!game) return;
    await fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify({
        action,
        roomId: game.roomId,
        playerId,
        subAction,
        cardIds
      }),
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (game && playerId) {
    return (
      <GameBoard
        game={game}
        playerId={playerId}
        onRefresh={() => { }} // No-op, handled by realtime
        onAction={handleAction}
        onStart={handleStart}
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
