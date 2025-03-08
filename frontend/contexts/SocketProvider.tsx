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
  'http://robot.local:5000', //
  'http://192.168.20.123:5000', // Conor Byrne Coop Private
  'http://127.0.0.1:5000', // Localhost
  'http://192.168.0.149:5000', // Another local IP
];

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [fixtureData, setFixtureData] = useState<FixtureRGBW[] | null>(null);
  const [scene, setScene] = useState<string | null>(null);
  const serverIndex = useRef(0);
  const isConnected = useRef(false);

  useEffect(() => {
    const tryNextServer = () => {
      if (isConnected.current) return; // Stop trying once connected

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const serverUrl = SERVER_URLS[serverIndex.current];
      console.log(`Trying to connect to: ${serverUrl}`);

      socketRef.current = io(serverUrl, { 
        transports: ['websocket'], 
        reconnection: false, 
        timeout: 500 // Set connection timeout to 500ms
      });

      socketRef.current.on('connect', () => {
        console.log(`Connected to ${serverUrl}`);
        isConnected.current = true; // Mark as connected
      });

      socketRef.current.on('connect_error', () => {
        console.warn(`Connection failed: ${serverUrl}`);
        serverIndex.current = (serverIndex.current + 1) % SERVER_URLS.length;
        
        if (!isConnected.current) {
          setTimeout(tryNextServer, 50); // Move to the next server after 50ms
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log(`Disconnected: ${reason}`);
        isConnected.current = false; // Mark as disconnected and retry
        setTimeout(tryNextServer, 50); // Retry quickly after disconnect
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
      isConnected.current = false; // Reset connection state
    };
  }, []);

  const sendEvent = (event: string, data: unknown) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, fixtureData, scene, setFixtureData, sendEvent }}>
      {children}
    </SocketContext.Provider>
  );
}
