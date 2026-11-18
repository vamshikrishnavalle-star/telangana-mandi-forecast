import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TelanganaMap.css';

// Fix for default Leaflet marker icons in React
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-mandi-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const primaryIcon = createCustomIcon('#16a34a', 'P');
const secondaryIcon = createCustomIcon('#0284c7', 'S');
const selectedIcon = createCustomIcon('#dc2626', '★');

export type MarketYard = {
  name: string;
  position: [number, number]; // [lat, lng]
  district: string;
  type: 'Primary' | 'Secondary';
  commodities: string[];
  currentPrice: number;
};

export const defaultMarketYards: MarketYard[] = [
  {
    name: 'Hyderabad RCI Market',
    position: [17.3850, 78.4867],
    district: 'Hyderabad',
    type: 'Primary',
    commodities: ['Cotton', 'Chilli', 'Maize', 'Paddy'],
    currentPrice: 5650,
  },
  {
    name: 'Warangal Gurramguda',
    position: [17.9784, 79.6023],
    district: 'Warangal',
    type: 'Primary',
    commodities: ['Chilli', 'Cotton', 'Maize'],
    currentPrice: 5450,
  },
  {
    name: 'Karimnagar BCCL Market',
    position: [18.4385, 79.1287],
    district: 'Karimnagar',
    type: 'Primary',
    commodities: ['Maize', 'Paddy', 'Cotton'],
    currentPrice: 5350,
  },
  {
    name: 'Nizamabad Gunj Market',
    position: [18.6725, 78.0941],
    district: 'Nizamabad',
    type: 'Secondary',
    commodities: ['Turmeric', 'Paddy', 'Maize'],
    currentPrice: 5250,
  },
  {
    name: 'Khammam Agricultural Market',
    position: [17.2473, 80.1514],
    district: 'Khammam',
    type: 'Secondary',
    commodities: ['Chilli', 'Cotton', 'Paddy'],
    currentPrice: 5380,
  },
  {
    name: 'Adilabad Cotton Yard',
    position: [19.6641, 78.5320],
    district: 'Adilabad',
    type: 'Secondary',
    commodities: ['Cotton', 'Soybean'],
    currentPrice: 5190,
  },
];

// Haversine straight-line distance formula in km
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

type Props = {
  selectedYard: string | null;
  showDistances: boolean;
  onSelectYard: (yard: string) => void;
  yards?: MarketYard[];
};

export const TelanganaMap: React.FC<Props> = ({
  selectedYard,
  showDistances,
  onSelectYard,
  yards = defaultMarketYards,
}) => {
  // Find selected yard object
  const currentSelected = useMemo(
    () => yards.find((y) => y.name === selectedYard) || null,
    [selectedYard, yards]
  );

  // Calculate distances from selected yard to all other yards
  const distances = useMemo(() => {
    if (!currentSelected) return [];
    return yards
      .filter((y) => y.name !== currentSelected.name)
      .map((y) => ({
        ...y,
        distanceKm: haversineDistance(
          currentSelected.position[0],
          currentSelected.position[1],
          y.position[0],
          y.position[1]
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentSelected, yards]);

  return (
    <div className="telangana-map-wrapper relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      {/* Map Header Toolbar */}
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Telangana Mandi Geospatial Map</h3>
            <p className="text-xs text-slate-400">Interactive yard locations, live prices & distance lines</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
            <span>Primary Mandi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-white"></span>
            <span>Secondary Mandi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
            <span>Selected Reference</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Leaflet Map */}
        <div className="map-view-container h-[520px] w-full">
          <MapContainer
            center={[18.1124, 79.0193]} // Geographical center of Telangana
            zoom={7}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Distance polylines from selected yard */}
            {currentSelected &&
              showDistances &&
              yards
                .filter((y) => y.name !== currentSelected.name)
                .map((y) => (
                  <Polyline
                    key={`line-${y.name}`}
                    positions={[currentSelected.position, y.position]}
                    pathOptions={{
                      color: '#ef4444',
                      weight: 2,
                      dashArray: '6, 6',
                      opacity: 0.75,
                    }}
                  />
                ))}

            {/* Market Yard Markers */}
            {yards.map((yard) => {
              const isSelected = selectedYard === yard.name;
              const icon = isSelected
                ? selectedIcon
                : yard.type === 'Primary'
                ? primaryIcon
                : secondaryIcon;

              return (
                <Marker
                  key={yard.name}
                  position={yard.position}
                  icon={icon}
                  eventHandlers={{
                    click: () => onSelectYard(yard.name),
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-1.5">
                        <span className="font-bold text-sm text-slate-900">{yard.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            yard.type === 'Primary'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {yard.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1">
                        <strong>District:</strong> {yard.district}
                      </p>
                      <p className="text-xs text-slate-600 mb-1">
                        <strong>Crops:</strong> {yard.commodities.join(', ')}
                      </p>
                      <p className="text-sm font-semibold text-emerald-700 mb-2">
                        Benchmark: ₹{yard.currentPrice.toLocaleString()}/q
                      </p>
                      <button
                        onClick={() => onSelectYard(yard.name)}
                        className="w-full text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                      >
                        {isSelected ? '✓ Selected Yard' : 'Set as Origin Mandi'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Distance Side Floating Card (Appears when yard selected) */}
        {currentSelected && (
          <div className="absolute top-4 right-4 z-[1000] w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 p-4 max-h-[460px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Distances from
                </span>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                  {currentSelected.name}
                </h4>
              </div>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {distances.length} Yards
              </span>
            </div>

            <div className="space-y-2 mt-2">
              {distances.map((item) => (
                <div
                  key={item.name}
                  onClick={() => onSelectYard(item.name)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-100 hover:border-emerald-200"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.district} • ₹{item.currentPrice.toLocaleString()}/q
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 whitespace-nowrap bg-emerald-100/70 px-2 py-1 rounded">
                    {item.distanceKm} km
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Click any yard to view distance & price difference
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelanganaMap;
