'use client';

import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface SyncContextType {
  isGlobalSyncing: boolean;
  startGlobalSync: (syncPromise: Promise<any>) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);

  const startGlobalSync = (syncPromise: Promise<any>) => {
    setIsGlobalSyncing(true);

    toast.promise(syncPromise, {
      loading: 'Actualizando info...',
      success: '¡Información actualizada con éxito!',
      error: 'Error durante la actualización',
      finally: () => {
        setIsGlobalSyncing(false);
      }
    });
  };

  return (
    <SyncContext.Provider value={{ isGlobalSyncing, startGlobalSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
