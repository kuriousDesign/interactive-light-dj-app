// 'use client'; // Mark as a client component

// import { createContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { FixtureData } from '@/types/fixture';

// export const SocketContext = createContext<{
//   socket: Socket | undefined,
//   fixtureData: FixtureData[] | null;
// }>({
//   socket: undefined,
//   fixtureData: null,
// });

// interface Props {
//   children: React.ReactNode;
// }

// const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5000';

// export default function SocketProvider({ children }: Props) {
//   const [socket] = useState(io(SERVER_URL, { transports: ['websocket'] }));
//   //const [fixtureData, setFixtureData] = useState<FixtureData[] | null>(null);
//   let fixtureData: FixtureData[] | null = null;

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log(`Connected to socket server: ${socket.id}`);
//     });

//     socket.on('disconnect', (reason) => {
//       console.log(`Disconnected: ${reason}`);
//     });

//     socket.on('data', (data:FixtureData[]) => {
//       //console.log('Received fixture data:', data.message[0]);
//       fixtureData = data.message || null;
//     });

//     // return () => {
//     //   socket.disconnect(); // Clean up when the component is unmounted
//     // };
//   }, [fixtureData]);

//   return (
//     <SocketContext.Provider value={ socket, fixtureData }>{children}</SocketContext.Provider>
//   );
// }

'use client';

import { createContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FixtureData } from '@/types/fixture';

export const SocketContext = createContext<{
  socket: Socket | undefined;
  fixtureData: FixtureData[] | null;
  setFixtureData: React.Dispatch<React.SetStateAction<FixtureData[] | null>>;
}>({
  socket: undefined,
  fixtureData: null,
  setFixtureData: () => {},
});

interface Props {
  children: React.ReactNode;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5000';

export default function SocketProvider({ children }: Props) {
  const socketRef = useRef<Socket | null>(null);
  const [fixtureData, setFixtureData] = useState<FixtureData[] | null>(null);

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
      // console.log('Received fixture data:', data);
      setFixtureData(data.message); // Update the fixtureData state
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, fixtureData, setFixtureData }}>
      {children}
    </SocketContext.Provider>
  );
}
