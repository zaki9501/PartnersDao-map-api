import React, { useState } from 'react';

const MapView = () => {
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        const response = await fetch('http://localhost:5000/api/locations');
        const data = await response.json();
        setLocations(data);
    };

    return (
        <div>
            <h1>Map View</h1>
            <button onClick={fetchLocations}>Load Locations</button>
            <ul>
                {locations.map((loc, index) => (
                    <li key={index}>
                        {loc.location.state}, {loc.location.country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MapView;
