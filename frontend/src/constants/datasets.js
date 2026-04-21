export const SENSOR_GROUPS = ['Radar', 'Optical'];

export const DATASET_OPTIONS = {
  Radar: ['Sentinel-1 (SAR)'],
  Optical: ['Sentinel-2']
};

export const DATASET_INFO = {
  'Sentinel-1 (SAR)': {
    icon: '🛰',
    lines: [
      'Sentinel-1 (C-band SAR)',
      'First Data: Apr 2014 (S1A), Apr 2016 (S1B)',
      'Revisit: ~6–12 days',
      'Resolution: IW mode ≈5×20 m',
      'Products: VV/VH polarizations'
    ]
  },
  'Sentinel-2': {
    icon: '🛰',
    lines: [
      'Sentinel-2 (MSI)',
      'First Data: Jun 2015 (S2A), Mar 2017 (S2B)',
      'Revisit: ~5 days',
      'Resolution: 10–60 m (13 bands)',
      'Bands: RGB + NIR + SWIR'
    ]
  }
};

export const INDEX_OPTIONS = {
  'Sentinel-1 (SAR)': ['RVI', 'VV/VH'],
  'Sentinel-2': ['NDVI', 'NDWI', 'RESI']
};

export const INDEX_DESCRIPTIONS = {
  NDVI: 'Normalized Difference Vegetation Index – measures vegetation density',
  NDWI: 'Normalized Difference Water Index – detects water bodies',
  RESI: 'Red-Edge Spectral Index – sensitive to chlorophyll content',
  RVI: 'Radar Vegetation Index – vegetation from SAR backscatter',
  'VV/VH': 'Ratio of VV to VH polarizations'
};

export const RENDER_TYPES = ['Grayscale', 'Color Gradient'];

export const PALETTE_OPTIONS = ['Viridis', 'Spectral', 'Plasma', 'RdYlGn'];

export const PALETTE_COLORS = {
  Viridis: ['#440154', '#3b528b', '#21908d', '#5dc863', '#fde725'],
  Spectral: ['#9e0142', '#f46d43', '#ffffbf', '#74add1', '#5e4fa2'],
  Plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89441', '#f0f921'],
  RdYlGn: ['#a50026', '#f46d43', '#ffffbf', '#66bd63', '#006837'],
  Grayscale: ['#000000', '#ffffff']
};

export const isOptical = (dataset) => dataset === 'Sentinel-2';
