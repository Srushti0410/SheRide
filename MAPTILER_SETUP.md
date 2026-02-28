# MAPTILER SETUP (FREE MAPS)

## QUICK STEPS

1. Create a free MapTiler account:
   https://www.maptiler.com/cloud/

2. Create an API key:
   - Dashboard -> API Keys -> Create key

3. Add key to your .env file (root folder):

   VITE_MAPTILER_API_KEY=YOUR_KEY_HERE

4. Restart dev server:

   npm run dev

## WHAT YOU GET

- MapLibre vector map (fast, modern styling)
- Hotspot heatmap overlay
- Place search and reverse geocoding

## TROUBLESHOOTING

- Map is blank: check key and restart the dev server.
- Search not working: ensure the same key is used for geocoding.
- Too many requests: MapTiler free tier has limits.

## NOTES

- This setup replaces Google Maps.
- The app falls back to the SVG map if the key is missing.
