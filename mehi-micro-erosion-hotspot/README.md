# Micro Erosion Hotspot Index (MEHI)

## Objective
To identify micro-level soil erosion hotspot zones within the
Mula–Mutha–Bhima watershed using a simple multi-factor index.

## Study Area
Mula–Mutha–Bhima River Basin, Maharashtra, India

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

## Author
Bhavya Singh
