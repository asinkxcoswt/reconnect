
'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Lobby } from '@/components/games/logic-of-similarity/Lobby';
import { GameBoard } from '@/components/games/logic-of-similarity/GameBoard';
import { AlertModal, PromptModal } from '@/components/games/logic-of-similarity/Modal';
import { GameState } from '@/lib/gameModel';
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
          const res = await fetch(`/api/games/logic-of-similarity?roomId=${initialRoomId}`);
          const data = await res.json();
          if (data.game) {
            setGame(data.game);
            // If no playerId in URL, prompt to join
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
  }, [initialRoomId, playerId]);

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
          event: '*', // INSERT, UPDATE
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game.roomId}`,
        },
        (payload) => {
          // Payload.new contains the new row data
          const newState = (payload.new as any).state as GameState;
          if (newState) {
            // Check if I was kicked
            const stillInGame = newState.players.some(p => p.id === playerId);
            if (!stillInGame && playerId && game.status !== 'finished') {
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
      const res = await fetch('/api/games/logic-of-similarity', {
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
      const res = await fetch('/api/games/logic-of-similarity', {
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

  const handleStart = async () => {
    if (!game) return;
    const response = await fetch('/api/games/logic-of-similarity', {
      method: 'POST',
      body: JSON.stringify({ action: 'start', roomId: game.roomId, playerId }),
    })
    if (!response.ok) {
      const errorBody = await response.text();
      alert(errorBody)
    }
  };

  const handleAction = async (action: 'play', subAction?: string, cardIds?: string[]) => {
    if (!game) return;
    await fetch('/api/games/logic-of-similarity', {
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

  const handleResetToLobby = async () => {
    if (!game) return;
    await fetch('/api/games/logic-of-similarity', {
      method: 'POST',
      body: JSON.stringify({ action: 'reset-to-lobby', roomId: game.roomId, playerId }),
    });
  };

  const handleUpdateMoney = async (targetPlayerId: string, amount: number) => {
    if (!game) return;
    await fetch('/api/games/logic-of-similarity', {
      method: 'POST',
      body: JSON.stringify({ action: 'update-money', roomId: game.roomId, playerId, targetPlayerId, amount }),
    });
  };

  const handleUpdateName = async (newName: string) => {
    if (!game) return;
    await fetch('/api/games/logic-of-similarity', {
      method: 'POST',
      body: JSON.stringify({ action: 'update-name', roomId: game.roomId, playerId, newName }),
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
        onResetToLobby={handleResetToLobby}
        onUpdateMoney={handleUpdateMoney}
        onUpdateName={handleUpdateName}
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
        message="คุณถูกเชิญออกจากห้องโดยโฮสต์"
        type="warning"
      />
      <PromptModal
        isOpen={isJoinModalOpen && !kickedModal}
        onClose={() => { }} // Force name entry if they want to join via link
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

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
