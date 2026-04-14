import { useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '@/config/constants';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { Notification } from '@/types';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const token = useAuthStore((s) => s.token);

  const connect = useCallback(() => {
    if (!token) return;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => { retryRef.current = 0; };

    ws.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        addNotification({ ...data, read: false });
        toast.info(data.message, { position: 'bottom-right' });
      } catch {}
    };

    ws.onclose = () => {
      const delay = Math.min(1000 * 2 ** retryRef.current, 30000);
      retryRef.current++;
      setTimeout(connect, delay);
    };

    ws.onerror = () => ws.close();
  }, [token, addNotification]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);
}
