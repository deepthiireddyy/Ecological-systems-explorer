import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  FeatureGroup,
  GeoJSON,
  useMap,
  LayersControl,
  TileLayer
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import useAppStore from '../../store/appStore';
import Notification from '../ui/Notification';
import { GradientLegend, BlueGreenLegend } from './Legend';
// import BasemapToggle from './BasemapToggle';
import MapTitle from './MapTitle';
import MapLoadingOverlay from './MapLoadingOverlay';

function FitBoundsController({ geojson }) {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    try {
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } catch (_) {}
  }, [geojson, map]);

  return null;
}

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

function ConditionalMapTitle() {
  const { activeLayer, bgType } = useAppStore();

  if (activeLayer === 'bg' && bgType === 'bluegreen') {
    return <MapTitle text="Spatial Distribution of Ecological System" />;
  }

  return null;
}

function ClickInfoHandler({ onClick }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      onClick({ lat, lng });
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);

  return null;
}

export default function MapView({ geeLayerUrl, onAOIDrawn }) {
  const {
    aoi,
    loadingImagery,
    loadingIndex,
    loadingBG,
    setAOI,
    imageryTileUrl,
    indexTileUrl,
    bgTileUrl
  } = useAppStore();

  const featureGroupRef = useRef(null);

  const [defaultAOI, setDefaultAOI] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);

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

  const handleMapClick = ({ lat, lng }) => {
    setClickInfo({
      lat: lat.toFixed(5),
      lng: lng.toFixed(5)
    });
  };

  const handleCreated = (e) => {
    const layer = e.layer;

    featureGroupRef.current.clearLayers();
    featureGroupRef.current.addLayer(layer);

    const geojson = layer.toGeoJSON();
    setAOI(geojson);
    onAOIDrawn(geojson);
  };

  const handleDeleted = () => {
    if (defaultAOI) {
      setAOI(defaultAOI);
    } else {
      setAOI(null);
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <BasemapToggle /> */}

        {/* CLICK HANDLER */}
        <ClickInfoHandler onClick={handleMapClick} />

        {/* LAYERS CONTROL */}
        <LayersControl position="topright">

          {/* BASEMAPS */}
          <LayersControl.BaseLayer checked name="Streets">
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution="&copy; OpenStreetMap"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              attribution='Esri World Imagery'
            />
          </LayersControl.BaseLayer>

          {/* AOI */}
          {aoi && (
            <LayersControl.Overlay checked name="AOI Boundary">
              <GeoJSON
                data={aoi}
                style={{
                  color: '#e53935',
                  weight: 2.5,
                  opacity: 1,
                  fillColor: '#000',
                  fillOpacity: 0.04
                }}
              />
            </LayersControl.Overlay>
          )}

          {/* Imagery */}
          {(geeLayerUrl || imageryTileUrl) && (
            <LayersControl.Overlay checked name="Imagery">
              <TileLayer url={geeLayerUrl || imageryTileUrl} />
            </LayersControl.Overlay>
          )}

          {/* NDVI */}
          {indexTileUrl && (
            <LayersControl.Overlay name="Index (NDVI)">
              <TileLayer url={indexTileUrl} />
            </LayersControl.Overlay>
          )}

          {/* Blue-Green */}
          {bgTileUrl && (
            <LayersControl.Overlay name="Blue-Green">
              <TileLayer url={bgTileUrl} />
            </LayersControl.Overlay>
          )}

        </LayersControl>

        <FitBoundsController geojson={aoi} />

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
      </MapContainer>

      {/* CLICK INFO BOX */}
      {clickInfo && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '12px'
        }}>
          <div><b>Lat:</b> {clickInfo.lat}</div>
          <div><b>Lon:</b> {clickInfo.lng}</div>
        </div>
      )}

      <MapLoadingOverlay loading={isLoading} message={loadingMessage} />
      <Notification />
    </div>
  );
}