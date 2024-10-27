// src/components/MapComponent.jsx
import {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapComponent = () => {
    const locations = [
        [21.249720, 81.602440],
        [21.249819, 81.607824],
    ];

    const [suspiciousUsers, setSuspiciousUsers] = useState([]);

    const getSuspiciousUsers = async () => {
        try {
        const response = await axios.get('/api/suspicious');
        setSuspiciousUsers(response.data);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getSuspiciousUsers();
    }, []);

    const userLocation = [];
    suspiciousUsers.map((user) => {
        const { latitude, longitude } = user.userId.location || {};
        if (latitude && longitude) userLocation.push([latitude, longitude]);
    });
    console.log(userLocation);

    return (
        <MapContainer center={locations[0]} zoom={5} style={{ height: '400px', width: '100%'}} className='p-6 rounded-lg shadow-lg'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation.map((position, index) => (
                <Marker key={index} position={position}>
                    <Popup>
                        Location {index + 1}: [{position[0]}, {position[1]}]
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
