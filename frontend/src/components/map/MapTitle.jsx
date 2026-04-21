import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapTitle({ text }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}
    >
      {text}
    </div>
  );
}