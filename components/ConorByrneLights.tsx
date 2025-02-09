'use client'; // <-- Add this line at the top

//import useSocket from '@/hooks/useSocket'; // Import the custom hook
import { useContext } from 'react';
import { SocketContext } from '@/contexts/SocketProvider'; // Adjust path to match your project structure
import { FixtureCfg } from '@/types/fixture'; // Adjust to your fixture data type
import FixtureComponent from './FixtureComponent';


const ConorByrneLights = () => {
    const y1 = 50;
    const y2 = 150;
    const y3 = 0;
    const y4 = 500;
    const fixtureCfgs:FixtureCfg[] = [
        { label: "G1-LT", position: { x: 200, y: y1 } },
        { label: "G1-LB", position: { x: 200, y: y2 } },
        { label: "G1-RT", position: { x: 500, y: y1 } },
        { label: "G1-RB", position: { x: 500, y: y2 } },
        { label: "G2-L", position: { x: 100, y: y3 } },
        { label: "G2-R", position: { x: 600, y: y3 } },
        { label: "G3-1", position: { x: 50, y: y4 } },
        { label: "G3-3", position: { x: 350, y: y4 } },
        { label: "G3-5", position: { x: 650, y: y4 } },
        { label: "G4-2", position: { x: 200, y: y4 } },
        { label: "G4-4", position: { x: 500, y: y4 } },
    ];

    // Use the useSocket hook to get the fixture data
    //const { fixtureData } = useSocket();
    // const { fixtureData } = useSocketContext();
    const sc = useContext(SocketContext); // Get fixture data from context
    const fixtureData = sc ? sc.fixtureData : null;

    //console.log('ConorByrneLights fixtureData:', fixtureData);


    if (!fixtureData) {
        // Handle the case where fixtureData is not available yet
        return <div>Loading fixture data...</div>;
    }

    const fixtures = fixtureCfgs.map((cfg, index) => (
        <FixtureComponent
            key={index}
            data={fixtureData[index]} // Red
            cfg={cfg}
        />
    ));

    return (
        <div className="relative flex h-screen w-screen">
            {fixtures}
        </div>
    );
};

export default ConorByrneLights;

