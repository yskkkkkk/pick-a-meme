export interface BackgroundImage {
  id: string;
  url: string;
  alt: string;
}

export interface MemePhrase {
  id: string;
  text: string;
}

export interface MemeRecipe {
  backgroundId: string;
  phraseId: string;
  // 스티커, 폰트, 위치값 등 추후 확장 가능
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
