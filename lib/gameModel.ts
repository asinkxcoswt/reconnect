
export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export interface Card {
    id: string;
    color: Color;
}

export interface Player {
    id: string; // socket id or user id
    name: string;
    hand: Card[];
    money: number;
    revealedCards: Card[];
    hasPassed: boolean; // Reset when a player reveals a card? No, usually in this game once you pass you might be out or it resets if someone else plays. 
    // Rule: "The game end when no one want to reveal anymore." -> Consecutive passes = Players.length.
}

export interface GameState {
    roomId: string;
    status: 'lobby' | 'playing' | 'finished';
    players: Player[];
    deck: Card[];
    currentPlayerIndex: number;
    consecutivePasses: number;
    hostId: string;
    // For scoring display after game ends
    winners?: { playerId: string; amountWon: number }[];
    losers?: { playerId: string; amountLost: number }[];
}

export const PENALTY_AMOUNT = 10;

// Helper to generate a unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// --- Game Logic ---

export function createRoom(hostId: string, hostName: string): GameState {
    const host: Player = {
        id: hostId,
        name: hostName,
        hand: [],
        money: 100,
        revealedCards: [],
        hasPassed: false,
    };
    return {
        roomId: generateId(),
        status: 'lobby',
        players: [host],
        deck: [],
        currentPlayerIndex: 0,
        consecutivePasses: 0,
        hostId: hostId,
    };
}

export function joinRoom(game: GameState, playerId: string, playerName: string): GameState {
    const existingPlayer = game.players.find(p => p.id === playerId);
    if (existingPlayer) return game; // Already in game (robust rejoin)

    if (game.status !== 'lobby') throw new Error('Game already started');

    const newPlayer: Player = {
        id: playerId,
        name: playerName,
        hand: [],
        money: 100,
        revealedCards: [],
        hasPassed: false,
    };

    return {
        ...game,
        players: [...game.players, newPlayer],
    };
}

export function addPlayerSlot(game: GameState, playerName: string): { game: GameState, playerId: string } {
    const playerId = generateId();
    const newPlayer: Player = {
        id: playerId,
        name: playerName,
        hand: [],
        money: 100,
        revealedCards: [],
        hasPassed: false,
    };
    return {
        game: {
            ...game,
            players: [...game.players, newPlayer],
        },
        playerId
    };
}

export function removePlayer(game: GameState, hostId: string, targetPlayerId: string): GameState {
    if (game.hostId !== hostId) throw new Error('Only host can remove players');
    if (hostId === targetPlayerId) throw new Error('Host cannot remove themselves');

    const updatedPlayers = game.players.filter(p => p.id !== targetPlayerId);

    let nextPlayerIndex = game.currentPlayerIndex;
    if (game.status === 'playing') {
        const removedPlayerIndex = game.players.findIndex(p => p.id === targetPlayerId);
        if (removedPlayerIndex <= game.currentPlayerIndex && game.currentPlayerIndex > 0) {
            nextPlayerIndex = (game.currentPlayerIndex - 1) % updatedPlayers.length;
        } else if (nextPlayerIndex >= updatedPlayers.length) {
            nextPlayerIndex = 0;
        }
    }

    return {
        ...game,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        consecutivePasses: 0, // Reset to be safe
    };
}

function generateDeck(): Card[] {
    const deck: Card[] = [];
    // 10 of each color = 40 cards total
    COLORS.forEach(color => {
        for (let i = 0; i < 10; i++) {
            deck.push({ id: generateId(), color });
        }
    });
    return deck.sort(() => Math.random() - 0.5); // Shuffle
}

export function startGame(game: GameState, requesterId: string): GameState {
    if (game.hostId !== requesterId) throw new Error('Only host can start');
    if (game.players.length < 2) throw new Error('Need at least 2 players');

    const deck = generateDeck();
    const players = game.players.map(p => ({ ...p, hand: [] as Card[], revealedCards: [] as Card[], hasPassed: false }));

    // Deal 5 cards to each player
    players.forEach(p => {
        for (let i = 0; i < 5; i++) {
            const card = deck.pop();
            if (card) p.hand.push(card);
        }
    });

    return {
        ...game,
        status: 'playing',
        deck,
        players,
        currentPlayerIndex: 0,
        consecutivePasses: 0,
    };
}

export function resetToLobby(game: GameState, requesterId: string): GameState {
    if (game.hostId !== requesterId) throw new Error('Only host can reset to lobby');

    // Reset player state but keep money
    const players = game.players.map(p => ({
        ...p,
        hand: [] as Card[],
        revealedCards: [] as Card[],
        hasPassed: false,
    }));

    return {
        ...game,
        status: 'lobby',
        players,
        deck: [],
        currentPlayerIndex: 0,
        consecutivePasses: 0,
        winners: undefined,
        losers: undefined,
    };
}

export function updatePlayerMoney(game: GameState, hostId: string, targetPlayerId: string, amount: number): GameState {
    if (game.hostId !== hostId) throw new Error('Only host can edit money');

    const updatedPlayers = game.players.map(p => {
        if (p.id === targetPlayerId) {
            return { ...p, money: amount };
        }
        return p;
    });

    return {
        ...game,
        players: updatedPlayers,
    };
}

export function updatePlayerName(game: GameState, playerId: string, newName: string): GameState {
    const updatedPlayers = game.players.map(p => {
        if (p.id === playerId) {
            return { ...p, name: newName };
        }
        return p;
    });

    return {
        ...game,
        players: updatedPlayers,
    };
}

export function playTurn(game: GameState, playerId: string, action: 'reveal' | 'skip', cardIds?: string[]): GameState {
    if (game.status !== 'playing') throw new Error('Game not playing');
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== playerId) throw new Error('Not your turn');

    let updatedPlayers = [...game.players];
    let consecutivePasses = game.consecutivePasses;

    if (action === 'skip') {
        consecutivePasses++;
    } else {
        // Reveal
        if (!cardIds || cardIds.length === 0) throw new Error('Must select cards to reveal');

        // Validate cards: must exist in hand, must be same color
        const cardsToReveal = currentPlayer.hand.filter(c => cardIds.includes(c.id));
        if (cardsToReveal.length !== cardIds.length) throw new Error('Invalid cards');

        const firstColor = cardsToReveal[0].color;
        if (!cardsToReveal.every(c => c.color === firstColor)) throw new Error('All revealed cards must be same color');

        // Move to revealed
        const remainingHand = currentPlayer.hand.filter(c => !cardIds.includes(c.id));
        updatedPlayers[game.currentPlayerIndex] = {
            ...currentPlayer,
            hand: remainingHand,
            revealedCards: [...currentPlayer.revealedCards, ...cardsToReveal],
        };

        consecutivePasses = 0; // Reset passes since action was taken
    }

    // Check Game End Condition
    if (consecutivePasses >= game.players.length) {
        return calculateScore({
            ...game,
            players: updatedPlayers,
            consecutivePasses,
        });
    }

    // Next player
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;

    return {
        ...game,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        consecutivePasses,
    };
}

function calculateScore(game: GameState): GameState {
    const colorCounts: Record<Color, number> = { red: 0, blue: 0, green: 0, yellow: 0, purple: 0 };

    game.players.forEach(p => {
        p.revealedCards.forEach(c => {
            colorCounts[c.color] = (colorCounts[c.color] || 0) + 1;
        });
    });

    const maxCount = Math.max(...Object.values(colorCounts));
    const winColors = (Object.keys(colorCounts) as Color[]).filter(c => colorCounts[c] === maxCount);

    if (winColors.length === 0 || maxCount === 0) {
        // No cards revealed? No score change.
        return { ...game, status: 'finished' };
    }

    let totalPot = 0;
    const playerUpdates = game.players.map(p => ({ ...p })); // Clone
    const losers: { playerId: string; amountLost: number }[] = [];
    const winners: { playerId: string; amountWon: number }[] = [];

    // 1. Collect penalties
    playerUpdates.forEach(p => {
        let penalty = 0;

        // Standard penalty for incorrect colors
        p.revealedCards.forEach(c => {
            if (!winColors.includes(c.color)) {
                penalty += PENALTY_AMOUNT;
            }
        });

        // Special penalty: Player who don't reveal any card will be fined by PENALTY_AMOUNT X 5
        if (p.revealedCards.length === 0) {
            penalty += PENALTY_AMOUNT * 5;
        }

        if (penalty > 0) {
            p.money -= penalty;
            totalPot += penalty;
            losers.push({ playerId: p.id, amountLost: penalty });
        }
    });

    // 2. Distribute pot
    // "Distributed to each player who reveal the "win color" card, in proportion to the number of card they revealed."
    const winCardCountsByPlayer: Record<string, number> = {};
    let totalWinCardsRevealed = 0;

    playerUpdates.forEach(p => {
        const count = p.revealedCards.filter(c => winColors.includes(c.color)).length;
        if (count > 0) {
            winCardCountsByPlayer[p.id] = count;
            totalWinCardsRevealed += count;
        }
    });

    if (totalWinCardsRevealed > 0) {
        playerUpdates.forEach(p => {
            const count = winCardCountsByPlayer[p.id] || 0;
            if (count > 0) {
                const share = Math.floor(totalPot * (count / totalWinCardsRevealed));
                p.money += share;
                winners.push({ playerId: p.id, amountWon: share });
            }
        });
    }

    return {
        ...game,
        status: 'finished',
        players: playerUpdates,
        winners,
        losers,
    };
}
