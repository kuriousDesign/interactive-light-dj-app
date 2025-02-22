'use client'; // <-- Add this line at the top

//import useSocket from '@/hooks/useSocket'; // Import the custom hook
import { useContext } from 'react';
import { SocketContext } from '@/contexts/SocketProvider'; // Adjust path to match your project structure
import { FixtureCfg } from '@libs/interfaces/fixture'; // Adjust to your fixture data type
import FixtureComponent from './FixtureComponent';
import FixtureControlRGBW from './FixtureControlRGBW';
import EventBtn from './EventBtn';


const ConorByrneLights = () => {
    const y1 = 50;
    const y2 = 150;
    const y3 = 0;
    const y4 = 500;
    const y5 = 700;
    const y6 = 600;
    const fixtureCfgs:FixtureCfg[] = [
        { label: "G1-LT", position: { x: 200, y: y1 } },
        { label: "G1-LB", position: { x: 200, y: y2 } },
        { label: "G1-RT", position: { x: 500, y: y1 } },
        { label: "G1-RB", position: { x: 500, y: y2 } },
        { label: "G2-L", position: { x: 100, y: y3 } },
        { label: "G2-R", position: { x: 600, y: y3 } },
        { label: "G3-1", position: { x: 50, y: y4 } },
        { label: "G4-2", position: { x: 200, y: y4 } },
        { label: "G3-3", position: { x: 350, y: y4 } },
        { label: "G4-4", position: { x: 500, y: y4 } },
        { label: "G3-5", position: { x: 650, y: y4 } },
    ];

    const groupsControlsCfgs:FixtureCfg[] = [
        { label: "G1-Backs", position: { x: 25, y: y5 } },
        { label: "G2-Curtains", position: { x: 200, y: y5 } },
        { label: "G3-Front-1,3,5", position: { x: 375, y: y5 } },
        { label: "G4-Front-2,4", position: { x: 550, y: y5 } },
    ]

    const sceneBtnsCfgs:FixtureCfg[] = [
        { label: "Scene1-BlueRed", position: { x: 25, y: y6 } },
        { label: "Scene2-", position: { x: 200, y: y6 } },
        { label: "Scene3-", position: { x: 375, y: y6 } },
        { label: "Scene4-", position: { x: 550, y: y6 } },
    ]

    // Use the useSocket hook to get the fixture data
    //const { fixtureData } = useSocket();
    // const { fixtureData } = useSocketContext();
    const sc = useContext(SocketContext); // Get fixture data from context
    const fixtureData = sc ? sc.fixtureData : null;
    const scene = sc ? sc.scene : null;
    // console.log('sc:', scene);

    //console.log('ConorByrneLights fixtureData:', fixtureData);

    let fixtures = null;
    let groupControls = null;
    let sceneBtns = null;
    if (!fixtureData) {
        // Handle the case where fixtureData is not available yet
        //return <div>Loading fixture data...</div>;
    } else {
        fixtures = fixtureCfgs.map((cfg, index) => (
            <FixtureComponent
                key={index}
                data={fixtureData[index]} // Red
                cfg={cfg}
            />
        ));

        groupControls = groupsControlsCfgs.map((cfg, index) => (
            <FixtureControlRGBW
                key={index}
                id = {index}
                controlType = {'groupSet'}
                cfg={cfg}
            />
        ));

        sceneBtns = sceneBtnsCfgs.map((cfg, index) => (
            <EventBtn
                key={index}
                id = {index}
                controlType = {'sceneSet'}
                cfg={cfg}
            />
        ));
    }

    return (
        <div className="w-full h-full bg-white">
            <div className="relative flex h-screen w-screen">
                {fixtures}
                <div className="absolute top-5 left-0 w-full h-6 text-black bg-purple-500 text-center">
                    scene: {scene}
                </div>
                {groupControls}
                {sceneBtns}
            </div>
        </div>
    );
};

export default ConorByrneLights;

