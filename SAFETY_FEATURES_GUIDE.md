# SheRide Safety & Verification Features Documentation

## Overview
This document explains the new safety features implemented in the SheRide platform, including profile verification, time-based access control, crime heat maps, and location-based safety alerts.

## Features Implemented

### 1. **Profile Verification & Completion**

After users login, they must complete their profile with critical safety information before accessing the platform.

#### Flow:
1. User signs up/logs in → Redirected to `/profile-completion`
2. User fills personal info (age, gender, emergency contact)
3. User selects home and work locations on map
4. User uploads ID proof and documents
5. Profile marked as complete → Redirected to appropriate dashboard

#### Files:
- `src/app/pages/profile-completion.tsx` - Main profile form
- `src/app/context/AuthContext.tsx` - Updated with profile data

#### Key Information Collected:
**For All Users:**
- Age
- Gender
- Emergency contact name & phone
- Home location (with map)
- Work location (with map)
- ID proof upload
- ID number

**For Drivers (Additional):**
- Driver license number
- Vehicle model
- Vehicle number/plate
- Insurance proof

### 2. **Time-Based Access Control**

The platform implements a time-based system for safer night rides:

#### Rules:
- **Day (6 AM - 9 PM):** Everyone can book any ride type
- **Night (9 PM - 6 AM):** Only female passengers can book "Girls Only" rides

#### Implementation Files:
- `src/app/utils/time-access-control.ts` - Core logic

#### Key Functions:
```typescript
// Check if it's night time
isNightTime(): boolean

// Get current time type
isDayTime(): boolean

// Check access based on time and gender
checkAccessByTimeAndGender(timeType: "day" | "night", gender: string)

// Get time restrictions info
getTimeRestrictionsInfo()
```

#### Usage in Components:
```tsx
import { TimeAccessInfo } from "../components/TimeAccessInfo";

// Use in your page
<TimeAccessInfo 
  userGender={user.profile.gender}
  className="mb-4"
/>
```

### 3. **Crime Heat Map Visualization**

Display crime hotspots and safety ratings for different areas.

#### Features:
- Interactive map showing crime hotspots
- Color-coded risk levels (Safe/Caution/High-Risk)
- Incident statistics per location
- Nearby hotspots list
- Risk intensity percentage

#### Files:
- `src/app/components/MapComponent.tsx` - Map UI component
- `src/app/utils/crime-heatmap.ts` - Crime data and calculations

#### Crime Risk Levels:
- **Safe (Green):** Intensity < 30%, Low crime incidents
- **Caution (Amber):** Intensity 30-60%, Moderate incidents
- **High-Risk (Red):** Intensity > 60%, Higher incident rate

#### Implementation Files:
```tsx
import { MapComponent } from "../components/MapComponent";
import { crimeHotspots } from "../utils/crime-heatmap";

// Display map with heatmap
<MapComponent 
  onLocationSelect={(location) => {
    // Handle location selection
  }}
  showHeatmap={true}
  interactive={true}
/>
```

### 4. **Safety Alerts Component**

Displays real-time safety information based on selected location.

#### Features:
- Area safety report with percentage
- Nearby crime hotspots
- Contextualized safety tips
- Risk assessment

#### Usage:
```tsx
import { SafetyAlert } from "../components/SafetyAlert";

<SafetyAlert 
  latitude={28.6139}
  longitude={77.209}
  radiusKm={5}
/>
```

## MapLibre + MapTiler Integration (Optional)

To use a real vector map with search and reverse geocoding:

### Setup Steps:

1. **Get MapTiler API Key:**
  - Visit [MapTiler Cloud](https://www.maptiler.com/cloud/)
  - Create a free account
  - Create an API key

2. **Install Package:**
  ```bash
  npm install maplibre-gl
  ```

3. **Configure Environment:**
  ```
  VITE_MAPTILER_API_KEY=your_api_key_here
  ```

4. **MapComponent.tsx (optional tweaks):**
  - Adjust the MapTiler style URL
  - Tune heatmap radius or colors

## Updated Authentication Flow

### Login → Profile Completion → Dashboard

```
1. User Login (Role Selection)
   ↓
2. Basic Credentials (Name, Email, Password)
   ↓
3. Profile Completion (NEW)
   ├─ Step 1: Personal & Vehicle Info
   ├─ Step 2: Location Selection
   └─ Step 3: Document Verification
   ↓
4. Dashboard Access (Passenger/Driver)
```

## File Structure

```
src/app/
├── pages/
│   ├── profile-completion.tsx          (NEW)
│   ├── login-page.tsx                  (UPDATED)
│   └── ...
├── components/
│   ├── MapComponent.tsx                (NEW)
│   ├── TimeAccessInfo.tsx              (NEW)
│   ├── SafetyAlert.tsx                 (NEW)
│   ├── ProtectedRoute.tsx              (UPDATED)
│   └── ...
├── context/
│   └── AuthContext.tsx                 (UPDATED)
├── utils/
│   ├── time-access-control.ts          (NEW)
│   ├── crime-heatmap.ts                (NEW)
│   └── ...
└── routes.tsx                          (UPDATED)
```

## Data Models

### UserProfile Interface
```typescript
interface UserProfile {
  age?: number;
  gender?: "male" | "female" | "other";
  profilePhoto?: string;
  idProof?: string;
  idNumber?: string;
  licenseNumber?: string;           // Drivers only
  vehicleModel?: string;             // Drivers only
  vehicleNumber?: string;            // Drivers only
  insuranceProof?: string;           // Drivers only
  emergencyContact?: string;
  emergencyPhone?: string;
  homeLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  workLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  verificationStatus?: "pending" | "approved" | "rejected";
}
```

### CrimeHotspot Interface
```typescript
interface CrimeHotspot {
  id: string;
  lat: number;
  lng: number;
  intensity: number;        // 0-100
  location: string;
  incidentsLastMonth: number;
  safetyRating: "safe" | "caution" | "high-risk";
  description: string;
}
```

## Integration in Dashboards

### Passenger Dashboard
```tsx
import { TimeAccessInfo } from "../components/TimeAccessInfo";
import { SafetyAlert } from "../components/SafetyAlert";
import { MapComponent } from "../components/MapComponent";

export function PassengerDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Time-based access info */}
      <TimeAccessInfo userGender={user?.profile?.gender} />
      
      {/* Safety alert for home location */}
      {user?.profile?.homeLocation && (
        <SafetyAlert 
          latitude={user.profile.homeLocation.lat}
          longitude={user.profile.homeLocation.lng}
        />
      )}
      
      {/* Map for ride selection */}
      <MapComponent showHeatmap={true} />
    </div>
  );
}
```

### Driver Dashboard
```tsx
import { TimeAccessInfo } from "../components/TimeAccessInfo";
import { MapComponent } from "../components/MapComponent";

export function DriverDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <TimeAccessInfo userGender={user?.profile?.gender} />
      {/* Show ride requests in safe areas */}
      <MapComponent showHeatmap={false} />
    </div>
  );
}
```

## Testing Safety Features

### Test Profiles:
1. **Passenger (Female):**
   - Name: Sarah
   - Gender: Female
   - Can book rides at any time

2. **Passenger (Male):**
   - Name: John
   - Gender: Male
   - Cannot book rides after 9 PM

3. **Driver:**
   - Name: Priya
   - License: DL12345
   - Vehicle: Innova XE

### Test Scenarios:
1. Create account → Complete profile → Check dashboard
2. Check time-based access during night
3. Select location and view crime hotspots
4. Upload documents for verification

## Mock Data

Crime hotspots are hardcoded in `src/app/utils/crime-heatmap.ts`. In production:

1. **Fetch from Backend:**
   ```typescript
   const response = await fetch('/api/crime-hotspots');
   const hotspots = await response.json();
   ```

2. **Update Real-time:**
   - Use WebSocket for live crime data
   - Cache hotspots locally
   - Refresh every 24 hours

3. **External Data Sources:**
   - Government crime statistics
   - Police department reports
   - Crowdsourced incident reports

## Security Considerations

1. **Document Verification:**
   - Validate file formats (image/pdf)
   - Scan for malware
   - Store encrypted
   - Manual admin review

2. **Location Privacy:**
   - Don't share exact locations publicly
   - Use generalized heat maps
   - Permit privacy controls

3. **Data Protection:**
   - Encrypt sensitive data in transit
   - Hash IDs before storage
   - Implement GDPR compliance
   - Regular security audits

## Future Enhancements

1. **AI-based Threat Detection:**
   - ML models for real-time threat scoring
   - Predict high-risk times/areas

2. **Community Safety Features:**
   - User-reported incidents
   - Community safety rating
   - Emergency alert system

3. **Driver Verification:**
   - Facial recognition for identity
   - Background checks integration
   - Real-time document validation

4. **Advanced Itinerary Planning:**
   - Route safety scoring
   - Alternative route suggestions
   - Real-time hazard alerts

## Support & Troubleshooting

### Profile Not Saving:
- Check localStorage
- Verify AuthContext is properly wrapped
- Check browser console for errors

### Map Not Loading:
- Verify MapComponent imports
- Check if crime-heatmap data loaded
- Test in browser DevTools

### Access Control Not Working:
- Verify time-access-control imports
- Check user gender value
- Test with different times

## References

- [React Router Documentation](https://reactrouter.com/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- [MapTiler Cloud](https://www.maptiler.com/cloud/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Motion/Framer Motion](https://motion.dev/)

---

**Last Updated:** February 2026
**Version:** 1.0
