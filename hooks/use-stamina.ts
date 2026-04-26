'use client';

import { useState, useEffect } from 'react';
import { StaminaState } from '@/types';

const MAX_HEARTS = 5;
const RECHARGE_TIME_MS = 5 * 60 * 1000; // 5 minutes

export function useStamina() {
  const [stamina, setStamina] = useState<StaminaState>({
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    nextRechargeAt: null,
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // 초기화 (로컬 스토리지에서 불러오기) - 추후 서버/Redis 연동으로 교체
  useEffect(() => {
    const stored = localStorage.getItem('meme_stamina');
    if (stored) {
      const parsed: StaminaState = JSON.parse(stored);
      setStamina(parsed);
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('meme_stamina', JSON.stringify(stamina));
  }, [stamina]);

  // 타이머 틱
  useEffect(() => {
    const interval = setInterval(() => {
      if (stamina.hearts < stamina.maxHearts && stamina.nextRechargeAt) {
        const now = Date.now();
        const diff = stamina.nextRechargeAt - now;

        if (diff <= 0) {
          // 하트 충전 완료
          setStamina((prev) => {
            const newHearts = Math.min(prev.hearts + 1, prev.maxHearts);
            const nextRechargeAt =
              newHearts < prev.maxHearts ? now + RECHARGE_TIME_MS : null;
            return { ...prev, hearts: newHearts, nextRechargeAt };
          });
        } else {
          setTimeRemaining(diff);
        }
      } else {
        setTimeRemaining(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stamina]);

  const consumeHeart = (): boolean => {
    if (stamina.hearts > 0) {
      setStamina((prev) => {
        const newHearts = prev.hearts - 1;
        // 이미 충전 중이 아니라면 새로운 충전 시작
        const nextRechargeAt = prev.nextRechargeAt || Date.now() + RECHARGE_TIME_MS;
        return { ...prev, hearts: newHearts, nextRechargeAt };
      });
      return true;
    }
    return false;
  };

  const formattedTime = timeRemaining > 0
    ? `${Math.floor(timeRemaining / 60000).toString().padStart(2, '0')}:${Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0')}`
    : 'MAX';

  return {
    hearts: stamina.hearts,
    maxHearts: stamina.maxHearts,
    formattedTime,
    consumeHeart,
  };
}
