import { MapView } from '@deck.gl/core'
import * as Pbf from 'pbf'
import * as Schemas from "../../schemas";

// mapview
export const view = new MapView({ repeat: true })
export const getScatterColor = (geoid, currentMapData) =>
  currentMapData[geoid]?.color

// icon mappings
export const ICON_MAPPING = {
  hospital: { x: 0, y: 0, width: 128, height: 128 },
  clinic: { x: 128, y: 0, width: 128, height: 128 },
  invitedVaccineSite: { x: 0, y: 128, width: 128, height: 128 },
  participatingVaccineSite: { x: 128, y: 128, width: 128, height: 128 },
  megaSite: { x: 256, y: 128, width: 128, height: 128 },
}

export const STORY_ICON_MAPPING = {
  'marker-1': {
    x: 0,
    y: 0,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-2': {
    x: 128,
    y: 0,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-3': {
    x: 256,
    y: 0,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-4': {
    x: 384,
    y: 0,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-5': {
    x: 0,
    y: 128,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-6': {
    x: 128,
    y: 128,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-7': {
    x: 256,
    y: 128,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-8': {
    x: 384,
    y: 128,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-9': {
    x: 0,
    y: 256,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-10': {
    x: 128,
    y: 256,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-20': {
    x: 256,
    y: 256,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-30': {
    x: 384,
    y: 256,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-40': {
    x: 0,
    y: 384,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-50': {
    x: 128,
    y: 384,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-60': {
    x: 256,
    y: 384,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-70': {
    x: 384,
    y: 384,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-80': {
    x: 0,
    y: 512,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-90': {
    x: 128,
    y: 512,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  'marker-100': {
    x: 256,
    y: 512,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  marker: {
    x: 384,
    y: 512,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  written: {
    x: 128,
    y: 640,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  photo: {
    x: 384,
    y: 640,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  video: {
    x: 0,
    y: 768,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  audio: {
    x: 256,
    y: 640,
    width: 128,
    height: 128,
    anchorY: 128,
  },
  phone: {
    x: 0,
    y: 640,
    width: 128,
    height: 128,
    anchorY: 128,
  },
}

// parse dot density 1D PBF into 2D
const chunkArray = (data, chunk) => {
  let tempArray = new Array(data.length / chunk).fill([])
  for (let i = 0; i < data.length; i += chunk) {
    tempArray[i / chunk] = data.slice(i, i + chunk)
  }
  return tempArray
}

export const getDotDensityData = async () =>
  fetch(`${process.env.PUBLIC_URL}/pbf/dotDensityFlatGeoid.pbf`)
    .then((r) => r.arrayBuffer())
    .then((ab) => new Pbf(ab))
    .then((pbf) => Schemas.Dot.read(pbf).val)
    .then((data) => chunkArray(data, 4))

export const LayersByVizType = {
  cartogram: ['cartogram'],
  '2D': ['choropleth', 'choroplethHighlight', 'choroplethHover'],
  '3D': ['choropleth', 'choroplethHover'],
  dotDensity: [
    'choropleth',
    'dotDensity',
    'dotDensityWhite',
    'choroplethHighlight',
    'choroplethHover',
  ],
}

export const ResourceLayerMappings = {
    "hospital": "hospital",
    "clinic": "clinic",
    "vaccinationSites": "vaccinationSites",
} 

export const OverLayLayerMappings = {
    "stories": "stories"
}

export const getLayers = (layers, vizType, overlays, resources, currData) => {
    let LayerArray = LayersByVizType[vizType].map(layerKey => layers[layerKey]);
    // special rules
    if (vizType === "cartogram" && currData.includes("state")){
      LayerArray.push(layers["cartogramText"]);
      return LayerArray;
    }

    Object.entries(ResourceLayerMappings).forEach(([key, value]) => 
      resources?.includes(key) && LayerArray.push(layers[value])
    )
    Object.entries(OverLayLayerMappings).forEach(([key, value]) => 
      overlays?.includes(key) && LayerArray.push(layers[value])
    )
    return LayerArray;
}