type TelemetryCallback = (data: {
  machineId: string;
  sound: number;
  temperature: number;
  pressure: number;
  timestamp: string;
}) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private intervalId: number | null = null;
  private subscribers: Set<TelemetryCallback> = new Set();
  private isConnected = false;

  public connect(url?: string) {
    if (url && typeof WebSocket !== 'undefined') {
      try {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
          this.isConnected = true;
          console.log('[SCADA WebSocket] Connected to live industrial gateway');
        };
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.broadcast(data);
          } catch (e) {
            console.error('[SCADA WebSocket] Failed to parse frame:', e);
          }
        };
        this.socket.onerror = () => {
          this.fallbackToSimulation();
        };
        this.socket.onclose = () => {
          this.isConnected = false;
          this.fallbackToSimulation();
        };
        return;
      } catch {
        this.fallbackToSimulation();
      }
    }
    this.fallbackToSimulation();
  }

  private fallbackToSimulation() {
    if (this.intervalId) return;
    this.isConnected = true;
    this.intervalId = window.setInterval(() => {
      const payload = {
        machineId: 'mch-pmp-01',
        sound: Number((68 + (Math.random() - 0.5) * 6).toFixed(1)),
        temperature: Number((56 + (Math.random() - 0.5) * 2.5).toFixed(1)),
        pressure: Number((4.7 + (Math.random() - 0.5) * 0.4).toFixed(2)),
        timestamp: new Date().toISOString(),
      };
      this.broadcast(payload);
    }, 2000);
  }

  public subscribe(cb: TelemetryCallback): () => void {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private broadcast(data: any) {
    this.subscribers.forEach(cb => cb(data));
  }

  public disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }

  public getStatus() {
    return this.isConnected;
  }
}

export const scadaWebSocketService = new WebSocketService();
