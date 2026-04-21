import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PALETTE_COLORS } from '../../constants/datasets';

// Gradient legend (for index layers)
export function GradientLegend({ title, min, max, palette }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = L.control({ position: 'bottomleft' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend-panel');
      div.style.minWidth = '260px';

      const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.Grayscale;
      const gradient = `linear-gradient(to right, ${colors.join(', ')})`;

      div.innerHTML = `
        <div style="font-weight:600;font-size:14px;margin-bottom:8px;color:#202124">
          ${title}
        </div>
        <div style="height:16px;border-radius:6px;background:${gradient};margin-bottom:6px"></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#555;font-family:'IBM Plex Mono',monospace">
          <span>${min.toFixed(3)}</span>
          <span>${((min + max) / 2).toFixed(3)}</span>
          <span>${max.toFixed(3)}</span>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);
      return div;
    };

    control.addTo(map);
    controlRef.current = control;

    return () => {
      if (controlRef.current) map.removeControl(controlRef.current);
    };
  }, [map, title, min, max, palette]);

  return null;
}

// Categorical legend
export function CategoricalLegend({ title, labels, colors }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = L.control({ position: 'bottomleft' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend-panel');
      div.style.minWidth = '260px';

      const rows = labels.map((label, i) => `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <div style="width:18px;height:18px;background:${colors[i]};border-radius:4px;flex-shrink:0"></div>
          <span style="font-size:12px;color:#333">${label}</span>
        </div>
      `).join('');

      div.innerHTML = `
        <div style="font-weight:600;font-size:14px;margin-bottom:8px;color:#202124">
          ${title}
        </div>
        ${rows}
      `;

      L.DomEvent.disableClickPropagation(div);
      return div;
    };

    control.addTo(map);
    controlRef.current = control;

    return () => {
      if (controlRef.current) map.removeControl(controlRef.current);
    };
  }, [map, title, labels, colors]);

  return null;
}

// Blue-Green legend
export function BlueGreenLegend({ type, areas, vegAreas, waterAreas }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = L.control({ position: 'bottomleft' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend-panel');
      div.style.minWidth = '300px';

      if (type === 'green' && areas) {
        div.innerHTML = `
          <div style="font-weight:600;font-size:14px;margin-bottom:8px">
            🌿 Green Cover (NDVI)
          </div>
          ${buildRows([
            { label: 'Low (0.2–0.4)', color: '#c7e9c0', area: areas['Low (0.2–0.4)'] },
            { label: 'Moderate (0.4–0.6)', color: '#41ab5d', area: areas['Moderate (0.4–0.6)'] },
            { label: 'High (0.6–1.0)', color: '#00441b', area: areas['High (0.6–1.0)'] }
          ])}
        `;
      } else if (type === 'blue' && areas) {
        div.innerHTML = `
          <div style="font-weight:600;font-size:14px;margin-bottom:8px">
            💧 Blue Cover (NDWI)
          </div>
          ${buildRows([
            { label: 'Low (0.2–0.4)', color: '#c6dbef', area: areas['Low (0.2–0.4)'] },
            { label: 'Moderate (0.4–0.6)', color: '#6baed6', area: areas['Moderate (0.4–0.6)'] },
            { label: 'High (0.6–1.0)', color: '#08306b', area: areas['High (0.6–1.0)'] }
          ])}
        `;
      } else if (type === 'bluegreen' && vegAreas && waterAreas) {
        const classes = ['Low (0.2–0.4)', 'Moderate (0.4–0.6)', 'High (0.6–1.0)'];
        const greenColors = ['#c7e9c0', '#41ab5d', '#00441b'];
        const blueColors = ['#c6dbef', '#6baed6', '#08306b'];

        const header = `
          <div style="font-weight:600;font-size:14px;margin-bottom:8px">
            🌿💧 Blue–Green System
          </div>
          <div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:6px;margin-bottom:8px;font-size:11px;font-weight:600;color:#555">
            <span>Class</span>
            <span>Blue Cover</span>
            <span>Green Cover</span>
          </div>
        `;

        const rows = classes.map((cls, i) => `
          <div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:6px;align-items:center;margin-bottom:6px">
            <span style="font-size:12px;font-weight:500">${cls.split(' ')[0]}</span>

            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:16px;height:16px;background:${blueColors[i]};border-radius:3px"></div>
              <span style="font-size:11px;font-family:monospace">
                ${waterAreas[cls]?.toFixed(2)} km²
              </span>
            </div>

            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:16px;height:16px;background:${greenColors[i]};border-radius:3px"></div>
              <span style="font-size:11px;font-family:monospace">
                ${vegAreas[cls]?.toFixed(2)} km²
              </span>
            </div>
          </div>
        `).join('');

        div.innerHTML = header + rows;
      }

      L.DomEvent.disableClickPropagation(div);
      return div;
    };

    control.addTo(map);
    controlRef.current = control;

    return () => {
      if (controlRef.current) map.removeControl(controlRef.current);
    };
  }, [map, type, areas, vegAreas, waterAreas]);

  return null;
}

// helper
function buildRows(items) {
  return items.map(({ label, color, area }) => `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:18px;height:18px;background:${color};border-radius:4px;flex-shrink:0"></div>
        <span style="font-size:12px;color:#333">${label}</span>
      </div>
      <span style="font-size:12px;font-family:monospace;color:#555;font-weight:500">
        ${area != null ? area.toFixed(2) + ' km²' : '—'}
      </span>
    </div>
  `).join('');
}