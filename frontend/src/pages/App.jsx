import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Connection, PublicKey } from "@solana/web3.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PartnersMap from "../components/PartnersMap"; // ✅ Import our new UI

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"; // ✅ Use Mainnet or Devnet
const TOKEN_ADDRESS = "Your_Solana_Token_Address"; // ✅ Replace with your SPL Token address
const MINIMUM_BALANCE = 1;

// ✅ Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ Component to Control Map Zoom to User Location
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const App = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default: San Francisco
    const [mapZoom, setMapZoom] = useState(4); // Default zoom level
    const [username, setUsername] = useState("");
    const [isConnectedToX, setIsConnectedToX] = useState(false);

    // ✅ Fetch all pinned locations when the site loads
    useEffect(() => {
        fetch("http://95.164.18.230:5000/api/locations/get-locations")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched locations:", data);
                setLocations(data);
            })
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    // ✅ Fetch user's approximate location based on IP
    useEffect(() => {
        fetch("http://95.164.18.230:5000/api/locations/get-location-by-ip")
            .then(response => response.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    console.log("✅ User location detected:", data);
                    setUserLocation(data);
                    setMapCenter([data.latitude, data.longitude]); // Auto-center to user location
                    setMapZoom(10); // Zoom in when location is detected
                }
            })
            .catch(error => console.error("Error fetching IP location:", error));
    }, []);

    // ✅ Check if user is connected to X (from URL query params)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const usernameFromURL = params.get("username");
        if (usernameFromURL) {
            setUsername(usernameFromURL);
            setIsConnectedToX(true);
            console.log(`✅ Connected to X as: @${usernameFromURL}`);
        }
    }, []);

    return (
        <div className="bg-black min-h-screen text-white">
            {/* ✅ Use PartnersMap UI */}
            <PartnersMap
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                userLocation={userLocation}
                locations={locations}
                username={username}
                isConnectedToX={isConnectedToX}
            />
        </div>
    );
};

export default App;
