# 🗺️ Location Selector - Enhanced Location Setup Guide

## Overview
The location selector component provides a modern, user-friendly way to set home and work locations during profile completion. It combines **manual search**, **interactive map selection**, and **live location detection** into a single, intuitive interface.

---

## ✨ Features

### 1. **Search Method** 🔍
- **Type address manually** and search for the location
- Real-time address suggestions (when API is available)
- Address validation and formatting
- Error handling if location not found

### 2. **Map Selection** 🗺️
- **Interactive map** for precise location picking
- Click anywhere on the map to select location
- Real-time marker placement
- Automatic reverse geocoding to get address
- Zoom and pan controls
- Shows selected location on map

### 3. **Live Location** 📍
- **One-click current location detection**
- Uses browser's geolocation API
- Automatically converts coordinates to address
- Perfect for quick setup
- Works offline (browser cached location)

---

## 🎯 How It Works

### User Flow

```
Profile Completion Page
    ↓
Location Selection Step
    ↓
┌─────────────────────────────────────┐
│  Choose Home Location               │
│  [Search] [Map] [Live Location]   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Choose Work Location               │
│  [Search] [Map] [Live Location]   │
└─────────────────────────────────────┘
    ↓
Location Coordinates Saved
    ↓
Continue to Next Step
```

---

## 📱 Component Structure

### LocationSelector Props

```typescript
interface LocationSelectorProps {
  title: string;                    // "Home Address" or "Work Address"
  value?: {                         // Current selected location
    address: string;
    lat: number;
    lng: number;
  } | null;
  onChange: (location) => void;    // Callback when location changes
  placeholder?: string;             // Input placeholder text
  description?: string;             // Helper text below title
}
```

### Usage in Profile Completion

```tsx
<LocationSelector
  title="Home Address"
  value={homeLocation}
  onChange={(location) => setHomeLocation(location)}
  placeholder="Enter your home address or use map"
  description="We'll use this as your safe pickup location"
/>

<LocationSelector
  title="Work Address"
  value={workLocation}
  onChange={(location) => setWorkLocation(location)}
  placeholder="Enter your work address or use map"
  description="Common commute destination"
/>
```

---

## 🎨 UI/UX Features

### Method Selection Buttons
```
┌──────────────┬──────────────┬──────────────┐
│ 🔍 Search    │ 📍 Map       │ 📡 Live Loc. │
└──────────────┴──────────────┴──────────────┘
```

- **Active state:** Pink background (#ec4899) with shadow
- **Inactive state:** Gray background, hover effect
- **Disabled state:** When location operation in progress

### Map Interface
- **Height:** 256px (easy to see but not overwhelming)
- **Border:** 2px gray border with rounded corners
- **Controls:** Navigation controls (zoom, pan)
- **Markers:** Pink color (#ec4899) for selected location
- **Click instruction:** Shows hint text below map

### Success Message
```
✅ Location Selected
   [Address Name]
```
- Green background (rgba 30, 30, 30 based)
- Green border
- Check icon
- Full address text

### Error Message
```
❌ Location Error
   [Error message]
```
- Red background
- Red border
- Alert icon
- Error description

---

## 🔄 State Management

### Component States

```typescript
selectedMethod: "search" | "map" | "live"  // Active selection method
searchInput: string                        // User's typed search text
loading: boolean                           // Loading state during API calls
error: string | null                       // Error message if any
showMap: boolean                           // Whether map is displayed
```

### Location Object Structure

```typescript
{
  address: "123 Main Street, City, State 12345",  // Full address
  lat: 28.6139,                                    // Latitude
  lng: 77.209                                      // Longitude
}
```

---

## 🔌 API Integration

### Location Service Methods Used

1. **geocodeAddress(address: string)**
   - Converts typed address → coordinates
   - Returns: GeocodeResponse with formatted_address

2. **reverseGeocode(lat: number, lng: number)**
   - Converts coordinates → address
   - Returns: GeocodeResponse with formatted_address

3. **getCurrentLocation()**
   - Gets browser's current position
   - Returns: { lat: number, lng: number }

---

## 🎬 Animations

### Smooth Transitions
```
Method change          → Fade & slide animation
Error/Success message  → Pop up with opacity
Map visibility toggle  → Height expand/collapse
Loading indicator      → Spinning animation
```

- **Framework:** Framer Motion
- **Duration:** ~300ms for most transitions
- **Easing:** Default (ease-in-out)

---

## 📍 Map Details

### Map Initialization
- **Library:** MapLibre GL
- **Default Center:** Delhi-NCR (28.6139, 77.209)
- **Default Zoom:** 12
- **Fallback Style:** demotiles.maplibre.org (when API key unavailable)

### Marker System
- **Color:** Pink (#ec4899)
- **Animation:** None (instant placement)
- **Behavior:** Updates on each click
- **Previous marker:** Auto-removed when new location selected

### Click Behavior
- **Map click:** Adds marker at clicked location
- **Auto-reverse geocode:** Gets address from coordinates
- **Instant update:** Location updates immediately

---

## 🚀 Usage Scenarios

### Scenario 1: User Prefers Manual Search
```
User Types "123 Main St, Delhi"
     ↓
Clicks "Search" button
     ↓
API returns matching address
     ↓
Location stored: {address, lat, lng}
     ↓
Green success message shown
```

### Scenario 2: User Prefers Map Selection
```
User Clicks "Map" button
     ↓
Map appears on screen
     ↓
User clicks desired location on map
     ↓
Marker appears at clicked location
     ↓
Reverse geocode gets address
     ↓
Location stored: {address, lat, lng}
```

### Scenario 3: User Wants Quick Setup
```
User Clicks "Live Location" button
     ↓
Browser requests permission (if first time)
     ↓
Gets current position via GPS/WiFi
     ↓
Reverse geocodes current location
     ↓
Location stored: {address, lat, lng}
     ↓
User sees current address
```

---

## ⚙️ Error Handling

### Handled Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Please enter an address" | Empty search field | User needs to type address |
| "Location not found" | Address doesn't exist | User should try different address |
| "Failed to search location" | API error | Fallback to manual entry |
| "Unable to access your current location" | Permission denied or GPS error | User can use search/map instead |
| "Failed to get address for this location" | Reverse geocode error | May still have coordinates stored |

### Error UI
- **Red banner** with alert icon
- **Clear error message**
- **Stays visible** until dismissed or fixed

---

## 🔐 Data Privacy

### Browser Permissions
- **Geolocation:** Only requested when "Live Location" clicked
- **User can deny:** Falls back gracefully with error message
- **No data sent:** Coordinates stay local until saved to profile

### Data Stored
- **Address:** Formatted location string
- **Latitude/Longitude:** Precise coordinates
- **Cleared on:** Page refresh (unless persistently saved)

---

## 📱 Responsive Design

### Mobile (320px - 640px)
- Full-width buttons
- Map height optimized for small screens
- Touch-friendly tap targets (44px minimum)

### Tablet (640px - 1024px)
- Balanced layout
- Comfortable map size
- Button spacing optimized

### Desktop (1024px+)
- Maximum usability
- Large interactive map
- Side-by-side readable

---

## ♿ Accessibility

### Keyboard Navigation
- ✓ Tab through buttons
- ✓ Enter key to search (in search input)
- ✓ Focus visible on all buttons

### Screen Readers
- ✓ Button labels clear ("Search", "Map", "Live Location")
- ✓ Error messages announced
- ✓ Success confirmations accessible
- ✓ Status updates communicated

### Visual Accessibility
- ✓ High contrast colors
- ✓ Large text (14px+ minimum)
- ✓ Icon + text on buttons
- ✓ Color not only indicator of status

---

## 🧪 Testing

### Test Cases

1. **Search Method**
   - [ ] Type valid address → Search → Get result
   - [ ] Type invalid address → Search → See error
   - [ ] Empty input → Search → See error
   - [ ] Press Enter key → Triggers search

2. **Map Method**
   - [ ] Click Map button → Map appears
   - [ ] Click on map → Marker placed
   - [ ] Click elsewhere → Marker moves
   - [ ] Zoom/pan works
   - [ ] Each click triggers reverse geocode

3. **Live Location Method**
   - [ ] Click Live Location → Geolocation starts
   - [ ] Allow permission → Gets current location
   - [ ] Deny permission → Shows error
   - [ ] Location found → Address displays

4. **Validation**
   - [ ] Cannot proceed without both locations
   - [ ] Error shown if only one location set
   - [ ] Success when both locations selected

---

## 📊 Data Flow

```
LocationSelector Component
        ↓
┌──────────────────────────────────────┐
│  User selects method:                │
│  - Search: type → API → coordinates  │
│  - Map: click → geocode → address    │
│  - Live: GPS → coordinates → address │
└──────────────────────────────────────┘
        ↓
LocationService handles:
  - geocodeAddress()      [Search]
  - reverseGeocode()      [Map/Live]
  - getCurrentLocation()  [Live]
        ↓
onChange callback triggered
        ↓
Profile State Updated:
  {
    address: "...",
    lat: 28.xxx,
    lng: 77.xxx
  }
        ↓
Saved to Auth Context
        ↓
Used in Dashboard/Safety Features
```

---

## 🎯 Success Criteria

✅ **All Three Methods Working**
- Search finds and geocodes addresses
- Map allows clicking and reverse geocoding
- Live location detects current position

✅ **Smooth User Experience**
- Quick transitions between methods
- No lag during geocoding
- Clear feedback on all actions

✅ **Error Resilience**
- Graceful fallbacks if APIs fail
- Clear error messages
- User can still complete profile

✅ **Mobile Friendly**
- Touch-friendly interface
- Responsive buttons and map
- Works offline (cached)

✅ **Data Integrity**
- Coordinates match addresses
- Valid lat/lng values
- Full address strings saved

---

## 🚀 Future Enhancements

1. **Address Autocomplete**
   - Suggestions as user types
   - Faster location selection

2. **Favorite Locations**
   - Save frequently used addresses
   - Quick toggle between home/work

3. **Multiple Locations**
   - Add gym, school, shopping addresses
   - Route optimization with multiple stops

4. **Route Preview**
   - Show route between home and work
   - Estimated time of travel

5. **Safety Integration**
   - Show crime heatmap on selection
   - Risk indicator for chosen location

---

## 📚 File References

### Main Components
- `src/app/components/LocationSelector.tsx` - Location selector component
- `src/app/pages/profile-completion.tsx` - Profile completion page
- `src/app/services/location-service.ts` - Location APIs

### Supporting Files
- `src/app/utils/api-client.ts` - API communication
- `src/app/utils/api-config.ts` - API endpoints

---

## 💡 Tips for Users

### Best Practices

1. **Use Live Location for Quick Setup**
   - If you have GPS/WiFi enabled
   - Fastest way to set location

2. **Use Map for Precise Selection**
   - If you want exact coordinates
   - Different than your actual GPS
   - For safety features setup

3. **Use Search for Comfortable Entry**
   - If you prefer typing
   - When indoors (GPS may be slow)
   - For complex addresses

### Tips

- ✓ Allow geolocation permission for faster setup
- ✓ Use complete addresses for better matches
- ✓ Review address after selection
- ✓ Update locations if you move/change jobs

---

## 🎉 Summary

The Location Selector provides three powerful methods to set home and work locations:

1. **🔍 Search** - Traditional address entry with validation
2. **🗺️ Map** - Visual, click-anywhere selection
3. **📍 Live Location** - Instant setup with current position

All three methods work seamlessly together, providing flexibility and ease of use for all user types and situations!

---

**Version:** 1.0  
**Status:** ✅ FULLY IMPLEMENTED  
**Date:** February 28, 2026  
**Component File:** `LocationSelector.tsx`
