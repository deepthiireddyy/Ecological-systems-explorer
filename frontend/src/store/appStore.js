import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ── AOI ──────────────────────────────────────────────────────────────────
  aoi: null,
  defaultAOI: null,
  setAOI: (aoi) => {
    // First time an AOI is set, also save it as default
    const state = get();
    set({ aoi, defaultAOI: state.defaultAOI || aoi });
  },
  setDefaultAOI: (aoi) => set({ defaultAOI: aoi, aoi }),

  // ── Sensor / Dataset ─────────────────────────────────────────────────────
  selectedGroup: null,
  selectedDataset: null,
  setSelectedGroup: (g) => set({ selectedGroup: g, selectedDataset: null }),
  setSelectedDataset: (d) => set({ selectedDataset: d }),

  // ── Dates ────────────────────────────────────────────────────────────────
  startDate: '',
  endDate: '',
  setStartDate: (v) => set({ startDate: v }),
  setEndDate: (v) => set({ endDate: v }),

  // ── Cloud cover ───────────────────────────────────────────────────────────
  cloudCover: 8,
  setCloudCover: (v) => set({ cloudCover: v }),

  // ── Viz type (true/false color) ───────────────────────────────────────────
  vizType: 'true',
  setVizType: (v) => set({ vizType: v }),

  // ── Imagery ──────────────────────────────────────────────────────────────
  imageryLoaded: false,
  imageryTileUrl: null,
  imageCount: 0,
  setImageryLoaded: (v) => set({ imageryLoaded: v }),
  setImageryTileUrl: (url) => set({ imageryTileUrl: url }),
  setImageCount: (n) => set({ imageCount: n }),

  // ── Index ─────────────────────────────────────────────────────────────────
  selectedIndex: null,
  renderType: 'Color Gradient',
  palette: 'Viridis',
  indexTileUrl: null,
  indexMin: null,
  indexMax: null,
  setSelectedIndex: (v) => set({ selectedIndex: v }),
  setRenderType: (v) => set({ renderType: v }),
  setPalette: (v) => set({ palette: v }),
  setIndexTileUrl: (url) => set({ indexTileUrl: url }),
  setIndexMinMax: (min, max) => set({ indexMin: min, indexMax: max }),

  // ── Blue-Green ────────────────────────────────────────────────────────────
  bgTileUrl: null,
  bgType: null,
  bgAreas: null,
  bgVegAreas: null,
  bgWaterAreas: null,
  setBGResult: (result) => set({
    bgTileUrl: result.tileUrl,
    bgType: result.type,
    bgAreas: result.areas || null,
    bgVegAreas: result.vegAreas || null,
    bgWaterAreas: result.waterAreas || null
  }),

  // ── Download ──────────────────────────────────────────────────────────────
  selectedDownloadIndices: [],
  toggleDownloadIndex: (idx) => {
    const cur = get().selectedDownloadIndices;
    set({
      selectedDownloadIndices: cur.includes(idx)
        ? cur.filter((i) => i !== idx)
        : [...cur, idx]
    });
  },
  clearDownloadIndices: () => set({ selectedDownloadIndices: [] }),

  // ── Loading states ────────────────────────────────────────────────────────
  loadingImagery: false,
  loadingIndex: false,
  loadingBG: false,
  loadingDownload: false,
  setLoading: (key, val) => set({ [key]: val }),

  // ── Notifications ─────────────────────────────────────────────────────────
  notification: null,
  showNotification: (message, type = 'info') =>
    set({ notification: { message, type, id: Date.now() } }),
  clearNotification: () => set({ notification: null }),

  // ── Active map layer ──────────────────────────────────────────────────────
  activeLayer: 'imagery',
  setActiveLayer: (l) => set({ activeLayer: l }),

  // ── Reset workflow (keep AOI + dataset + dates) ───────────────────────────
  resetWorkflow: () => set({
    imageryLoaded: false,
    imageryTileUrl: null,
    imageCount: 0,
    selectedIndex: null,
    renderType: 'Color Gradient',
    palette: 'Viridis',
    indexTileUrl: null,
    indexMin: null,
    indexMax: null,
    bgTileUrl: null,
    bgType: null,
    bgAreas: null,
    bgVegAreas: null,
    bgWaterAreas: null,
    selectedDownloadIndices: [],
    activeLayer: 'imagery',
    loadingImagery: false,
    loadingIndex: false,
    loadingBG: false,
    loadingDownload: false
  })
}));

export default useAppStore;
