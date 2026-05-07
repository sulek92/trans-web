import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import { useToastStore } from '@/lib/store/toast-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const IS_DEV = process.env.NODE_ENV !== 'production';

type NotificationPayload = {
  title: string;
  message: string;
  type?: string;
};

type OrderUpdatePayload = {
  id?: string;
  status?: string;
};

export function useWebsocket(userId?: string): void {
  const socketRef = useRef<Socket | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (!userId) return;

    let socket: Socket | null = null;

    import('socket.io-client').then(({ io }) => {
      if (!socketRef.current) {
        socket = io(`${SOCKET_URL}/notifications`, {
          query: { userId },
          transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          if (IS_DEV) console.log('Connected to notifications gateway');
        });

        socket.on('notification', (data: NotificationPayload) => {
          addToast({
            title: data.title,
            description: data.message,
            type: data.type === 'error' ? 'error' : data.type === 'success' ? 'success' : 'info',
          });
        });

        socket.on('order_updated', (order: OrderUpdatePayload) => {
          if (IS_DEV) console.log('Order updated via WS:', order);
        });

        socket.on('disconnect', () => {
          if (IS_DEV) console.log('Disconnected from notifications gateway');
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [addToast, userId]);
}
