import React, { useState } from 'react';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, RgbColor, hsvaToRgba } from '@uiw/color-convert';
import { useContext } from 'react';
import { SocketContext } from '@/contexts/SocketProvider';
import { FixtureCfg } from '@/types/fixture';


interface FixtureControlProps {
    id: number;
    controlType: string;
    cfg: FixtureCfg;
  }
const FixtureControlRGBW = ({ id, controlType, cfg }: FixtureControlProps) => {
  const [rgbColor, setRgbColor] = useState<RgbColor>({r:0, g:0, b:0});
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const [hsvaDisplay, setHsvaDisplay] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const { sendEvent } = useContext(SocketContext);
  const { label, position } = cfg;


  const handleChange = (color:ColorResult) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    console.log('color-a:', color.hsva.a);
    setHsva({ ...hsva, ...color.hsva });
    const modifiedHsva = { ...color.hsva, a: 1 };
    setHsvaDisplay({ ...hsvaDisplay, ...modifiedHsva });

    // socket io data out
    sendEvent('buttonPress', { controlType: controlType, id: id, color: color.rgb });

    setRgbColor({...rgbColor, ...color.rgb});
    console.log('rgbColor:', color.rgb);

  };

  const handleShadeChange = (shade:{v:number}) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    console.log('v:', shade.v);
    const new_hsv = { ...hsva, v: shade.v };
    const newRgbColor = hsvaToRgba(new_hsv);
    sendEvent('buttonPress', { controlType: 'groupSet', id: id, color: newRgbColor });
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
