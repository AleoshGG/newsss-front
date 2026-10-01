'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { syncGoogleNewsArticlesAction } from '../googlenews.actions';

export function GoogleNewsSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast.info('Sincronizando Google News...');
    try {
      const result = await syncGoogleNewsArticlesAction(true);
      if (result.success) {
        toast.success(`Sincronización exitosa. Se obtuvieron ${result.count} artículos.`);
      } else {
        toast.error('Error al sincronizar Google News');
      }
    } catch (_error) {
      toast.error('Error al sincronizar Google News');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSync}
      disabled={isSyncing}
      className="gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Sincronizando...' : 'Sincronizar Noticias'}
    </Button>
  );
}
