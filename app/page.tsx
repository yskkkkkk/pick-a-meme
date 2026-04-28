'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useStamina } from '@/hooks/use-stamina';
import { generateRandomMeme } from '@/lib/meme-engine';
import { saveMeme, getUserMemes } from '@/lib/meme-storage';
import { GeneratedMeme } from '@/types';

type Tab = 'generate' | 'warehouse';

export default function Home() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const { hearts, maxHearts, formattedTime, consumeHeart } = useStamina();

  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [currentMeme, setCurrentMeme] = useState<GeneratedMeme | null>(null);
  const [memeHistory, setMemeHistory] = useState<GeneratedMeme[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [warehouseMemes, setWarehouseMemes] = useState<GeneratedMeme[]>([]);
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const memeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('meme_history');
    if (stored) setMemeHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('meme_history', JSON.stringify(memeHistory));
  }, [memeHistory]);

  useEffect(() => {
    if (activeTab === 'warehouse' && userId) {
      setIsLoadingWarehouse(true);
      getUserMemes(userId)
        .then(setWarehouseMemes)
        .catch(console.error)
        .finally(() => setIsLoadingWarehouse(false));
    }
  }, [activeTab, userId]);

  const doGenerate = async () => {
    if (!consumeHeart()) {
      return;
    }
    const meme = generateRandomMeme();
    setCurrentMeme(meme);
    setMemeHistory(prev => [meme, ...prev].slice(0, 10));

    if (userId) {
      setIsSaving(true);
      saveMeme(userId, meme)
        .catch(console.error)
        .finally(() => setIsSaving(false));
    }
  };

  const handleGenerateClick = () => {
    if (hearts <= 0) return;
    if (!session) {
      setShowLoginPrompt(true);
    } else {
      doGenerate();
    }
  };

  const handlePromptContinue = () => {
    setShowLoginPrompt(false);
    doGenerate();
  };

  const handlePromptLogin = () => {
    setShowLoginPrompt(false);
    signIn('kakao');
  };

  const handleShare = async () => {
    if (!currentMeme) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `[PICK-A-MEME] ${currentMeme.phrase.text}`,
          text: currentMeme.phrase.text,
          url: window.location.href,
        });
      } catch {
        // user cancelled or browser unsupported
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };

  const handleDownload = async () => {
    if (!currentMeme || !memeRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(memeRef.current, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `pick-a-meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getRarityBorder = () => {
    if (!currentMeme) return 'vibe-border';
    switch (currentMeme.recipe.rarity) {
      case 'legendary': return 'border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse';
      case 'rare': return 'border-4 border-purple-500 shadow-[4px_4px_0px_#A855F7]';
      default: return 'vibe-border';
    }
  };

  const getRarityBadgeStyle = () => {
    if (!currentMeme) return '';
    switch (currentMeme.recipe.rarity) {
      case 'legendary': return 'bg-yellow-400 text-black';
      case 'rare': return 'bg-purple-600 text-white';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pb-16">

      {/* 헤더 */}
      <header className="w-full max-w-md flex justify-between items-center mb-6 p-4 vibe-border bg-black">
        <h1 className="text-2xl vibe-text text-white">밈.생.기</h1>
        <div className="flex flex-col items-end gap-1">
          {session ? (
            <div className="text-right">
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">{session.user?.name || '유저'}</span>님 환영해요
              </p>
              <button onClick={() => signOut()} className="text-xs text-blue-400 hover:underline">
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('kakao')}
              className="hover:opacity-90 transition-opacity active:scale-95 duration-200"
            >
              <img src="/images/kakao/kakao_login_medium_wide.png" alt="카카오 로그인" className="h-10 w-auto" />
            </button>
          )}
          <div className="text-right">
            <div className="text-lg font-bold flex items-center gap-1 justify-end">
              <span>❤️</span>
              <span>{hearts} / {maxHearts}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {hearts < maxHearts ? `다음 충전: ${formattedTime}` : 'MAX'}
            </div>
          </div>
        </div>
      </header>

      {/* 탭 - 로그인 시에만 창고 탭 표시 */}
      {session && (
        <div className="w-full max-w-md flex mb-6 border-4 border-[#00FF00]">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 font-black text-sm uppercase transition-colors ${
              activeTab === 'generate'
                ? 'bg-[#00FF00] text-black'
                : 'bg-black text-[#00FF00] hover:bg-gray-900'
            }`}
          >
            🎲 밈 뽑기
          </button>
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`flex-1 py-2 font-black text-sm uppercase transition-colors ${
              activeTab === 'warehouse'
                ? 'bg-[#00FF00] text-black'
                : 'bg-black text-[#00FF00] hover:bg-gray-900'
            }`}
          >
            📦 내 창고
          </button>
        </div>
      )}

      {/* ─── 밈 뽑기 탭 ─── */}
      {activeTab === 'generate' && (
        <>
          {/* 밈 캔버스 */}
          <div
            ref={memeRef}
            className={`w-full max-w-md aspect-square bg-gray-900 relative overflow-hidden mb-6 flex items-center justify-center transition-all duration-300 ${getRarityBorder()}`}
          >
            {currentMeme ? (
              <>
                <img
                  src={currentMeme.background.url}
                  alt={currentMeme.background.alt}
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />

                {/* 등급 뱃지 */}
                <div className="absolute top-2 left-2 z-30">
                  <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${getRarityBadgeStyle()}`}>
                    {currentMeme.recipe.rarity}
                  </span>
                </div>

                {/* 스티커 */}
                {currentMeme.recipe.stickers.map((sticker, idx) => (
                  <img
                    key={`${sticker.id}-${idx}`}
                    src={sticker.url}
                    alt={sticker.name}
                    crossOrigin="anonymous"
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

                {/* 문구 */}
                <div
                  className="absolute z-10 p-4 w-full text-center"
                  style={{
                    left: '50%',
                    top: `${currentMeme.recipe.textPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <h2
                    className={`text-3xl vibe-text break-keep ${
                      currentMeme.recipe.rarity === 'legendary' ? 'text-yellow-300' : 'text-white'
                    }`}
                    style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}
                  >
                    {currentMeme.phrase.text}
                  </h2>
                </div>

                {/* 워터마크 - 비로그인: 중앙 못생긴 버전 */}
                {!session && (
                  <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
                    <div
                      className="text-white font-black text-2xl tracking-widest select-none"
                      style={{
                        opacity: 0.45,
                        transform: 'rotate(-25deg)',
                        textShadow: '3px 3px 0 #FF00FF, -3px -3px 0 #00FF00',
                        letterSpacing: '0.15em',
                        fontSize: 'clamp(18px, 6vw, 28px)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      PICK-A-MEME.COM
                    </div>
                  </div>
                )}

                {/* 워터마크 - 로그인: 하단 자연스러운 버전 */}
                {session && (
                  <div className="absolute bottom-2 right-2 z-30 pointer-events-none">
                    <span className="text-[9px] font-semibold tracking-tight text-white/50 select-none">
                      PICK-A-MEME
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-400 font-bold text-xl mb-2">아직 뽑은 밈이 없어요.</p>
                <p className="text-gray-500 text-sm">하트를 소모해서 랜덤 밈을 생성해보세요!</p>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="w-full max-w-md flex flex-col gap-3">
            {/* 하트 소진 시 비로그인 유도 문구 */}
            {hearts <= 0 && !session && (
              <div className="text-center py-3 border-4 border-[#FF00FF] bg-black">
                <p className="text-[#FF00FF] font-black text-sm">하트가 모두 소진됐어요!</p>
                <p className="text-gray-400 text-xs mt-1">로그인하면 저장·다운로드·보관함도 쓸 수 있어요</p>
                <button
                  onClick={() => signIn('kakao')}
                  className="mt-2 hover:opacity-90 transition-opacity"
                >
                  <img src="/images/kakao/kakao_login_medium_wide.png" alt="카카오 로그인" className="h-9 w-auto mx-auto" />
                </button>
              </div>
            )}

            <button
              onClick={handleGenerateClick}
              disabled={hearts <= 0}
              className={`w-full py-4 text-2xl font-black rounded-none ${
                hearts > 0 ? 'vibe-button' : 'bg-gray-600 text-gray-400 border-4 border-gray-500 cursor-not-allowed'
              }`}
            >
              {hearts > 0 ? '🎲 밈 뽑기 (❤️ -1)' : '하트 충전 중...'}
            </button>

            {currentMeme && (
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 text-base font-bold bg-blue-600 text-white border-4 border-white hover:bg-blue-700 transition-colors"
                  style={{ boxShadow: '4px 4px 0px #00FF00' }}
                >
                  📤 공유하기
                </button>

                {session && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 text-base font-bold bg-green-600 text-white border-4 border-white hover:bg-green-700 transition-colors"
                    style={{ boxShadow: '4px 4px 0px #FF00FF' }}
                  >
                    ⬇️ 저장하기
                  </button>
                )}
              </div>
            )}

            {isSaving && (
              <p className="text-center text-xs text-gray-500">창고에 저장 중...</p>
            )}

            {/* 비로그인 최근 히스토리 */}
            {!session && memeHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg vibe-text mb-3 text-white">최근 뽑기 (이번 세션만)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {memeHistory.map((meme, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square bg-gray-800 border border-gray-700 overflow-hidden cursor-pointer hover:border-[#00FF00] transition-colors"
                      onClick={() => setCurrentMeme(meme)}
                    >
                      <img src={meme.background.url} alt="" className="w-full h-full object-cover opacity-60" />
                      <span className="absolute bottom-1 right-1 text-[7px] uppercase font-bold text-gray-400">
                        {meme.recipe.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── 창고 탭 ─── */}
      {activeTab === 'warehouse' && session && (
        <div className="w-full max-w-md">
          {isLoadingWarehouse ? (
            <div className="text-center py-16 text-gray-500">불러오는 중...</div>
          ) : warehouseMemes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 font-bold text-lg mb-2">창고가 비어있어요.</p>
              <p className="text-gray-500 text-sm">밈을 뽑으면 자동으로 여기 쌓여요!</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-xs mb-4 text-right">총 {warehouseMemes.length}개</p>
              <div className="grid grid-cols-3 gap-2">
                {warehouseMemes.map((meme, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square bg-gray-800 border border-gray-700 overflow-hidden cursor-pointer hover:border-[#00FF00] transition-colors"
                    onClick={() => {
                      setCurrentMeme(meme);
                      setActiveTab('generate');
                    }}
                  >
                    <img src={meme.background.url} alt="" className="w-full h-full object-cover opacity-60" />
                    <span className={`absolute top-1 left-1 text-[7px] uppercase font-bold px-1 ${
                      meme.recipe.rarity === 'legendary' ? 'bg-yellow-400 text-black' :
                      meme.recipe.rarity === 'rare' ? 'bg-purple-600 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {meme.recipe.rarity}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 로그인 유도 모달 (비로그인 뽑기 전) */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 pb-8 px-4">
          <div className="w-full max-w-md bg-black border-4 border-[#FF00FF] p-6" style={{ boxShadow: '6px 6px 0px #00FF00' }}>
            <h2 className="text-xl font-black text-white mb-1">잠깐, 로그인하면 더 재밌어요!</h2>
            <ul className="text-sm text-gray-400 mb-5 space-y-1 list-none">
              <li>✅ 뽑은 밈 영구 저장</li>
              <li>✅ PNG 이미지 다운로드</li>
              <li>✅ 내 보관함에서 모아보기</li>
              <li>✅ 깔끔한 워터마크 (하단 작게)</li>
            </ul>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePromptLogin}
                className="w-full hover:opacity-90 transition-opacity active:scale-95"
              >
                <img src="/images/kakao/kakao_login_large_wide.png" alt="카카오 로그인" className="h-12 w-auto mx-auto" />
              </button>
              <button
                onClick={handlePromptContinue}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors border border-gray-700"
              >
                괜찮아, 그냥 뽑을게 →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
