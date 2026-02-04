
import { NextRequest, NextResponse } from 'next/server';
import {
    createRoom,
    joinRoom,
    startGame,
    playTurn,
    addPlayerSlot,
    removePlayer,
    resetToLobby,
    updatePlayerMoney,
    generateId,
    GameState
} from '@/lib/gameModel';
import { getGame, saveGame } from '@/lib/store';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { action, roomId, playerId, playerName, cardIds } = body;

    try {
        if (action === 'create') {
            const pid = playerId || generateId();
            const newGame = createRoom(pid, playerName || 'Host');
            await saveGame(newGame);
            return NextResponse.json({ success: true, game: newGame, playerId: pid });
        }

        if (action === 'join') {
            const game = await getGame<GameState>(roomId);
            if (!game) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

            const pid = playerId || generateId();
            const updatedGame = joinRoom(game, pid, playerName || 'Player');
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame, playerId: pid });
        }

        // For other actions, we need roomId and playerId
        if (!roomId || !playerId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const game = await getGame<GameState>(roomId);
        if (!game) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

        if (action === 'start') {
            const updatedGame = startGame(game, playerId);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        if (action === 'play') {
            const subAction = body.subAction; // 'reveal' | 'skip'
            const updatedGame = playTurn(game, playerId, subAction, cardIds);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        if (action === 'create-slot') {
            const result = addPlayerSlot(game, body.playerName || 'New Player');
            await saveGame(result.game);
            return NextResponse.json({ success: true, game: result.game, newPlayerId: result.playerId });
        }

        if (action === 'remove-player') {
            const updatedGame = removePlayer(game, playerId, body.targetPlayerId);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        if (action === 'reset-to-lobby') {
            const updatedGame = resetToLobby(game, playerId);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        if (action === 'update-money') {
            const { targetPlayerId, amount } = body;
            const updatedGame = updatePlayerMoney(game, playerId, targetPlayerId, amount);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) return NextResponse.json({ error: 'Room ID required' }, { status: 400 });

    const game = await getGame(roomId);
    if (!game) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    return NextResponse.json({ game });
}
