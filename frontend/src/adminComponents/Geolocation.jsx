import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Geolocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });

                        try {
                            const response = await axios.post('/api/auth/location', { latitude, longitude });
                        } catch (error) {
                            console.error('Error posting location data:', error);
                            setError('Error posting location data.');
                        }
                    },
                    (err) => {
                        let errorMessage;
                        switch (err.code) {
                            case err.PERMISSION_DENIED:
                                errorMessage = 'User denied the request for Geolocation.';
                                break;
                            case err.POSITION_UNAVAILABLE:
                                errorMessage = 'Location information is unavailable.';
                                break;
                            case err.TIMEOUT:
                                errorMessage = 'The request to get user location timed out.';
                                break;
                            default:
                                errorMessage = 'An unknown error occurred.';
                                break;
                        }
                        console.error("Geolocation error:", errorMessage);
                        setError(errorMessage);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        getLocation();
    }, []);

    return (
        <div>
        </div>
    );
};

export default Geolocation;
