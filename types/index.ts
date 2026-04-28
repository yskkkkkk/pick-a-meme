export type Rarity = 'common' | 'rare' | 'legendary';

export interface BackgroundImage {
  id: string;
  url: string;
  alt: string;
  rarity: Rarity;
}

export interface MemePhrase {
  id: string;
  text: string;
  rarity: Rarity;
}

export interface Sticker {
  id: string;
  url: string;
  name: string;
  rarity: Rarity;
}

export interface AppliedSticker extends Sticker {
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
  rotation: number; // -45 to 45 degrees
  scale: number; // 0.5 to 1.5
}

export interface MemeRecipe {
  backgroundId: string;
  phraseId: string;
  textPosition: {
    x: number; // 0-100
    y: number; // 0-100
  };
  stickers: AppliedSticker[];
  rarity: Rarity; // 최종 결과물의 등급
}

export interface GeneratedMeme {
  recipe: MemeRecipe;
  background: BackgroundImage;
  phrase: MemePhrase;
}

export interface StaminaState {
  hearts: number;
  maxHearts: number;
  nextRechargeAt: number | null; // timestamp in ms
}
