import { useEffect, useState } from 'react';
import { scadaWebSocketService } from '../services/websocketService';
import { useAppStore } from '../store/appStore';

export function useLiveUpdates() {
  const isStreaming = useAppStore(state => state.isLiveStreaming);
  const [latestPacket, setLatestPacket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!isStreaming) {
      scadaWebSocketService.disconnect();
      setIsConnected(false);
      return;
    }

    scadaWebSocketService.connect();
    setIsConnected(true);

    const unsubscribe = scadaWebSocketService.subscribe((data) => {
      setLatestPacket(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isStreaming]);

  return {
    latestPacket,
    isConnected,
  };
}
