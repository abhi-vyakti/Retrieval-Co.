import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Custom Red Marker Icon
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Static MVP Hotspots Array for Sreenidhi
const MVP_HOTSPOTS = [
    { id: 1, name: "Sreenidhi Library", position: [17.4558, 78.6668], description: "High foot traffic area. Frequent lost IDs, wallets, and Books." },
    { id: 2, name: "Campus Canteen", position: [17.4550, 78.6660], description: "Bustling area for lunch. Common place for lost bottles, umbrellas, and bags." },
    { id: 3, name: "Main Block", position: [17.4560, 78.6655], description: "Main classroom block. Electronics, laptops, and chargers usually found left behind here." }
];

export default function HotspotsMapPage() {
    const mapCenter = [17.4553, 78.6665];

    return (
        <div className="min-h-screen bg-ink pt-24 pb-16 px-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-[800] text-text mb-2">
                    Campus <span className="text-amber">Hotspots</span>
                </h1>
                <p className="text-text-muted max-w-2xl text-[14px]">
                    Discover areas on campus where items are most frequently lost or found. Check these locations first if you're missing something!
                </p>
            </div>

            <div className="bg-card border border-border rounded-[var(--radius-xl)] overflow-hidden" style={{ height: '600px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {MVP_HOTSPOTS.map((hotspot) => (
                        <Marker key={hotspot.id} position={hotspot.position} icon={redIcon}>
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[200px]">
                                    <div className="font-bold text-[15px] mb-1 flex items-center gap-1.5">
                                        <MapPin size={15} className="text-[#00c9c8]" />
                                        {hotspot.name}
                                    </div>
                                    <div className="text-[12px] text-gray-600 mb-3 border-t pt-2 leading-relaxed">
                                        {hotspot.description}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded">
                                            Hotspot Layer
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
