export interface IdentityMap {
    given: string[];
    chosen: string[];
    core: string[];
}

export interface Player {
    id: string;
    name: string;
    map: IdentityMap;
    isReady: boolean; // Maybe useful if we want to track who is done
}

export interface GameState {
    roomId: string;
    status: 'lobby' | 'playing';
    players: Player[];
    hostId: string;
    presenterId: string | null; // ID of the player currently sharing their map
}

// Helper to generate a unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// --- Game Logic ---

export function createRoom(hostId: string, hostName: string): GameState {
    const host: Player = {
        id: hostId,
        name: hostName,
        map: { given: [], chosen: [], core: [] },
        isReady: false,
    };
    return {
        roomId: generateId(),
        status: 'lobby',
        players: [host],
        hostId: hostId,
        presenterId: null,
    };
}

export function joinRoom(game: GameState, playerId: string, playerName: string): GameState {
    if (game.players.some(p => p.id === playerId)) return game;

    const newPlayer: Player = {
        id: playerId,
        name: playerName,
        map: { given: [], chosen: [], core: [] },
        isReady: false,
    };

    return {
        ...game,
        players: [...game.players, newPlayer],
    };
}

export function updateMap(game: GameState, playerId: string, map: IdentityMap): GameState {
    return {
        ...game,
        players: game.players.map(p =>
            p.id === playerId ? { ...p, map } : p
        ),
    };
}

export function setPresenter(game: GameState, presenterId: string | null): GameState {
    return {
        ...game,
        presenterId,
    };
}
