# Micro Erosion Hotspot Index (MEHI)

## Objective
To identify micro-level soil erosion hotspot zones within the
Mula–Mutha–Bhima watershed using a simple multi-factor index.

## Study Area
Mula–Mutha–Bhima River Basin, Maharashtra, India

## Timeline
01 Jan 2026 - 29 Jan 2026

## Datasets
- SRTM DEM
- Sentinel-2 Surface Reflectance
- CHIRPS Rainfall

## Methodology
1. Generate slope from DEM
2. Compute NDVI from Sentinel-2
3. Aggregate annual rainfall
4. Normalize all layers
5. Invert NDVI
6. Compute MEHI

## Tools
Google Earth Engine

## Output
Raster map showing erosion susceptibility (0–1)

## MEHI Classes (Legend)
Low (0.0–0.25): Low erosion susceptibility
Moderate (0.25–0.5): Moderate susceptibility
High (0.5–0.75): High susceptibility
Very High (0.75–1.0): Very high susceptibility

## Interpretation
The MEHI map indicates the relative susceptibility of different parts of the Mula–Mutha–Bhima catchment to soil erosion based on the combined influence of terrain, vegetation cover, and rainfall.
Areas with high MEHI values (orange–red) represent zones where steeper slopes, lower vegetation cover, and rainfall together create conditions favorable for soil detachment and transport. These zones can be considered priority areas for soil and water conservation interventions.
Areas with low MEHI values (green) indicate comparatively stable terrain with better vegetation cover and lower likelihood of erosion.
The index represents erosion susceptibility (potential), not actual measured soil loss, and is intended as a screening-level decision support tool.

## Author
Bhavya Singh
