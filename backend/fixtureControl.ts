type ControlData = {
    r: number; // 0–255
    g: number;
    b: number;
    w: number;
    a: number;
  };

type RGBW = {
    r: number; // 0–255
    g: number;
    b: number;
    w: number;
};
  
class FixtureControl {
    protected _r: number = 0;
    protected _g: number = 0;
    protected _b: number = 0;
    protected _w: number = 0;
    protected _a: number = 255;
    control_is_active: boolean = false;
  
    constructor(protected name: string) {}
  
    get rgbwa(): ControlData {
      return { r: this._r, g: this._g, b: this._b, w: this._w, a: this._a };
    }

    // converts rgbwa to rgbw
    get rgbw(): RGBW {
        const scale = this._a / 255;
        return {
            r: Math.round(this._r * scale),
            g: Math.round(this._g * scale),
            b: Math.round(this._b * scale),
            w: Math.round(this._w * scale),
        };
    }
  
  
    setColorRGBW(rgbw: RGBW) {
        // get max of r,g,b,w
        //const max = Math.max(rgbw.r, rgbw.g, rgbw.b, rgbw.w);
        this._a = Math.round((rgbw.r + rgbw.g + rgbw.b)/4.0);
        if (this._a  > 0) {
            const scale = this._a / 255.0;
            const max = Math.max(rgbw.r, rgbw.g, rgbw.b, rgbw.w);
            this._r = Math.round(rgbw.r * 255.0 / max);
            this._g = Math.round(rgbw.g * 255.0 / max);
            this._b = Math.round(rgbw.b * 255.0 / max);
            this._w = Math.round(rgbw.w * 255.0 / max);
            return {
                r: this._r*255.0 / this._a,
                g: this._g*255.0 / this._a,
                b: this._b*255.0 / this._a,
                w: this._w*255.0 / this._a,
            }
        } else {
            this._r = 0;
            this._g = 0;
            this._b = 0;
            this._w = 0;
            return {
                r: 0,
                g: 0,
                b: 0,
                w: 0,
            }
        }
    }


    setColorRGBWA(controlData: ControlData) {
      this._r = controlData.r;
      this._g = controlData.g;
      this._b = controlData.b;
      this._w = controlData.w;
      this._a = controlData.a;
    }
  
    setBrightness(a: number) {
      this._a = a;
    }
  
    activate() {
        this.control_is_active = true;
    }
    
    deactivate() {
        this.control_is_active = false;
    }
  }
  