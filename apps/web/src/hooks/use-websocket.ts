import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToastStore } from '@/lib/store/toast-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

    // Connect to the notifications namespace
    const socket = io(`${SOCKET_URL}/notifications`, {
      query: { userId },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notifications gateway');
    });

    socket.on('notification', (data: NotificationPayload) => {
      addToast({
        title: data.title,
        description: data.message,
        type: data.type === 'error' ? 'error' : data.type === 'success' ? 'success' : 'info',
      });
    });

    socket.on('order_updated', (order: OrderUpdatePayload) => {
      console.log('Order updated via WS:', order);
      // You could trigger a re-fetch of orders here if you have a store
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notifications gateway');
    });

    return () => {
      socket.disconnect();
    };
  }, [addToast, userId]);
}
