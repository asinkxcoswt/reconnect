
import { GameState } from './gameModel';

// In a real app, use Redis or a database.
// For this dev session, we use a global variable to persist across HMR (mostly).

declare global {
    var gameStore: Map<string, GameState> | undefined;
}

const store = global.gameStore || new Map<string, GameState>();

if (process.env.NODE_ENV !== 'production') {
    global.gameStore = store;
}

export const games = store;
