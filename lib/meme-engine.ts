import { GeneratedMeme, AppliedSticker, Rarity } from '@/types';
import { MOCK_BACKGROUNDS, MOCK_PHRASES, MOCK_STICKERS } from './mock-data';

/**
 * 가중치에 따라 랜덤하게 아이템을 선택합니다.
 * @param items 대상 리스트
 * @param rarityWeights 등급별 가중치 (0~1 사이의 합이 1인 값)
 */
function getRandomByRarity<T extends { rarity: Rarity }>(items: T[]): T {
  const rand = Math.random();
  let targetRarity: Rarity = 'common';

  if (rand < 0.05) targetRarity = 'legendary'; // 5%
  else if (rand < 0.2) targetRarity = 'rare'; // 15%
  else targetRarity = 'common'; // 80%

  // 해당 등급의 아이템 필터링 (없으면 전체에서 랜덤)
  const filtered = items.filter(item => item.rarity === targetRarity);
  const pool = filtered.length > 0 ? filtered : items;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 랜덤으로 밈 조합을 생성합니다.
 */
export function generateRandomMeme(): GeneratedMeme {
  const background = getRandomByRarity(MOCK_BACKGROUNDS);
  const phrase = getRandomByRarity(MOCK_PHRASES);

  // 텍스트 위치 랜덤화 (기본 중앙 50, 50에서 ±15% 유동성)
  const textX = 50 + (Math.random() * 30 - 15);
  const textY = 50 + (Math.random() * 30 - 15);

  // 스티커 랜덤 생성 (40% 확률로 등장, 최대 2개)
  const stickers: AppliedSticker[] = [];
  const hasStickers = Math.random() < 0.4;

  if (hasStickers) {
    const stickerCount = Math.floor(Math.random() * 2) + 1; // 1~2개
    for (let i = 0; i < stickerCount; i++) {
      const stickerBase = getRandomByRarity(MOCK_STICKERS);
      stickers.push({
        ...stickerBase,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        rotation: Math.random() * 60 - 30,
        scale: Math.random() * 0.5 + 0.7,
      });
    }
  }

  // 최종 등급 결정 (가장 높은 등급 기준)
  const rarities: Rarity[] = [background.rarity, phrase.rarity, ...stickers.map(s => s.rarity)];
  let finalRarity: Rarity = 'common';
  if (rarities.includes('legendary')) finalRarity = 'legendary';
  else if (rarities.includes('rare')) finalRarity = 'rare';

  return {
    recipe: {
      backgroundId: background.id,
      phraseId: phrase.id,
      textPosition: { x: textX, y: textY },
      stickers,
      rarity: finalRarity,
    },
    background,
    phrase,
  };
}
