import React, { useState } from 'react';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ColorResult, RgbColor, hsvaToRgba } from '@uiw/color-convert';
import { useContext } from 'react';
import { SocketContext } from '@/contexts/SocketProvider';

const FixtureControlRGBW = () => {
  const [rgbColor, setRgbColor] = useState<RgbColor>({r:0, g:0, b:0});
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const [hsvaDisplay, setHsvaDisplay] = useState({ h: 214, s: 43, v: 100, a: 1 });
  const { sendEvent } = useContext(SocketContext);
  const groupId = 1;

  const handleChange = (color:ColorResult) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    console.log('color-a:', color.hsva.a);
    setHsva({ ...hsva, ...color.hsva });
    const modifiedHsva = { ...color.hsva, a: 1 };
    setHsvaDisplay({ ...hsvaDisplay, ...modifiedHsva });

    // socket io data out
    sendEvent('buttonPress', { controlType: 'groupSet', id: groupId, color: color.rgb });

    setRgbColor({...rgbColor, ...color.rgb});
    console.log('rgbColor:', color.rgb);

  };

  const handleShadeChange = (shade:{v:number}) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    console.log('v:', shade.v);
    const new_hsv = { ...hsva, v: shade.v };
    const newRgbColor = hsvaToRgba(new_hsv);
    sendEvent('buttonPress', { controlType: 'groupSet', id: groupId, color: newRgbColor });
    setHsva({ ...hsva, v: shade.v });
  };
  return (
    <div className='bg-white'>
        <Wheel color={hsvaDisplay} onChange={(newColor) => handleChange(newColor)} />
        <ShadeSlider className='w-full h-10 mt-4'
            hsva={hsva}
            onChange={(newShade) => handleShadeChange(newShade)}
        />
    </div>
  )
}

export default FixtureControlRGBW
