import React, { useState } from 'react';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, RgbColor, hsvaToRgba, rgbaToRgb } from '@uiw/color-convert';
import { useContext } from 'react';
import { SocketContext } from '@/contexts/SocketProvider';
import { FixtureCfg } from '@/types/fixture';


interface FixtureControlProps {
    id: number;
    controlType: string;
    cfg: FixtureCfg;
  }

  let vv = 100;
const FixtureControlRGBW = ({ id, controlType, cfg }: FixtureControlProps) => {
  // const [rgbColor, setRgbColor] = useState<RgbColor>({r:0, g:0, b:0});
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const [hsvaDisplay, setHsvaDisplay] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const { sendEvent } = useContext(SocketContext);
  const { label, position } = cfg;


  const handleChange = (color:ColorResult) => {

    console.log('v:', vv);
    color.hsva.v = vv;

    setHsva({ ...hsva, ...color.hsva });
    const modifiedHsva = { ...color.hsva, v: 100 };
    setHsvaDisplay({ ...hsvaDisplay, ...modifiedHsva });
    
    const new_hsv = { ...hsva, v: vv };
    const newRgbColor = hsvaToRgba(new_hsv);
    console.log('newRgbColor:', newRgbColor);
    sendEvent('buttonPress', { controlType: controlType, id: id, color: newRgbColor });

  };

  const handleShadeChange = (shade:{v:number}) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    console.log('v:', shade.v);
    vv=shade.v;
    const new_hsv = { ...hsva, v: shade.v };
    const newRgbColor = hsvaToRgba(new_hsv);
    //console.log('newRgbColor:', newRgbColor);
    sendEvent('buttonPress', { controlType: controlType, id: id, color: newRgbColor });
    setHsva({ ...hsva, v: shade.v });
  };
  return (
    <div 
      className='absolute w-max'
      style={{ left: position.x, top: position.y }}
    >
        <Wheel 
          width={125} 
          height={125}
          color={hsvaDisplay} 
          onChange={(newColor) => handleChange(newColor)}
        />
        <ShadeSlider className='mt-4'
            hsva={hsva}
            onChange={(newShade) => handleShadeChange(newShade)}
        />
        {label}
    </div>
  )
}

export default FixtureControlRGBW
