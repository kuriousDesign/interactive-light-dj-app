'use client'; // Mark as a client component

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FixtureData } from '@/types/fixture';

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5000';

export default function useSocket() {
  const [socket] = useState(io(SERVER_URL, { transports: ['websocket'] }));
  const [fixtureData, setFixtureData] = useState<FixtureData[] | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to socket server: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    socket.on('data', (data) => {
      console.log('Received fixture data:', data);
      setFixtureData(data.message); // Assuming `data.message` is the fixture data
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, [socket]);

  return { socket, fixtureData };
}
