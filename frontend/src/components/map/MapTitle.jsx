import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapTitle({ text }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map || !text) return;

    const control = L.control({ position: 'topright' });

    // Leaflet doesn't have 'topcenter' built-in, so we override
    control.onAdd = () => {
      const div = L.DomUtil.create('div');
      div.style.position = 'absolute';
      div.style.top = '10px';
      div.style.left = '50%';
      div.style.transform = 'translateX(-50%)';
      div.style.cssText = `
        background: rgba(255,255,255,0.95);
        border: 1px solid #dadce0;
        border-radius: 6px;
        padding: 6px 16px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: #202124;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        pointer-events: none;
      `;
      div.textContent = text;
      return div;
    };

    control.addTo(map);
    controlRef.current = control;

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, text]);

  return null;
}
