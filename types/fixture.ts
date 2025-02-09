export interface Fixture {
    vars: FixtureData;
    cfg: FixtureCfg;
  }

export interface FixtureData {
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