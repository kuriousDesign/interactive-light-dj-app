'use client';

import { createContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FixtureRGBW } from '@libs/interfaces/fixture';

export const SocketContext = createContext<{
  socket: Socket | null;
  fixtureData: FixtureRGBW[] | null;
  scene: string | null;
  setFixtureData: React.Dispatch<React.SetStateAction<FixtureRGBW[] | null>>;
  sendEvent: (event: string, data: unknown) => void;
}>({
  socket: null,
  fixtureData: null,
  scene: null,
  setFixtureData: () => {},
  sendEvent: () => {},
});

// List of possible Socket.IO server addresses
const SERVER_URLS = [
  'http://robot:5000', //billy's network
  'http://127.0.0.1:5000', // localhost
  'http://192.168.0.149:5000',
  //'http://localhost:5000', // Fallback to localhost
];

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [fixtureData, setFixtureData] = useState<FixtureRGBW[] | null>(null);
  const [scene, setScene] = useState<string | null>(null);
  const serverIndex = useRef(0);

  useEffect(() => {
    const tryNextServer = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const serverUrl = SERVER_URLS[serverIndex.current];
      console.log(`Trying to connect to: ${serverUrl}`);

      socketRef.current = io(serverUrl, { transports: ['websocket'], reconnection: false });

      socketRef.current.on('connect', () => {
        console.log(`Connected to ${serverUrl}`);
      });

      socketRef.current.on('connect_error', () => {
        console.warn(`Connection failed: ${serverUrl}`);
        serverIndex.current = (serverIndex.current + 1) % SERVER_URLS.length;
        let waitTimeMs = 1; 
        if (serverIndex.current === 0) {
          waitTimeMs = 3000; // 5 seconds for the first retry
        }
        setTimeout(tryNextServer, waitTimeMs); // Try the next server after 2 seconds
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log(`Disconnected: ${reason}`);
      });

      socketRef.current.on('data', (data) => {
        setFixtureData(data.message);
      });

      socketRef.current.on('event', (data) => {
        console.log('Received event:', data);
        if (data.event_type === 'scene') {
          setScene(data.name);
        }
      });
    };

    tryNextServer();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendEvent = (event: string, data: unknown) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      // console.error('Socket is not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, fixtureData, scene, setFixtureData, sendEvent }}>
      {children}
    </SocketContext.Provider>
  );
}
