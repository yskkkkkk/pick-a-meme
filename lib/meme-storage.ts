import { supabase } from './supabase';
import { GeneratedMeme } from '@/types';

export async function saveMeme(userId: string, meme: GeneratedMeme): Promise<void> {
  const { error } = await supabase.from('memes').insert({
    user_id: userId,
    recipe: meme.recipe,
    background: meme.background,
    phrase: meme.phrase,
  });
  if (error) throw error;
}

export async function getUserMemes(userId: string): Promise<GeneratedMeme[]> {
  const { data, error } = await supabase
    .from('memes')
    .select('recipe, background, phrase')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as GeneratedMeme[];
}
