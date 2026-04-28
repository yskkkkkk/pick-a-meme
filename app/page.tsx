'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useStamina } from '@/hooks/use-stamina';
import { generateRandomMeme } from '@/lib/meme-engine';
import { GeneratedMeme } from '@/types';

export default function Home() {
  const { data: session, status } = useSession();
  const { hearts, maxHearts, formattedTime, consumeHeart } = useStamina();
  const [currentMeme, setCurrentMeme] = useState<GeneratedMeme | null>(null);
  const [memeHistory, setMemeHistory] = useState<GeneratedMeme[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 밈 히스토리 불러오기 (로그인 후에는 서버 데이터로 대체)
    const storedHistory = localStorage.getItem('meme_history');
    if (storedHistory) {
      setMemeHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // 밈 히스토리 변경 시 로컬 스토리지에 저장
    localStorage.setItem('meme_history', JSON.stringify(memeHistory));
  }, [memeHistory]);

  const handleGenerate = () => {
    if (consumeHeart()) {
      const meme = generateRandomMeme();
      setCurrentMeme(meme);
      setMemeHistory(prev => [meme, ...prev].slice(0, 10)); // 최근 10개 유지
    } else {
      alert('하트가 부족합니다! 5분 뒤에 다시 시도해주세요.');
    };
  };

  const handleShare = async () => {
    if (!currentMeme) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `[PICK-A-MEME] 내 운빨 밈! ${currentMeme.phrase.text}`,
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

  // 등급별 스타일 결정
  const getContainerStyle = () => {
    if (!currentMeme) return 'vibe-border';
    switch (currentMeme.recipe.rarity) {
      case 'legendary': return 'border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse';
      case 'rare': return 'border-4 border-purple-500 shadow-[4px 4px 0px #A855F7]';
      default: return 'vibe-border';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 헤더 / 스태미나 영역 */}
      <header className="w-full max-w-md flex justify-between items-center mb-8 p-4 vibe-border bg-black">
        <h1 className="text-2xl vibe-text text-white">밈.생.기</h1>
        <div className="flex flex-col items-end">
          {session ? (
            <div className="text-right">
              <p className="text-sm text-gray-300">반가워요, <span className="font-bold text-white">{(session.user?.name || session.user?.email || '유저')}</span>님!</p>
              <button 
                onClick={() => signOut()}
                className="mt-1 text-xs text-blue-400 hover:underline"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('kakao')}
              className="hover:opacity-90 transition-opacity active:scale-95 duration-200"
            >
              <img 
                src="/images/kakao/kakao_login_medium_wide.png" 
                alt="카카오 로그인" 
                className="h-10 w-auto"
              />
            </button>
          )}
          
          <div className="flex flex-col items-end mt-2">
            <div className="text-xl font-bold flex items-center gap-1">
              <span className="text-red-500">❤️</span>
              <span>{hearts} / {maxHearts}</span>
            </div>
            <div className="text-sm text-gray-300 font-mono">
              {hearts < maxHearts ? `다음 충전: ${formattedTime}` : 'MAX'}
            </div>
          </div>
        </div>
      </header>

      {/* 밈 뷰어 영역 (1:1 비율) */}
      <div className={`w-full max-w-md aspect-square bg-gray-900 relative overflow-hidden mb-8 flex items-center justify-center transition-all duration-300 ${getContainerStyle()}`}>
        {currentMeme ? (
          <>
            <img 
              src={currentMeme.background.url} 
              alt={currentMeme.background.alt}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* 워터마크 */}
            <div className="absolute bottom-2 right-2 z-30 opacity-60">
              <span className="text-[10px] font-black tracking-tighter bg-black text-white px-1 border border-white">
                PICK-A-MEME.COM
              </span>
            </div>

            {/* 등급 뱃지 */}
            <div className="absolute top-2 left-2 z-30">
              <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${
                currentMeme.recipe.rarity === 'legendary' ? 'bg-yellow-400 text-black' :
                currentMeme.recipe.rarity === 'rare' ? 'bg-purple-600 text-white' :
                'bg-gray-700 text-gray-300'
              }`}>
                {currentMeme.recipe.rarity}
              </span>
            </div>
            
            {/* 스티커 렌더링 */}
            {currentMeme.recipe.stickers.map((sticker, idx) => (
              <img
                key={`${sticker.id}-${idx}`}
                src={sticker.url}
                alt={sticker.name}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                  width: '64px',
                  height: '64px',
                  filter: sticker.rarity === 'legendary' ? 'drop-shadow(0 0 8px gold)' : 'drop-shadow(2px 2px 0px #000)',
                }}
              />
            ))}

            {/* 문구 렌더링 (랜덤 위치) */}
            <div 
              className="absolute z-10 p-4 w-full text-center"
              style={{
                left: '50%',
                top: `${currentMeme.recipe.textPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <h2 className={`text-3xl vibe-text break-keep transition-all ${
                currentMeme.recipe.rarity === 'legendary' ? 'text-yellow-300' : 'text-white'
              }`} 
              style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' }}>
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

        {/* 로컬 도감 - 최근 뽑은 밈 */} 
        {memeHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl vibe-text mb-4 text-white">내 보관함 (최근 10개)</h3>
            <div className="grid grid-cols-3 gap-2">
              {memeHistory.map((meme, index) => (
                <div 
                  key={index} 
                  className="relative w-full aspect-square bg-gray-800 border border-gray-700 overflow-hidden cursor-pointer"
                  onClick={() => setCurrentMeme(meme)}
                >
                  <img src={meme.background.url} alt="" className="w-full h-full object-cover opacity-60" />
                  <span className="absolute bottom-1 right-1 text-[8px] uppercase font-bold text-gray-400">{meme.recipe.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
