import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bridge, Snapshot } from '@/lib/types';
import { BridgeService } from '@/lib/services/bridge-service';

interface BridgeContextType {
  bridges: Bridge[];
  loading: boolean;
  createSnapshot: (snapshotData: Omit<Snapshot, 'id' | 'createdAt' | 'likeCount' | 'saveCount'>) => Promise<Snapshot>;
  createBridge: (leftSnapshotId: string, rightSnapshotId: string, themes: string[]) => Promise<Bridge>;
  refreshBridges: () => Promise<void>;
}

const BridgeContext = createContext<BridgeContextType | undefined>(undefined);

export const BridgeProvider = ({ children }: { children: ReactNode }) => {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBridges = async () => {
    try {
      setLoading(true);
      const allBridges = await BridgeService.getAllBridges();
      setBridges(allBridges);
    } catch (error) {
      console.error('Error loading bridges:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSnapshot = async (snapshotData: Omit<Snapshot, 'id' | 'createdAt' | 'likeCount' | 'saveCount'>): Promise<Snapshot> => {
    const snapshot = await BridgeService.createSnapshot(snapshotData);
    return snapshot;
  };

  const createBridge = async (leftSnapshotId: string, rightSnapshotId: string, themes: string[]): Promise<Bridge> => {
    const bridge = await BridgeService.createBridge(leftSnapshotId, rightSnapshotId, themes);
    setBridges(prev => [bridge, ...prev]);
    return bridge;
  };

  const refreshBridges = async () => {
    await loadBridges();
  };

  useEffect(() => {
    loadBridges();
  }, []);

  return (
    <BridgeContext.Provider value={{
      bridges,
      loading,
      createSnapshot,
      createBridge,
      refreshBridges,
    }}>
      {children}
    </BridgeContext.Provider>
  );
};

export const useBridges = () => {
  const context = useContext(BridgeContext);
  if (context === undefined) {
    throw new Error('useBridges must be used within a BridgeProvider');
  }
  return context;
};
