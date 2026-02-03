
'use client';

import { useState, useEffect, useRef } from 'react';
import { Lobby } from '@/components/game/Lobby';
import { GameBoard } from '@/components/game/GameBoard';
import { GameState } from '@/lib/gameModel';

export default function Home() {
  const [game, setGame] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const pollInterval = useRef<NodeJS.Timeout>(null);

  const refreshGame = async (rid: string) => {
    try {
      const res = await fetch(`/api/game?roomId=${rid}`);
      const data = await res.json();
      if (data.game) {
        setGame(data.game);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (game?.roomId) {
      // Start polling
      pollInterval.current = setInterval(() => {
        refreshGame(game.roomId);
      }, 1000); // 1s polling
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
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
    refreshGame(game.roomId);
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
    refreshGame(game.roomId);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (game && playerId) {
    return (
      <GameBoard
        game={game}
        playerId={playerId}
        onRefresh={() => refreshGame(game.roomId)}
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
