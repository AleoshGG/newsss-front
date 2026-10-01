'use client';

import { useTransition, useEffect, useState } from 'react';
import { syncYouTubeVideos, getLastSearchAtAction } from '../youtube.controller';
import { Button } from '@/components/ui/button';

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    getLastSearchAtAction().then(date => {
      if (date) setLastSync(new Date(date));
    });
  }, []);

  useEffect(() => {
    if (!lastSync) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSync = new Date(lastSync.getTime() + 60 * 60 * 1000); // 1 hora después
      const diff = nextSync.getTime() - now.getTime();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSync]);

  function handleClick() {
    startTransition(async () => {
      await syncYouTubeVideos();
      const updatedDate = await getLastSearchAtAction();
      if (updatedDate) setLastSync(new Date(updatedDate));
    });
  }

  const isDisabled = isPending || timeLeft > 0;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isDisabled}
      className="text-xs font-semibold"
    >
      {isPending 
        ? '⏳ Sincronizando...' 
        : timeLeft > 0 
          ? `Espera ${formatTime(timeLeft)}` 
          : 'Actualizar'}
    </Button>
  );
}
