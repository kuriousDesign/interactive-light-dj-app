'use client';

import { createContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FixtureData } from '@/types/fixture';

export const SocketContext = createContext<{
  socket: Socket | null;
  fixtureData: FixtureData[] | null;
  scene: string | null;
  setFixtureData: React.Dispatch<React.SetStateAction<FixtureData[] | null>>;
  sendEvent: (event: string, data: any) => void;
}>({
  socket: null,
  fixtureData: null,
  scene: null,
  setFixtureData: () => {},
  sendEvent: () => {},
});

interface Props {
  children: React.ReactNode;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5000';

export default function SocketProvider({ children }: Props) {
  const socketRef = useRef<Socket | null>(null);
  const [fixtureData, setFixtureData] = useState<FixtureData[] | null>(null);
  const [scene, setScene] = useState<string | null>(null);

  useEffect(() => {
    // Initialize socket connection on first render
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log(`Connected to socket server: ${socketRef.current?.id}`);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    socketRef.current.on('data', (data) => {
      setFixtureData(data.message); // Update fixture data state
    });

    socketRef.current.on('event', (data) => {
      console.log('Received event:', data);
      if (data.event_type === 'scene') {
        setScene(data.name); // Update fixture data state
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Function to send events from any component
  const sendEvent = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.error('Socket is not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, fixtureData, scene, setFixtureData, sendEvent }}>
      {children}
    </SocketContext.Provider>
  );
}
