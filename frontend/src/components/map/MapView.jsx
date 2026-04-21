import { useEffect, useRef, useState } from 'react';
import {
  MapContainer as LeafletMap,
  FeatureGroup,
  GeoJSON,
  useMap
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import useAppStore from '../../store/appStore';
import Notification from '../ui/Notification';
import { GradientLegend, BlueGreenLegend } from './Legend';
import BasemapToggle from './BasemapToggle';
import MapTitle from './MapTitle';
import MapLoadingOverlay from './MapLoadingOverlay';

// ── GEE tile layer ─────────────────────────────────────────────
function GEETileLayer({ url }) {
  const map = useMap();
  const tileRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    if (tileRef.current) {
      map.removeLayer(tileRef.current);
      tileRef.current = null;
    }

    const layer = L.tileLayer(url, {
      opacity: 1,
      maxZoom: 22,
      tileSize: 256,
      attribution: 'Google Earth Engine'
    });

    layer.addTo(map);

    // 🔥 important fixes
    layer.bringToFront();
    map.invalidateSize();

    tileRef.current = layer;

    return () => {
      if (tileRef.current) {
        map.removeLayer(tileRef.current);
        tileRef.current = null;
      }
    };
  }, [url, map]);

  return null;
}

// ── Fit bounds ─────────────────────────────────────────────
function FitBoundsController({ geojson }) {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    try {
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    } catch (_) {}
  }, [geojson, map]);

  return null;
}

// ── AOI Layer ─────────────────────────────────────────────
function AOILayer({ aoi }) {
  if (!aoi) return null;

  return (
    <GeoJSON
      key={JSON.stringify(aoi)}
      data={aoi}
      style={{
        color: '#e53935',
        weight: 2.5,
        opacity: 1,
        fillColor: '#000',
        fillOpacity: 0.04
      }}
    />
  );
}

// ── Legend ─────────────────────────────────────────────
function ActiveLegend() {
  const {
    activeLayer,
    selectedIndex,
    renderType,
    palette,
    indexMin,
    indexMax,
    bgType,
    bgAreas,
    bgVegAreas,
    bgWaterAreas
  } = useAppStore();

  if (activeLayer === 'index' && selectedIndex && indexMin !== null && indexMax !== null) {
    return (
      <GradientLegend
        title={selectedIndex}
        min={indexMin}
        max={indexMax}
        palette={renderType === 'Grayscale' ? 'Grayscale' : palette}
      />
    );
  }

  if (activeLayer === 'bg' && bgType) {
    return (
      <BlueGreenLegend
        type={bgType}
        areas={bgAreas}
        vegAreas={bgVegAreas}
        waterAreas={bgWaterAreas}
      />
    );
  }

  return null;
}

// ── Title ─────────────────────────────────────────────
function ConditionalMapTitle() {
  const { activeLayer, bgType } = useAppStore();

  if (activeLayer === 'bg' && bgType === 'bluegreen') {
    return <MapTitle text="Spatial Distribution of Ecological System" />;
  }

  return null;
}

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function MapView({ geeLayerUrl, onAOIDrawn }) {
  const {
    aoi,
    loadingImagery,
    loadingIndex,
    loadingBG,
    setAOI,
    imageryTileUrl,
    indexTileUrl,
    bgTileUrl,
    activeLayer
  } = useAppStore();

  const featureGroupRef = useRef(null);
  const [defaultAOI, setDefaultAOI] = useState(null);

  // ✅ Load default AOI
  useEffect(() => {
    fetch('/aoi.geojson')
      .then(res => res.json())
      .then(data => {
        setDefaultAOI(data);
        setAOI(data);
      })
      .catch(err => console.error('Failed to load AOI:', err));
  }, []);

  const isLoading = loadingImagery || loadingIndex || loadingBG;

  const loadingMessage =
    loadingImagery
      ? 'Generating image composite…'
      : loadingIndex
      ? 'Computing spectral index…'
      : 'Generating Blue–Green system…';

  // ✅ Decide which layer to show
  let activeTileUrl = null;

  if (activeLayer === 'imagery') {
    activeTileUrl = geeLayerUrl || imageryTileUrl;
  } else if (activeLayer === 'index') {
    activeTileUrl = indexTileUrl;
  } else if (activeLayer === 'bg') {
    activeTileUrl = bgTileUrl;
  }

  // ✅ Handle drawing
  const handleCreated = (e) => {
    const layer = e.layer;

    featureGroupRef.current.clearLayers();
    featureGroupRef.current.addLayer(layer);

    const geojson = layer.toGeoJSON();
    setAOI(geojson);
    onAOIDrawn(geojson);
  };

  // ✅ Handle delete
  const handleDeleted = () => {
    if (defaultAOI) {
      setAOI(defaultAOI);
    } else {
      setAOI(null);
    }
  };

  return (
    <div className="map-container">
      <LeafletMap
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <BasemapToggle />

        <AOILayer aoi={aoi} />
        <FitBoundsController geojson={aoi} />

        {/* 🔥 FIXED: dynamic layer rendering */}
        {activeTileUrl && <GEETileLayer url={activeTileUrl} />}

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onDeleted={handleDeleted}
            draw={{
              polygon: { shapeOptions: { color: '#e53935', weight: 2 } },
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false
            }}
            edit={{ edit: false, remove: true }}
          />
        </FeatureGroup>

        <ActiveLegend />
        <ConditionalMapTitle />
      </LeafletMap>

      <MapLoadingOverlay loading={isLoading} message={loadingMessage} />
      <Notification />
    </div>
  );
}