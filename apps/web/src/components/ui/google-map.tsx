"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

export interface MapLocation {
    id: string;
    title: string;
    lat: number;
    lng: number;
    address?: string;
    telefono?: string;
}

interface GoogleMapsProps {
    locations: MapLocation[];
    height?: string;
    zoom?: number;
    center?: { lat: number; lng: number };
}

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

export function GoogleMapsComponent({
    locations,
    height = "400px",
    zoom = 13,
    center,
}: GoogleMapsProps) {
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");

    useEffect(() => {
        // Get API key from environment variable
        setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

        // Calculate center of map based on locations if not provided
        if (!center && locations && locations.length > 0) {
            // Use first location as center if only one location
            if (locations.length === 1 && locations[0]?.lat && locations[0]?.lng) {
                setMapCenter({
                    lat: locations[0].lat,
                    lng: locations[0].lng
                });
            } else {
                // Calculate center by averaging lat and lng
                const avgLat = locations.reduce((sum, loc) => sum + (loc?.lat || 0), 0) / locations.length;
                const avgLng = locations.reduce((sum, loc) => sum + (loc?.lng || 0), 0) / locations.length;
                setMapCenter({ lat: avgLat, lng: avgLng });
            }
        } else if (center) {
            setMapCenter(center);
        } else {
            // Default to center of Chile if no locations or center provided
            setMapCenter({ lat: -33.4489, lng: -70.6693 }); // Santiago, Chile
        }
    }, [center, locations]);

    // Don't render until we have API key and map center
    if (!googleMapsApiKey || !mapCenter) {
        return (
            <div
                style={{ height }}
                className="flex justify-center items-center bg-gray-100 rounded-sm"
            >
                <div className="flex flex-col items-center text-gray-500">
                    <MapPin size={24} />
                    <span className="mt-2">Cargando mapa...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-sm h-[60svh] lg:h-full overflow-hidden">
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={zoom}
                    options={{
                        fullscreenControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: true,
                    }}
                >
                    {locations.map((location) => (
                        <Marker
                            key={location.id}
                            position={{ lat: location.lat, lng: location.lng }}
                            onClick={() => setSelectedLocation(location)}
                            title={location.title}
                        />
                    ))}

                    {selectedLocation && (
                        <InfoWindow
                            position={{
                                lat: selectedLocation.lat,
                                lng: selectedLocation.lng,
                            }}
                            onCloseClick={() => setSelectedLocation(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h4 className="font-bold text-sm">{selectedLocation.title}</h4>
                                {selectedLocation.address && (
                                    <p className="mt-1 text-xs">{selectedLocation.address}</p>
                                )}
                                {selectedLocation.telefono && (
                                    <p className="mt-1 text-xs">Tel: {selectedLocation.telefono}</p>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
} 