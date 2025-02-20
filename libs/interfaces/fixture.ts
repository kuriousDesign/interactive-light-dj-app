export interface Fixture {
    vars: FixtureRGBW;
    cfg: FixtureCfg;
  }

export interface FixtureRGBW {
    r: number;
    g: number;
    b: number;
    w: number;
}
  
export interface FixtureCfg {
    // address: number;
    // num_channels: number;
    label: string;
    position: { x: number; y: number };
}