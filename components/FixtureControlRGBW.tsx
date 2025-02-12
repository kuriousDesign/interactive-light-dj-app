import React, { useState } from 'react';
import Wheel from "@uiw/react-color-wheel";
import { ColorResult, RgbColor, HsvaColor } from '@uiw/color-convert';

const FixtureControlRGBW = () => {
  const [rgbColor, setRgbColor] = useState<RgbColor>({r:0, g:0, b:0});
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });

  const handleChange = (color:ColorResult) => {
    //rgb.r
    // const rgb = `rgb(${hsv.r}, ${hsv.g}, ${hsv.b})`;
    // console.log('color:', color);
    setHsva({ ...hsva, ...color.hsva });
    setRgbColor({...rgbColor, ...color.rgb});
    console.log('rgbColor:', rgbColor);

  };
  return (
    <div className='bg-white'>
        <Wheel color={hsva} onChange={(color) => handleChange(color)} />
    </div>
  )
}

export default FixtureControlRGBW
