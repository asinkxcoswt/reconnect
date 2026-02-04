
import { supabase } from './supabase';
// import { GameState } from './gameModel';

// Replaces the Map<string, GameState> with Supabase calls

export async function getGame<T>(roomId: string): Promise<T | null> {
    const { data, error } = await supabase
        .from('games')
        .select('state')
        .eq('id', roomId)
        .single();

    if (error || !data) return null;
    return data.state as T;
}

export async function saveGame<T extends { roomId: string }>(game: T): Promise<void> {
    const { error } = await supabase
        .from('games')
        .upsert(
            { id: game.roomId, state: game, updated_at: new Date().toISOString() },
            { onConflict: 'id' }
        );

    if (error) {
        console.error('Error saving game:', error);
        throw new Error('Failed to save game state');
    }
}
