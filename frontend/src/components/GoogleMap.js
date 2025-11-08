import React, { useEffect, useRef, useState } from 'react';
import './GoogleMap.css';

const GoogleMap = ({ hospitals, center }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Get API key from environment variable
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Check if API key is available
    if (!API_KEY) {
      setError('Google Maps API key not found. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file');
      return;
    }

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setError('Failed to load Google Maps. Please check your API key.');
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [API_KEY]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    // Initialize map
    const defaultCenter = center || { lat: 40.7128, lng: -74.0060 }; // Default to New York
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(newMap);

    // Add user location marker
    new window.google.maps.Marker({
      position: defaultCenter,
      map: newMap,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#6C63FF',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    });
  }, [isLoaded, map, center]);

  useEffect(() => {
    if (!map || !hospitals || hospitals.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Add hospital markers
    const newMarkers = hospitals.map((hospital, index) => {
      const marker = new window.google.maps.Marker({
        position: hospital.position || {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        },
        map: map,
        title: hospital.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1E293B; font-size: 14px;">${hospital.name}</h3>
            <p style="margin: 4px 0; color: #64748B; font-size: 12px;">📍 ${hospital.distance}</p>
            <p style="margin: 4px 0; color: #64748B; font-size: 12px;">📞 ${hospital.phone}</p>
            <p style="margin: 4px 0; color: #64748B; font-size: 12px;">🕐 ${hospital.hours}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name)}" 
               target="_blank" 
               style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #6C63FF; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
              Get Directions
            </a>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, hospitals]);

  if (error) {
    return (
      <div className="map-error">
        <div className="error-icon">🗺️</div>
        <h3>Map Unavailable</h3>
        <p>{error}</p>
        <div className="setup-instructions">
          <h4>How to enable Google Maps:</h4>
          <ol>
            <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Enable Maps JavaScript API</li>
            <li>Create <code>.env</code> file in frontend folder</li>
            <li>Add: <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="google-map-container">
      <div ref={mapRef} className="google-map" />
    </div>
  );
};

export default GoogleMap;
