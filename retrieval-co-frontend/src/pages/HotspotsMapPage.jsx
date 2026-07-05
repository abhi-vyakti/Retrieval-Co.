import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapPin,
    ShieldAlert,
    Award,
    Calendar,
    CheckCircle2,
    Shield,
} from "lucide-react";
import L from "leaflet";

// Custom Marker Icons
const redIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Static MVP Hotspots Array for Sreenidhi
const MVP_HOTSPOTS = [
    {
        id: 1,
        name: "Sreenidhi Library",
        position: [17.4567, 78.6667],
        description:
            "High foot traffic area. Frequent lost IDs, wallets, and Books.",
        risk: "high",
    },
    {
        id: 2,
        name: "Campus Canteen",
        position: [17.4555, 78.6665],
        description:
            "Bustling area for lunch. Common place for lost bottles, umbrellas, and bags.",
        risk: "medium",
    },
    {
        id: 3,
        name: "Main Block",
        position: [17.4543, 78.666],
        description:
            "Main classroom block. Electronics, laptops, and chargers usually found left behind here.",
        risk: "medium",
    },
];

const RECENT_RECOVERIES = [
    {
        id: 1,
        item: "Student ID Card",
        location: "Sreenidhi Library",
        time: "2 hrs ago",
    },
    {
        id: 2,
        item: "Casio Calculator",
        location: "Main Block Lab",
        time: "5 hrs ago",
    },
    {
        id: 3,
        item: "Puma Backpack",
        location: "Campus Canteen",
        time: "1 day ago",
    },
];

const COMMON_LOCATIONS = [
    { name: "Sreenidhi Library", count: 24, status: "High Risk" },
    { name: "Campus Canteen", count: 18, status: "Medium Risk" },
    { name: "Main Block Block 3", count: 12, status: "Medium Risk" },
];

export default function HotspotsMapPage() {
    const mapCenter = [17.4553, 78.6665];

    return (
        <div className="min-h-screen bg-background pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-6">
            <div className="mb-4 border-b border-border pb-4">
                <h1 className="text-3xl font-display font-[800] text-text mb-2 tracking-tight">
                    Campus{" "}
                    <span className="text-primary">Hotspots & Analytics</span>
                </h1>
                <p className="text-text-muted max-w-2xl text-[14px]">
                    Real-time campus risk heatmap. View where items go missing
                    most on campus and track recent successful returns.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Leaflet Map (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel rounded-xl overflow-hidden shadow-sm h-[400px] lg:h-[520px]">
                        <MapContainer
                            center={mapCenter}
                            zoom={16}
                            style={{ height: "100%", width: "100%", zIndex: 1 }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {MVP_HOTSPOTS.map((hotspot) => (
                                <Marker
                                    key={hotspot.id}
                                    position={hotspot.position}
                                    icon={
                                        hotspot.risk === "high"
                                            ? redIcon
                                            : orangeIcon
                                    }
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-1 min-w-[200px]">
                                            <div className="font-bold text-[14px] mb-1 flex items-center gap-1.5 text-text">
                                                <MapPin
                                                    size={14}
                                                    className="text-primary"
                                                />
                                                {hotspot.name}
                                            </div>
                                            <div className="text-[12px] text-text-muted mb-3 border-t border-border pt-2 leading-relaxed">
                                                {hotspot.description}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                        hotspot.risk === "high"
                                                            ? "text-danger bg-danger/10 border-danger/15"
                                                            : "text-warning bg-warning/10 border-warning/15"
                                                    }`}
                                                >
                                                    {hotspot.risk === "high"
                                                        ? "High Risk"
                                                        : "Medium Risk"}{" "}
                                                    Hotspot
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Bottom Map Legend */}
                    <div className="flex overflow-x-auto whitespace-nowrap hide-scrollbar gap-4 p-4 rounded-xl bg-surface border border-border text-xs text-text-muted items-center">
                        <span className="font-bold uppercase text-[10px] tracking-wider text-text shrink-0">
                            Hotspots Legend:
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-danger inline-block"></span>
                            <span>High Loss Probability</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block"></span>
                            <span>Medium Loss Probability</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics Sidebar (1/3 width) */}
                <div className="space-y-6">
                    {/* 1. Recent Recoveries Widget */}
                    <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-success" />{" "}
                            Recent Recoveries
                        </h3>
                        <div className="flex flex-col gap-3">
                            {RECENT_RECOVERIES.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="flex flex-col p-3 rounded-lg bg-surface border border-border gap-1 animate-in fade-in duration-200"
                                >
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-text">
                                            {rec.item}
                                        </span>
                                        <span className="text-[10px] text-text-muted">
                                            {rec.time}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-text-muted flex items-center gap-1">
                                        <MapPin size={10} /> Returned near{" "}
                                        {rec.location}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Common Locations Widget */}
                    <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert size={14} className="text-warning" />{" "}
                            Common Loss Spots
                        </h3>
                        <div className="flex flex-col gap-2">
                            {COMMON_LOCATIONS.map((loc, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 rounded-lg bg-surface border border-border text-xs"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-text">
                                            {loc.name}
                                        </span>
                                        <span
                                            className={`text-[10px] font-medium ${loc.status === "High Risk" ? "text-danger" : "text-warning"}`}
                                        >
                                            {loc.status}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-text-muted">
                                        {loc.count} reports
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Campus Stats Counter Card */}
                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                                Campus Safety Rating
                            </span>
                            <span className="text-2xl font-display font-extrabold text-success">
                                9.2 / 10
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success text-lg">
                            <Shield size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
