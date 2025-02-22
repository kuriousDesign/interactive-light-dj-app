import React, { useState, useEffect, useContext } from 'react';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, hsvaToRgba } from '@uiw/color-convert';
import { SocketContext } from '@/contexts/SocketProvider';
import { FixtureControlProps } from '@libs/interfaces/fixture';


const FixtureControlRGBW = ({ id, controlType, cfg }: FixtureControlProps) => {
    // const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
    const { sendEvent } = useContext(SocketContext);
    const { label, position } = cfg;
    const dummyRGBW = { r: 255, g: 0, b: 0, w: 0 }; // Dummy RGBW values

    const handleClick = () => {
        sendEvent('buttonPress', { controlType, id, color: dummyRGBW });
    };

    // useEffect to trigger sendEvent when `hsva` or `brightness` changes
    useEffect(() => {
        ///const newRgbColor = hsvaToRgba(hsva);
        
    }, []); // Dependency array ensures it updates when hsva changes

    return (
        <div 
            className='absolute w-max'
            style={{ left: position.x, top: position.y }}
        >
            <button
                className="bg-blue-500 w-20 h-14 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleClick}
            >{label}</button>
        </div>
    );
};

export default FixtureControlRGBW;
