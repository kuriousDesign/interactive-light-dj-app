import React, { useState, useEffect, useContext } from 'react';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, hsvaToRgba } from '@uiw/color-convert';
import { SocketContext } from '@/contexts/SocketProvider';
import { FixtureControlProps } from '@libs/interfaces/fixture';


const FixtureControlRGBW = ({ id, controlType, cfg }: FixtureControlProps) => {
    const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
    const [hsvaDisplay, setHsvaDisplay] = useState({ h: 214, s: 43, v: 100, a: 1 });
    const [brightness, setBrightness] = useState(100); // useState instead of a let variable
    const { sendEvent } = useContext(SocketContext);
    const { label, position } = cfg;

    const handleChange = (color: ColorResult) => {
        setHsva({ ...hsva, ...color.hsva, v: brightness }); // Ensure v is always synced
        setHsvaDisplay({ ...hsvaDisplay, ...color.hsva, v: 100 });
    };

    const handleShadeChange = (shade: { v: number }) => {
        setBrightness(shade.v); // Update brightness
        setHsva((prevHsva) => ({ ...prevHsva, v: shade.v })); // Ensure state updates
    };

    // useEffect to trigger sendEvent when `hsva` or `brightness` changes
    useEffect(() => {
        const newRgbColor = hsvaToRgba(hsva);
        sendEvent('buttonPress', { controlType, id, color: newRgbColor });
    }, [hsva]); // Dependency array ensures it updates when hsva changes

    return (
        <div 
            className='absolute w-max'
            style={{ left: position.x, top: position.y }}
        >
            <Wheel 
                width={125} 
                height={125}
                color={hsvaDisplay} 
                onChange={handleChange}
            />
            <ShadeSlider 
                className='mt-4'
                hsva={hsva}
                onChange={handleShadeChange}
            />
            {label}
        </div>
    );
};

export default FixtureControlRGBW;
