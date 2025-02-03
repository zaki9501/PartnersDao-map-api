import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { FaMapMarkerAlt, FaCrosshairs } from "react-icons/fa";
import { SiX } from "react-icons/si";

// Import the WalletConnect component
import WalletConnect from "./WalletConnect";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const UserIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const PartnerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LocateButton = ({ onClick }) => (
  <div className="leaflet-control leaflet-bar !bg-transparent !shadow-none">
    <button 
      onClick={onClick}
      className="p-2 bg-black text-white hover:bg-gray-800 transition-transform duration-300 rounded-full"
      title="Locate Me"
      style={{ zIndex: 1000 }}
    >
      <FaCrosshairs className="text-green-400" />
    </button>
  </div>
);

const PartnersMap = ({ locations }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        const ipResponse = await axios.get("https://api64.ipify.org?format=json");
        const geoResponse = await axios.get(`https://ipapi.co/${ipResponse.data.ip}/json/`);
        const { latitude, longitude, city, country_name } = geoResponse.data;
        
        if (latitude && longitude) {
          setUserLocation({ latitude, longitude, city, country_name });
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
        }
      } catch (error) {
        console.error("Location fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, []);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
      setMapZoom(12);
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fixed buttons with higher z-index */}
      <div className="fixed top-5 right-5 flex gap-4 z-[1001]">
        {/* Use the WalletConnect component */}
        <WalletConnect />

        {/* Connect X Button */}
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full border-2 border-green-500 hover:bg-gray-900 transition-all duration-300 text-lg font-bold shadow-lg hover:shadow-green-500/50 hover:-translate-y-1"
          onClick={() => (window.location.href = "http://95.164.18.230:5000/auth/x")}
        >
          <SiX size={24} className="text-green-500" />
          <span className="italic">CONNECT X</span>
        </button>
      </div>

      {/* Rest of the code remains the same */}
      {/* ... */}
    </div>
  );
};

export default PartnersMap;
