import React, { useState, useEffect, useContext } from 'react';
import Wheel from "@uiw/react-color-wheel";
//import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, hsvaToRgba } from '@uiw/color-convert';
import { SocketContext } from '@/contexts/SocketProvider';
import { FixtureControlProps } from '@libs/interfaces/fixture';
import {Slider} from "@heroui/slider";


const FixtureControlRGBW = ({ className, id, controlType, cfg }: FixtureControlProps) => {
    const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
    const [hsvaDisplay, setHsvaDisplay] = useState({ h: 214, s: 43, v: 100, a: 1 });
    const [brightness, setBrightness] = useState(100); // useState instead of a let variable
    const { sendEvent } = useContext(SocketContext);
    const { label } = cfg;

    const handleChange = (color: ColorResult) => {
        color.hsva.s = 100;
        setHsva({ ...hsva, ...color.hsva, v: brightness }); // Ensure v is always synced
        setHsvaDisplay({ ...hsvaDisplay, ...color.hsva, v: 100 });
    };


    const handleSliderChange = (value) => {
        //console.log("Slider value changed:", value);
        setBrightness(value); // Update brightness
        setHsva((prevHsva) => ({ ...prevHsva, v: value})); // Ensure state updates
    };

    // useEffect to trigger sendEvent when `hsva` or `brightness` changes
    useEffect(() => {
        const newRgbColor = hsvaToRgba(hsva);
        sendEvent('buttonPress', { controlType, id, color: newRgbColor });
    }, [hsva]); // Dependency array ensures it updates when hsva changes

    return (
        <div className={`${className} ...otherClasses`}>
            <div className="flex flex-row gap-4 items-center h-auto w-72 ml-8">
                <div className='w-8'>{""}</div>
                <Wheel
                    width={125} 
                    height={125}
                    color={hsvaDisplay} 
                    onChange={handleChange}
                />
                <Slider
                    className="h-40"
                    aria-label="Brightness"
                    defaultValue={123}
                    maxValue={255}
                    minValue={0}
                    orientation="vertical"
                    size="lg"
                    step={0.01}
                    onChange={handleSliderChange}
                />
                {label}
            </div>
        </div>
    );
};

export default FixtureControlRGBW;
