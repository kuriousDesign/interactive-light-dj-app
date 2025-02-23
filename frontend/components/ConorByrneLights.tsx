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
        { label: "BlueRed", position: { x: 25, y: y6 } },
        { label: "TealPurp", position: { x: 200, y: y6 } },
        { label: "RedWhite", position: { x: 375, y: y6 } },
        { label: "Joker", position: { x: 550, y: y6 } },
        { label: "Red", position: { x: 725, y: y6 } },
        { label: "Blue", position: { x: 900, y: y6 } },
        { label: "Jibraltar", position: { x: 1075, y: y6 } },
        { label: "Summer", position: { x: 1250, y: y6 } },
    ]

    // Use the useSocket hook to get the fixture data
    //const { fixtureData } = useSocket();
    // const { fixtureData } = useSocketContext();
    const sc = useContext(SocketContext); // Get fixture data from context
    let fixtureData = sc ? sc.fixtureData : null;
    const scene = sc ? sc.scene : null;
    // console.log('sc:', scene);

    //console.log('ConorByrneLights fixtureData:', fixtureData);

    let fixtures = null;
    let groupControls = null;
    let sceneBtns = null;
    if (!fixtureData) {
        fixtureData = fixtureCfgs.map(() => ({
            r: 0,
            g: 0,
            b: 0,
            w: 0
        }));
    } else {
        //
    }
    fixtures = fixtureCfgs.map((cfg, index) => (
        <FixtureComponent
            key={index}
            data={fixtureData[index]} 
            cfg={cfg}
        />
    ));

    groupControls = groupsControlsCfgs.map((cfg, index) => {
        let marginTop = 0;
        if (index === 0) {
            marginTop = 0;
        } else {
            marginTop = 4;
        }
    
        // Build the margin-top class string dynamically
        const marginTopClass = `mt-[${marginTop}px]`;

 
        return (
            <div key={`div-${index}`}>
                <div
                    key={`spacer-${index}`}
                    className={`h-${marginTop}`}
                />
    
                <FixtureControlRGBW
                    className={marginTopClass}
                    key={index}
                    id={index}
                    controlType={'groupSet'}
                    cfg={cfg}
                />
             </div>
        );
    });
    
    sceneBtns = sceneBtnsCfgs.map((cfg, index) => (
        <EventBtn
            key={index}
            id = {index}
            controlType = {'sceneSet'}
            cfg={cfg}
        />
    ));

    return (
        <div className="flex flex-wrap items-center justify-center">
            <div className="sticky top-0 z-50 w-full">
                <div className='w-full text-center mb-0 items-center z-50 bg-secondary'>
                    {'The Byrne'}
                </div>
                <div className="bg-primary mb-5 text-center">
                    Scene {scene}
                </div>
            </div>
  
            <div className="hidden w-full h-full">
                {fixtures}
            </div>
            <div className="flex flex-col gap-1 w-full space-y-4 mb-10">
                {groupControls}
            </div>
            <div className="flex h-20 w-full bg-alarm mt-2">
                Scenes
            </div>
            <div className="flex flex-wrap gap-4 mt-1 justify-start">
                {sceneBtns}
            </div>

        </div>
    );
};

export default ConorByrneLights;

