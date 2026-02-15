// ======================================================
// Runoff Accumulation Zones (RAZ)
// AOI: Mula–Mutha–Bhima Catchment
// Author: Bhavya Singh
// ======================================================

// -----------------------------
// Load AOI
// -----------------------------
var aoi = mmb_catchment;

Map.centerObject(aoi, 9);
Map.addLayer(aoi, {color: 'black'}, "Catchment Boundary");

// -----------------------------
// Load DEM
// -----------------------------
var dem = ee.Image("USGS/SRTMGL1_003").clip(aoi);

// -----------------------------
// Flow Accumulation (MERIT Hydro)
// -----------------------------
var flowAcc = ee.Image("MERIT/Hydro/v1_0_1")
  .select("upa")   // upstream area = flow accumulation
  .clip(aoi)
  .rename("FlowAcc");


// -----------------------------
// Normalization Function
// -----------------------------
function normalize(img){
  var band = img.bandNames().get(0);

  var stats = img.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: aoi,
    scale: 90,
    bestEffort: true,
    maxPixels: 1e13
  });

  var min = ee.Number(stats.get(ee.String(band).cat("_min")));
  var max = ee.Number(stats.get(ee.String(band).cat("_max")));

  return img.subtract(min).divide(max.subtract(min));
}

// -----------------------------
// Normalize Flow Accumulation
// -----------------------------
var rai = normalize(flowAcc).rename("RAI");

// -----------------------------
// Visualization
// -----------------------------
Map.addLayer(rai, {
  min: 0,
  max: 1,
  palette: ["white", "cyan", "blue", "darkblue"]
}, "Runoff Accumulation Index");

// -----------------------------
// Legend
// -----------------------------
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'Runoff Accumulation',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0'
  }
});

legend.add(legendTitle);

var palette = ['ffffff','00ffff','0000ff','00008b'];
var labels = [
  'Low runoff',
  'Moderate runoff',
  'High runoff',
  'Very high runoff'
];

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
// Export
// -----------------------------
Export.image.toDrive({
  image: rai,
  description: "RAZ_MulaMuthaBhima",
  scale: 90,
  region: aoi,
  maxPixels: 1e13
});
