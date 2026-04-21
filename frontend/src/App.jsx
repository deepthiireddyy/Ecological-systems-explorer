import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import MapView from './components/map/MapView';
import useAppStore from './store/appStore';

export default function App() {
  const {
    setAOI, defaultAOI, showNotification,
    resetWorkflow, setDefaultAOI
  } = useAppStore();

  const [geeLayerUrl, setGeeLayerUrl] = useState(null);

  useEffect(() => {
    const loadDefaultAOI = async () => {
      try {
        const res = await fetch('/aoi.geojson');
        const geojson = await res.json();

        setDefaultAOI(geojson);
        setAOI(geojson);

        console.log('Default AOI loaded');
      } catch (err) {
        console.error('Failed to load default AOI:', err);
      }
    };

    loadDefaultAOI();
  }, []);

  // User finished drawing polygon/rectangle on map
  const handleAOIDrawn = (geojson) => {
    setAOI(geojson);
    resetWorkflow();
    setGeeLayerUrl(null);
    showNotification('Custom area selected successfully', 'success');
  };

  // Reset to default AOI
  const handleResetAOI = () => {
    if (!defaultAOI) {
      showNotification('No default boundary available. Draw an area first.', 'warning');
      return;
    }
    setAOI(defaultAOI);
    resetWorkflow();
    setGeeLayerUrl(null);
    showNotification('Reverted to default study area', 'success');
  };

  // Activate draw mode - hint shown, user clicks draw tool in top-right of map
  const handleDrawAOI = () => {
    showNotification('Use the draw tools in the top-right of the map to draw your area', 'info');
  };

  // After imagery loads from backend
  const handleImageryLoaded = (tileUrl) => {
    setGeeLayerUrl(tileUrl);
  };

  // After index computed
  const handleIndexLoaded = (result) => {
    setGeeLayerUrl(result.tileUrl);
  };

  // After blue-green generated
  const handleBGLoaded = (result) => {
    setGeeLayerUrl(result.tileUrl);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        onDrawAOI={handleDrawAOI}
        onResetAOI={handleResetAOI}
        onImageryLoaded={handleImageryLoaded}
        onIndexLoaded={handleIndexLoaded}
        onBGLoaded={handleBGLoaded}
      />
      <MapView
        geeLayerUrl={geeLayerUrl}
        onAOIDrawn={handleAOIDrawn}
      />
    </div>
  );
}
