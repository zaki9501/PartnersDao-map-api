import React from 'react';

const AddLocationButton = () => {
    const handleAddLocation = () => {
        fetch('http://104.248.249.63:5000/api/locations/add-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'user123',
                location: {
                    state: 'California',
                    country: 'USA',
                    latitude: 36.7783, // Example latitude
                    longitude: -119.4179, // Example longitude
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log('Location added:', data))
            .catch((error) => console.error('Error:', error));
    };

    return (
        <button onClick={handleAddLocation} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Add Location
        </button>
    );
};

export default AddLocationButton;
import React from 'react';

const AddLocationButton = () => {
    const handleAddLocation = () => {
        fetch('http://104.248.249.63:5000/api/locations/add-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'user123',
                location: {
                    state: 'California',
                    country: 'USA',
                    latitude: 36.7783, // Example latitude
                    longitude: -119.4179, // Example longitude
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log('Location added:', data))
            .catch((error) => console.error('Error:', error));
    };

    return (
        <button onClick={handleAddLocation} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Add Location
        </button>
    );
};

export default AddLocationButton;
