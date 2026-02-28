# API Integration Quick Start

Follow these steps in order to integrate APIs into your SheRide frontend.

---

## 🎯 QUICK 5-STEP SETUP

### STEP 1: Create Environment File (2 minutes)

Copy `.env.example` to `.env` in the root directory:

```bash
# Copy the file
cp .env.example .env
```

Update the values in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000
```

---

### STEP 2: Services Already Created ✅

All API service files have been created in `src/app/services/`:

- ✅ `auth-service.ts` - Login/Signup
- ✅ `profile-service.ts` - Profile management  
- ✅ `crime-service.ts` - Crime hotspots
- ✅ `rides-service.ts` - Ride management

And utilities in `src/app/utils/`:

- ✅ `api-config.ts` - API endpoints config
- ✅ `api-client.ts` - HTTP client wrapper

---

### STEP 3: Set Up Backend (Start Here!)

Follow `BACKEND_SETUP_GUIDE.md` to create backend API:

1. Create Node.js/Express project
2. Set up MongoDB database
3. Create all endpoints (models, routes, controllers)
4. Test endpoints with Postman
5. Deploy or run locally

**Essential endpoints to create:**

```
✅ POST /api/auth/login
✅ POST /api/auth/signup
✅ POST /api/profiles/:userId/complete
✅ GET /api/crimes/hotspots
✅ GET /api/crimes/hotspots/nearby
✅ POST /api/rides
✅ GET /api/rides/history
```

---

### STEP 4: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd sheride-backend
npm install
npm start
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd "SheRide Website UI Design"
npm run dev
# Runs on http://localhost:5173
```

---

### STEP 5: Test in Your App

1. Go to login page
2. Create account with test credentials
3. Complete profile (documents will upload via API)
4. Check browser console for API calls
5. Verify data in backend database

---

## 📝 API Usage Examples

### Example 1: Login in LoginPage

The login page is already set up but uses mock login. To use real API:

```typescript
// In login-page.tsx handleSubmit function
import { authService } from "../services/auth-service";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await authService.login({
      email,
      password,
    });
    
    // Response includes user and token
    login(response.user);
    navigate("/profile-completion");
  } catch (error) {
    alert(error.message);
  }
};
```

### Example 2: Get Crime Hotspots in MapComponent

```typescript
// In MapComponent.tsx
import { crimeService } from "../services/crime-service";
import { useEffect, useState } from "react";

export function MapComponent() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHotspots = async () => {
      setLoading(true);
      try {
        const data = await crimeService.getHotspots();
        setHotspots(data);
      } catch (error) {
        console.error(error);
        // Falls back to mock data automatically
      } finally {
        setLoading(false);
      }
    };

    loadHotspots();
  }, []);

  // Rest of component...
}
```

### Example 3: Complete Profile with API

```typescript
// In profile-completion.tsx
import { profileService } from "../services/profile-service";

const handleSubmit = async () => {
  setLoading(true);
  try {
    const profileData = {
      age: parseInt(age),
      gender,
      emergencyContact,
      emergencyPhone,
      homeLocation,
      workLocation,
      // ... other fields
    };

    // Call API
    await profileService.completeProfile(user.id, profileData);

    // Update local state
    updateProfile(profileData);
    completeProfile();

    navigate("/passenger");
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🧪 Testing APIs

### Option 1: Postman (Recommended)

1. Download Postman
2. Create new requests for each endpoint
3. Test with sample data
4. Example:

```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Option 2: curl (Terminal)

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get hotspots
curl http://localhost:5000/api/crimes/hotspots
```

### Option 3: API Test Hook

```typescript
// Use in a test component
import { useApiCall } from "../hooks/useApiCall";
import { crimeService } from "../services/crime-service";

function TestComponent() {
  const { data, loading, error, execute } = useApiCall();

  const testAPI = async () => {
    try {
      await execute(() => crimeService.getHotspots());
    } catch (error) {
      console.error("API test failed:", error);
    }
  };

  return (
    <div>
      <button onClick={testAPI}>Test API</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Success: {JSON.stringify(data)}</p>}
    </div>
  );
}
```

---

## 🔍 Debugging

### Check API Calls in Browser:

1. Open DevTools (F12)
2. Go to Network tab
3. Make API call
4. Check request and response

### Common Errors:

| Error | Solution |
|-------|----------|
| **CORS Error** | Check CORS settings in backend |
| **401 Unauthorized** | Token might be invalid or expired |
| **404 Not Found** | Endpoint path doesn't match backend |
| **Connection Refused** | Backend not running or wrong port |
| **Timeout** | Increase VITE_API_TIMEOUT in .env |

### Check Network Tab:

Look for:
- ✅ Green status codes (2xx) = Success
- ⚠️ Yellow status codes (4xx) = Client error
- 🔴 Red status codes (5xx) = Server error

---

## 📋 File Structure After Setup

```
SheRide Website UI Design/
├── .env                          # NEW - Environment variables
├── .env.example                  # NEW - Template
├── src/app/
│   ├── services/                 # NEW - API services
│   │   ├── auth-service.ts
│   │   ├── profile-service.ts
│   │   ├── crime-service.ts
│   │   └── rides-service.ts
│   ├── hooks/                    # NEW - Custom hooks
│   │   └── useApiCall.ts
│   ├── utils/
│   │   ├── api-config.ts        # NEW
│   │   └── api-client.ts        # NEW
│   └── ...
├── BACKEND_SETUP_GUIDE.md        # NEW
├── API_INTEGRATION_GUIDE.md      # NEW
└── ...
```

---

## ✅ Integration Checklist

Frontend:
- [ ] Create `.env` file with API URL
- [ ] All service files created
- [ ] useApiCall hook created
- [ ] Components can import services
- [ ] Test API calls in components

Backend:
- [ ] Database set up (MongoDB/PostgreSQL)
- [ ] Node.js/Express project initialized
- [ ] All models created
- [ ] All routes implemented
- [ ] CORS configured
- [ ] Authentication (JWT) working
- [ ] Endpoints tested with Postman

Integration:
- [ ] .env points to backend URL
- [ ] Both frontend & backend running
- [ ] Login works with real API
- [ ] Profile completion saves to DB
- [ ] Crime hotspots fetch from DB
- [ ] Document uploads work
- [ ] Error handling works

---

## 🆘 Need Help?

### Files to Read:

1. `API_INTEGRATION_GUIDE.md` - Detailed explanation
2. `BACKEND_SETUP_GUIDE.md` - Backend implementation
3. Code comments in service files - Implementation details

### Common Questions:

**Q: Why do APIs keep using mock data?**
A: Fallback is automatic when backend is unavailable. This is intentional for better UX.

**Q: Where do I put my JWT token?**
A: Automatically stored in localStorage by setToken() in api-client.ts

**Q: How do I test without backend?**
A: Frontend works with mock data as fallback. Remove the catch blocks to force API usage.

**Q: Can I test locally?**
A: Yes! Run backend on localhost:5000 and frontend on localhost:5173. Update CORS in backend.

---

## 📞 Summary

✅ **2-3 hours:** Follow BACKEND_SETUP_GUIDE.md and get backend running  
✅ **30 minutes:** Test all endpoints with Postman  
✅ **30 minutes:** Update `.env` and test frontend integration  
✅ **Done!** Your app is now fully connected to real APIs

---

**Start With STEP 1!** (Create .env file)

**Then STEP 3!** (Set up backend using BACKEND_SETUP_GUIDE.md)

**Everything Else Will Work!** ✨
