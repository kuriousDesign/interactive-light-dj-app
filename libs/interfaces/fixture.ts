export interface Fixture {
    vars: FixtureRGBW;
    cfg: FixtureCfg;
  }

export interface FixtureRGBW {
    r: number;
    g: number;
    b: number;
    w: number;
    brightness: number;
}

export interface FixtureControlProps {
    className?: string; // Add this line to allow passing className
    id: number;
    controlType: string;
    cfg: FixtureCfg;
}

  
export interface FixtureCfg {
    // address: number;
    // num_channels: number;
    label: string;
    position: { x: number; y: number };
}