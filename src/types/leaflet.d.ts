// leaflet-fullscreen.d.ts or leaflet.d.ts
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class Fullscreen extends Control {
      constructor(options?: any);
    }
  }

  function fullscreen(options?: any): Control.Fullscreen;
}
