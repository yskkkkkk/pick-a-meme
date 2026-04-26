'use client';

import { useState } from 'react';
import { useStamina } from '@/hooks/use-stamina';
import { generateRandomMeme } from '@/lib/meme-engine';
import { GeneratedMeme } from '@/types';

export default function Home() {
  const { hearts, maxHearts, formattedTime, consumeHeart } = useStamina();
  const [currentMeme, setCurrentMeme] = useState<GeneratedMeme | null>(null);

  const handleGenerate = () => {
    if (consumeHeart()) {
      const meme = generateRandomMeme();
      setCurrentMeme(meme);
    } else {
      alert('하트가 부족합니다! 5분 뒤에 다시 시도해주세요.');
    }
  };

  const handleShare = async () => {
    if (!currentMeme) return;
    
    // Web Share API Mock
    if (navigator.share) {
      try {
        await navigator.share({
          title: '내가 뽑은 밈 사진!',
          text: currentMeme.phrase.text,
          url: window.location.href, // 나중에 개별 밈 URL로 교체
        });
      } catch (error) {
        console.error('공유 실패', error);
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 헤더 / 스태미나 영역 */}
      <header className="w-full max-w-md flex justify-between items-center mb-8 p-4 vibe-border bg-black">
        <h1 className="text-2xl vibe-text text-white">밈.생.기</h1>
        <div className="flex flex-col items-end">
          <div className="text-xl font-bold flex items-center gap-1">
            <span className="text-red-500">❤️</span>
            <span>{hearts} / {maxHearts}</span>
          </div>
          <div className="text-sm text-gray-300 font-mono">
            {hearts < maxHearts ? `다음 충전: ${formattedTime}` : 'MAX'}
          </div>
        </div>
      </header>

      {/* 밈 뷰어 영역 (1:1 비율) */}
      <div className="w-full max-w-md aspect-square bg-gray-900 vibe-border relative overflow-hidden mb-8 flex items-center justify-center">
        {currentMeme ? (
          <>
            <img 
              src={currentMeme.background.url} 
              alt={currentMeme.background.alt}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="relative z-10 p-6 w-full text-center">
              <h2 className="text-4xl vibe-text text-white break-keep" style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                {currentMeme.phrase.text}
              </h2>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-400 font-bold text-xl mb-2">아직 뽑은 밈이 없습니다.</p>
            <p className="text-gray-500">하트를 소모하여 랜덤 밈을 생성해보세요!</p>
          </div>
        )}
      </div>

      {/* 액션 버튼 영역 */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <button 
          onClick={handleGenerate}
          disabled={hearts <= 0}
          className={`w-full py-4 text-2xl font-black rounded-none ${hearts > 0 ? 'vibe-button' : 'bg-gray-600 text-gray-400 border-4 border-gray-500 cursor-not-allowed'}`}
        >
          {hearts > 0 ? '🎲 밈 뽑기 (❤️ -1)' : '하트 충전 중...'}
        </button>
        
        {currentMeme && (
          <button 
            onClick={handleShare}
            className="w-full py-3 text-xl font-bold rounded-none bg-blue-600 text-white border-4 border-white box-shadow-vibe hover:bg-blue-700 transition-colors"
            style={{ boxShadow: '4px 4px 0px #00FF00' }}
          >
            📤 친구에게 공유하기
          </button>
        )}
      </div>
    </main>
  );
}
