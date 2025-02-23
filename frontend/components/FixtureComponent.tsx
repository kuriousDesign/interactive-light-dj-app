import { FixtureRGBW, FixtureCfg } from '@libs/interfaces/fixture';
import React from 'react'
interface FixtureProps {
    data: FixtureRGBW;
    cfg: FixtureCfg;
  }

const FixtureComponent = ({ data, cfg }: FixtureProps) => {
  const { r, g, b } = data;
  const { label, position } = cfg;
  const bgColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <div
      className="absolute w-20 h-20 rounded-full border-4 border-gray-800 text-center flex items-center justify-center"
      style={{ backgroundColor: bgColor, left: position.x, top: position.y }}
    >
      {label}
    </div>
  );
}


export default FixtureComponent
