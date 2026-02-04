
import { NextRequest, NextResponse } from 'next/server';
import {
    createRoom,
    joinRoom,
    updateMap,
    setPresenter,
    generateId,
    GameState,
    IdentityMap
} from '@/lib/games/social-identity-map/model';
import { getGame, saveGame } from '@/lib/store';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { action, roomId, playerId, playerName, map, presenterId, subjectId } = body;

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

        // For other actions, we need roomId
        if (!roomId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const game = await getGame<GameState>(roomId);
        if (!game) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

        if (action === 'update_map') {
            if (!playerId || !subjectId || !map) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
            const updatedGame = updateMap(game, playerId, subjectId, map as IdentityMap);
            await saveGame(updatedGame);
            return NextResponse.json({ success: true, game: updatedGame });
        }

        if (action === 'set_presenter') {
            // presenterId can be null to stop sharing
            const updatedGame = setPresenter(game, presenterId, subjectId);
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

    const game = await getGame<GameState>(roomId);
    if (!game) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    return NextResponse.json({ game });
}
