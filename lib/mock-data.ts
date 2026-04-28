import { BackgroundImage, MemePhrase, Sticker } from '@/types';

export const MOCK_BACKGROUNDS: BackgroundImage[] = [
  { id: 'bg-1', url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600&h=600', alt: '주먹 쥔 고양이', rarity: 'common' },
  { id: 'bg-2', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600&h=600', alt: '입맛 다시는 강아지', rarity: 'common' },
  { id: 'bg-3', url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=600&h=600', alt: '세상 잃은 표정의 개', rarity: 'common' },
  { id: 'bg-4', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600&h=600', alt: '눈 가늘게 뜬 고양이', rarity: 'common' },
  { id: 'bg-5', url: 'https://images.unsplash.com/photo-1529778459854-e859c0490b47?auto=format&fit=crop&q=80&w=600&h=600', alt: '졸려 죽겠는 퍼그', rarity: 'common' },
  { id: 'bg-6', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=600&h=600', alt: '자신감 넘치는 고양이', rarity: 'rare' },
  { id: 'bg-7', url: 'https://images.unsplash.com/photo-1491604612772-6853927639ef?auto=format&fit=crop&q=80&w=600&h=600', alt: '화난 고슴도치', rarity: 'rare' },
  { id: 'bg-legend', url: 'https://images.unsplash.com/photo-1533733358354-2e974f000132?auto=format&fit=crop&q=80&w=600&h=600', alt: '황금 왕관을 쓴 고양이', rarity: 'legendary' },
];

export const MOCK_PHRASES: MemePhrase[] = [
  { id: 'p-1', text: '아... 출근하기 싫다', rarity: 'common' },
  { id: 'p-2', text: '이게 맞나...?', rarity: 'common' },
  { id: 'p-3', text: '집에 가고 싶다', rarity: 'common' },
  { id: 'p-4', text: '오늘 저녁 뭐 먹지', rarity: 'common' },
  { id: 'p-5', text: '왜 나한테만 그래', rarity: 'common' },
  { id: 'p-8', text: '어쩌라고 (당당)', rarity: 'rare' },
  { id: 'p-11', text: '너 지금 뭐라 그랬냐?', rarity: 'rare' },
  { id: 'p-legend', text: '전설의 직장인, 퇴사 결재 완료', rarity: 'legendary' },
];

export const MOCK_STICKERS: Sticker[] = [
  { id: 's-1', url: 'https://cdn-icons-png.flaticon.com/128/11624/11624524.png', name: '불꽃', rarity: 'common' },
  { id: 's-2', url: 'https://cdn-icons-png.flaticon.com/128/616/616430.png', name: '선글라스', rarity: 'common' },
  { id: 's-4', url: 'https://cdn-icons-png.flaticon.com/128/742/742751.png', name: '눈물', rarity: 'common' },
  { id: 's-5', url: 'https://cdn-icons-png.flaticon.com/128/2534/2534720.png', name: '왕관', rarity: 'rare' },
  { id: 's-legend', url: 'https://cdn-icons-png.flaticon.com/128/1041/1041916.png', name: '홀로그램 다이아', rarity: 'legendary' },
];
