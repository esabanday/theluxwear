# Shopify Import Package

This folder includes:
- `LuxWear_Product_Import.csv` — Shopify-ready product import (draft status, price set to 0.00).
- `LuxWear_Image_Map.csv` — map local files to Shopify File URLs after upload.
- `tiktok_captions.md` — captions + content notes from the workbook.

## Import Steps
1. Upload product images/videos to Shopify Admin → Content → Files.
2. Copy each file URL into `LuxWear_Image_Map.csv`.
3. Paste those URLs into the `Image Src` column for each product in `LuxWear_Product_Import.csv`.
4. Import the CSV in Shopify Admin → Products → Import.
5. Update prices, sizes, and publish products when ready.

Note: Prices are set to `0.00` and status is `draft` to prevent accidental publishing.
