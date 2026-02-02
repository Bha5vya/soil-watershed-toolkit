// ======================================================
// Micro Erosion Hotspot Index (MEHI)
// AOI: Mula–Mutha–Bhima Catchment (User Shapefile)
// Author: Bhavya Singh
// ======================================================

// -----------------------------
// Load AOI Shapefile
// -----------------------------
var aoi = mmb_catchment;

Map.centerObject(aoi.geometry(), 9);
Map.addLayer(aoi, {color: 'black'}, "Mula-Mutha-Bhima Catchment");

// -----------------------------
// DEM and Slope
// -----------------------------
var dem = ee.Image("USGS/SRTMGL1_003");
var slope = ee.Terrain.slope(dem);

// -----------------------------
// Sentinel-2 NDVI
// -----------------------------
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate("2026-01-01", "2026-01-29")
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
  .median();

var ndvi = s2.normalizedDifference(["B8", "B4"])
            .rename("NDVI");

// -----------------------------
// CHIRPS Rainfall
// -----------------------------
var rain = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
  .filterBounds(aoi)
  .filterDate("2024-01-01", "2024-12-31")
  .sum()
  .rename("Rainfall");

// -----------------------------
// Normalization Function
// -----------------------------
function normalize(img){
  var stats = img.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e13,
    bestEffort: true
  });
  
  var min = ee.Number(stats.values().get(0));
  var max = ee.Number(stats.values().get(1));
  
  return img.subtract(min).divide(max.subtract(min));
}

// -----------------------------
// Normalize Layers
// -----------------------------
var slope_n = normalize(slope);
var ndvi_n  = normalize(ndvi);
var rain_n  = normalize(rain);

// Invert NDVI
var ndvi_inv = ee.Image(1).subtract(ndvi_n);

// -----------------------------
// MEHI Calculation
// -----------------------------
var mehi = slope_n
  .add(ndvi_inv)
  .add(rain_n)
  .divide(3)
  .rename("MEHI")
  .clip(aoi);

// -----------------------------
// Visualization
// -----------------------------
Map.addLayer(mehi, {
  min: 0,
  max: 1,
  palette: ["006400","FFFF00","FFA500","FF0000"]
}, "MEHI");

// -----------------------------
// Legend (MEHI Classes)
// -----------------------------
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'MEHI Classes',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0'
  }
});

legend.add(legendTitle);

// Class colors
var palette = ['006400','FFFF00','FFA500','FF0000'];

// Class labels
var labels = [
  'Low (0.00 – 0.25)',
  'Moderate (0.25 – 0.50)',
  'High (0.50 – 0.75)',
  'Very High (0.75 – 1.00)'
];

// Build legend
for (var i = 0; i < palette.length; i++) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + palette[i],
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({
    value: labels[i],
    style: { margin: '0 0 4px 6px' }
  });

  var row = ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });

  legend.add(row);
}

Map.add(legend);

// -----------------------------
// Export (Optional)
// -----------------------------
Export.image.toDrive({
  image: mehi,
  description: "MEHI_MulaMuthaBhima",
  scale: 30,
  region: aoi,
  maxPixels: 1e13
});
