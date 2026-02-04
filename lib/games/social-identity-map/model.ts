export interface IdentityMap {
    given: string[];
    chosen: string[];
    core: string[];
}

export interface Player {
    id: string;
    name: string;
    maps: Record<string, IdentityMap>; // Key is subject playerId
    isReady: boolean;
}

export interface GameState {
    roomId: string;
    status: 'lobby' | 'playing';
    players: Player[];
    hostId: string;
    presenterId: string | null;
    presentingSubjectId: string | null; // ID of the player whose map is being shared
}

// Helper to generate a unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function createEmptyMap(): IdentityMap {
    return { given: [], chosen: [], core: [] };
}

// --- Game Logic ---

export function createRoom(hostId: string, hostName: string): GameState {
    const host: Player = {
        id: hostId,
        name: hostName,
        maps: { [hostId]: createEmptyMap() },
        isReady: false,
    };
    return {
        roomId: generateId(),
        status: 'lobby',
        players: [host],
        hostId: hostId,
        presenterId: null,
        presentingSubjectId: null,
    };
}

export function joinRoom(game: GameState, playerId: string, playerName: string): GameState {
    if (game.players.some(p => p.id === playerId)) return game;

    const newPlayer: Player = {
        id: playerId,
        name: playerName,
        maps: { [playerId]: createEmptyMap() },
        isReady: false,
    };

    return {
        ...game,
        players: [...game.players, newPlayer],
    };
}

export function updateMap(game: GameState, playerId: string, subjectId: string, map: IdentityMap): GameState {
    return {
        ...game,
        players: game.players.map(p =>
            p.id === playerId ? {
                ...p,
                maps: { ...p.maps, [subjectId]: map }
            } : p
        ),
    };
}

export function setPresenter(game: GameState, presenterId: string | null, subjectId: string | null): GameState {
    return {
        ...game,
        presenterId,
        presentingSubjectId: presenterId ? subjectId : null,
    };
}

export function updateName(game: GameState, playerId: string, newName: string): GameState {
    return {
        ...game,
        players: game.players.map(p =>
            p.id === playerId ? { ...p, name: newName } : p
        ),
    };
}

export function resetToLobby(game: GameState): GameState {
    return {
        ...game,
        status: 'lobby',
        presenterId: null,
        presentingSubjectId: null,
    };
}

export function kickPlayer(game: GameState, hostId: string, targetPlayerId: string): GameState {
    if (game.hostId !== hostId || hostId === targetPlayerId) return game;

    const isTargetPresenting = game.presenterId === targetPlayerId || game.presentingSubjectId === targetPlayerId;

    return {
        ...game,
        players: game.players.filter(p => p.id !== targetPlayerId),
        presenterId: isTargetPresenting ? null : game.presenterId,
        presentingSubjectId: isTargetPresenting ? null : game.presentingSubjectId,
    };
}
