import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import './MapComponent.css';

const MapComponent = ({ hospitals, center }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Open in Google Maps
  const openInGoogleMaps = (hospital) => {
    const query = encodeURIComponent(hospital.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Get directions
  const getDirections = (hospital) => {
    const destination = encodeURIComponent(hospital.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  return (
    <div className="map-component">
      {/* Interactive Map View */}
      <div className="map-container">
        <div className="map-header">
          <MapPin size={20} />
          <span>Healthcare Facilities Near You</span>
        </div>

        {/* Static Map with Markers */}
        <div className="static-map">
          {/* User Location */}
          <div className="map-marker user-marker" style={{ top: '50%', left: '50%' }}>
            <div className="marker-pulse"></div>
            <div className="marker-icon user">📍</div>
            <div className="marker-label">You</div>
          </div>

          {/* Hospital Markers */}
          {hospitals.map((hospital, index) => {
            const positions = [
              { top: '30%', left: '60%' },
              { top: '65%', left: '40%' },
              { top: '35%', left: '30%' },
              { top: '70%', left: '65%' }
            ];
            const pos = positions[index] || { top: '50%', left: '50%' };

            return (
              <div
                key={index}
                className={`map-marker hospital-marker ${selectedHospital === index ? 'active' : ''}`}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedHospital(selectedHospital === index ? null : index)}
              >
                <div className="marker-icon hospital">🏥</div>
                {selectedHospital === index && (
                  <div className="marker-popup">
                    <h4>{hospital.name}</h4>
                    <div className="popup-info">
                      <span><MapPin size={14} /> {hospital.distance}</span>
                      <span><Phone size={14} /> {hospital.phone}</span>
                      <span><Clock size={14} /> {hospital.hours}</span>
                    </div>
                    <div className="popup-actions">
                      <button onClick={() => getDirections(hospital)} className="btn-popup">
                        <Navigation size={14} />
                        Directions
                      </button>
                      <button onClick={() => openInGoogleMaps(hospital)} className="btn-popup">
                        <ExternalLink size={14} />
                        View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Map Grid Lines */}
          <div className="map-grid"></div>
        </div>

        {/* Map Controls */}
        <div className="map-controls">
          <button className="control-btn" title="Zoom In">+</button>
          <button className="control-btn" title="Zoom Out">−</button>
          <button className="control-btn" title="My Location">
            <Navigation size={16} />
          </button>
        </div>

        {/* Open in Google Maps Button */}
        <button 
          className="open-google-maps"
          onClick={() => window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank')}
        >
          <ExternalLink size={16} />
          Open in Google Maps
        </button>
      </div>

      {/* Hospital List */}
      <div className="hospitals-quick-list">
        {hospitals.map((hospital, index) => (
          <div 
            key={index} 
            className={`quick-hospital-card ${selectedHospital === index ? 'selected' : ''}`}
            onClick={() => setSelectedHospital(index)}
          >
            <div className="quick-hospital-icon">🏥</div>
            <div className="quick-hospital-info">
              <h4>{hospital.name}</h4>
              <span className="distance">{hospital.distance}</span>
            </div>
            <button 
              className="quick-directions-btn"
              onClick={(e) => {
                e.stopPropagation();
                getDirections(hospital);
              }}
            >
              <Navigation size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="map-info-banner">
        <span className="info-icon">💡</span>
        <span>Click hospital markers or cards to see details. Click "Directions" to navigate.</span>
      </div>
    </div>
  );
};

export default MapComponent;
