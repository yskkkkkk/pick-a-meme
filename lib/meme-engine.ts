import { GeneratedMeme } from '@/types';
import { MOCK_BACKGROUNDS, MOCK_PHRASES } from './mock-data';

/**
 * 랜덤으로 밈 조합을 생성합니다.
 */
export function generateRandomMeme(): GeneratedMeme {
  const randomBgIndex = Math.floor(Math.random() * MOCK_BACKGROUNDS.length);
  const randomPhraseIndex = Math.floor(Math.random() * MOCK_PHRASES.length);

  const background = MOCK_BACKGROUNDS[randomBgIndex];
  const phrase = MOCK_PHRASES[randomPhraseIndex];

  return {
    recipe: {
      backgroundId: background.id,
      phraseId: phrase.id,
    },
    background,
    phrase,
  };
}
