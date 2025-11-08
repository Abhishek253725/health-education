# 🗺️ Google Maps Integration Guide

Complete guide to enable Google Maps in the EduHealth Nexus Health Page.

---

## 📋 Overview

The Health Page now includes an interactive Google Maps component that displays:
- ✅ User's current location
- ✅ Nearby healthcare facilities
- ✅ Hospital markers with info windows
- ✅ Direct navigation links
- ✅ Interactive map controls

---

## 🔑 Step 1: Get Google Maps API Key

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `EduHealth-Nexus`
4. Click **"Create"**

### 1.2 Enable Maps JavaScript API

1. In the Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Maps JavaScript API"**
3. Click on it and press **"Enable"**

### 1.3 Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key
4. (Optional) Click **"Restrict Key"** to add restrictions:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add `http://localhost:3000/*`
   - **API restrictions**: Select "Maps JavaScript API"

---

## ⚙️ Step 2: Configure Your Application

### 2.1 Create Environment File

In the **frontend** folder, create a `.env` file:

```bash
cd frontend
```

Create `.env` file with:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**Replace** `YOUR_API_KEY_HERE` with your actual API key.

### 2.2 Example `.env` File

```env
# Google Maps Configuration
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Other configurations
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_SERVICE_URL=http://localhost:5001
```

---

## 🚀 Step 3: Restart Development Server

After adding the API key, restart your frontend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

---

## ✅ Step 4: Verify Integration

1. Open your browser: http://localhost:3000
2. Navigate to **Health** page
3. Scroll to **"Nearby Healthcare Facilities"** section
4. You should see an interactive Google Map with:
   - Your location (purple marker)
   - Hospital locations (red markers)
   - Click markers to see hospital details
   - "Get Directions" links

---

## 🎯 Features Included

### Interactive Map
- **Zoom controls**: Zoom in/out
- **Pan**: Drag to move around
- **Markers**: Click to see details
- **Info Windows**: Hospital information popup
- **Directions**: Direct link to Google Maps navigation

### Hospital Markers
Each marker shows:
- 🏥 Hospital name
- 📍 Distance from user
- 📞 Phone number
- 🕐 Operating hours
- 🗺️ Get Directions button

### User Location
- Purple circle marker shows your location
- Centered on map by default
- Can be updated with real geolocation

---

## 🔧 Customization

### Change Default Location

Edit `frontend/src/pages/HealthPage.js`:

```javascript
// Change these coordinates to your location
const userLocation = { 
  lat: 40.7128,  // Your latitude
  lng: -74.0060  // Your longitude
};
```

### Add More Hospitals

```javascript
const nearbyHospitals = [
  {
    name: 'Your Hospital Name',
    distance: '1.5 km',
    phone: '+1 555-0000',
    hours: '24/7',
    position: { lat: 40.7150, lng: -74.0070 }
  },
  // Add more hospitals...
];
```

### Change Map Style

Edit `frontend/src/components/GoogleMap.js`:

```javascript
const newMap = new window.google.maps.Map(mapRef.current, {
  center: defaultCenter,
  zoom: 13,
  mapTypeId: 'roadmap', // or 'satellite', 'hybrid', 'terrain'
  styles: [
    // Add custom map styling here
  ]
});
```

---

## 🌍 Enable Real Geolocation

To use the user's actual location, add this to `HealthPage.js`:

```javascript
const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 });

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }
}, []);
```

---

## 🐛 Troubleshooting

### Map Not Loading

**Problem**: Map shows error message

**Solutions**:
1. Check API key is correct in `.env` file
2. Verify Maps JavaScript API is enabled
3. Check browser console for errors
4. Restart development server
5. Clear browser cache

### "API Key Not Found" Error

**Problem**: Environment variable not loaded

**Solutions**:
1. Ensure `.env` file is in `frontend` folder (not root)
2. Variable must start with `REACT_APP_`
3. Restart development server after adding `.env`
4. Check for typos in variable name

### "RefererNotAllowedMapError"

**Problem**: API key restrictions blocking localhost

**Solutions**:
1. Go to Google Cloud Console
2. Edit API key restrictions
3. Add `http://localhost:3000/*` to allowed referrers
4. Or temporarily remove restrictions for testing

### Markers Not Showing

**Problem**: Hospital positions not displaying

**Solutions**:
1. Verify `position` coordinates are valid
2. Check latitude/longitude format
3. Ensure coordinates are within map bounds
4. Check browser console for JavaScript errors

---

## 💰 Pricing Information

### Google Maps Free Tier

- **$200 free credit per month**
- **28,000+ map loads per month** (free)
- **100,000+ map loads per month** (free with credit)

### For Development
- Testing and development usage is typically free
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid charges

---

## 🔒 Security Best Practices

### 1. Restrict API Key

```
Application restrictions:
- HTTP referrers (websites)

Website restrictions:
- http://localhost:3000/*
- https://yourdomain.com/*

API restrictions:
- Maps JavaScript API only
```

### 2. Don't Commit API Key

Add to `.gitignore`:
```
.env
.env.local
.env.development.local
.env.production.local
```

### 3. Use Environment Variables

Never hardcode API keys in source code:
```javascript
// ❌ Bad
const API_KEY = 'AIzaSyBxxxxxxx';

// ✅ Good
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
```

---

## 📱 Mobile Considerations

The map is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Touch gestures supported

---

## 🎨 Advanced Features (Optional)

### 1. Directions Service

```javascript
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
```

### 2. Places Autocomplete

```javascript
const autocomplete = new google.maps.places.Autocomplete(input);
```

### 3. Distance Matrix

```javascript
const service = new google.maps.DistanceMatrixService();
```

### 4. Custom Markers

```javascript
const marker = new google.maps.Marker({
  icon: {
    url: '/custom-marker.png',
    scaledSize: new google.maps.Size(40, 40)
  }
});
```

---

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps API Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

## ✅ Quick Setup Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Maps JavaScript API
- [ ] Generated API key
- [ ] Created `frontend/.env` file
- [ ] Added `REACT_APP_GOOGLE_MAPS_API_KEY=your_key`
- [ ] Restarted development server
- [ ] Tested map on Health page
- [ ] Markers are visible
- [ ] Info windows work
- [ ] Directions links work

---

## 🎉 Success!

If you see an interactive map with hospital markers, congratulations! Your Google Maps integration is complete.

**Next Steps**:
- Customize hospital locations
- Add real geolocation
- Style the map
- Add more features

---

**Need Help?**
- Check browser console for errors
- Review Google Cloud Console logs
- Verify API key restrictions
- See troubleshooting section above

---

**Last Updated**: November 2024
**Version**: 1.0.0
