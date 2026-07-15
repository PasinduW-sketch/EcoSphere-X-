// EcoSphere X - React Application Core
// Official Production Console: Colombo Municipal Council (CMC) Smart Waste Initiative

const { useState, useEffect, useRef, useMemo } = React;

// ----------------------------------------------------
// TELEMETRY & ZONE COORDINATES
// ----------------------------------------------------
const ZONES_DATA = [
  { id: 'CMC-B001', name: 'Colombo Fort Terminal', coords: [6.9319, 79.8424], fillLevel: 85, wasteType: 'Plastic', battery: 94, lastPickup: '6 hrs ago', status: 'Active', area: 'Fort', volts: 3.65, rssi: -72, snr: 12.1 },
  { id: 'CMC-B002', name: 'Pettah Main Market', coords: [6.9358, 79.8514], fillLevel: 42, wasteType: 'Paper', battery: 89, lastPickup: '12 hrs ago', status: 'Active', area: 'Pettah', volts: 3.58, rssi: -84, snr: 8.4 },
  { id: 'CMC-B003', name: 'Maradana Central Station', coords: [6.9272, 79.8658], fillLevel: 15, wasteType: 'Glass', battery: 92, lastPickup: '24 hrs ago', status: 'Active', area: 'Maradana', volts: 3.62, rssi: -65, snr: 14.2 },
  { id: 'CMC-B004', name: 'Borella Junction Node', coords: [6.9189, 79.8789], fillLevel: 92, wasteType: 'E-Waste', battery: 78, lastPickup: '4 hrs ago', status: 'Active', area: 'Borella', volts: 3.52, rssi: -90, snr: 6.8 },
  { id: 'CMC-B005', name: 'Wellawatte Coastal Hub', coords: [6.8724, 79.8622], fillLevel: 60, wasteType: 'Metal', battery: 91, lastPickup: '8 hrs ago', status: 'Active', area: 'Wellawatte', volts: 3.60, rssi: -78, snr: 10.5 },
  { id: 'CMC-B006', name: 'Bambalapitiya Flats', coords: [6.8912, 79.8562], fillLevel: 96, wasteType: 'Food Waste', battery: 12, lastPickup: '1 hr ago', status: 'Critical', area: 'Bambalapitiya', volts: 3.20, rssi: -95, snr: 4.1 },
  { id: 'CMC-B007', name: 'Narahenpita Market Plaza', coords: [6.9022, 79.8783], fillLevel: 25, wasteType: 'Plastic', battery: 85, lastPickup: '18 hrs ago', status: 'Active', area: 'Narahenpita', volts: 3.59, rssi: -81, snr: 9.2 }
];

const DEPT_COORDS = [6.9117, 79.8646]; // Colombo Municipal Council Headquarters

// ----------------------------------------------------
// CUSTOM INLINE SVG ICON COMPONENT
// ----------------------------------------------------
const Icon = ({ name, className = "w-5 h-5", onClick }) => {
  const icons = {
    trash: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    map: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    route: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    camera: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    award: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    user: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    wifi: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    alert: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    activity: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    zap: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    calendar: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    flame: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    shield: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    arrowRight: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    ),
    leaf: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    qrcode: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-16v4m0 4h.01M4 4h16v16H4V4z" />
      </svg>
    ),
    trophy: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    info: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    refresh: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m0 2l-3 3-3-3" />
      </svg>
    ),
    bus: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4H9m7 4H8m3-9v4m-5 9a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    ),
    film: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    shop: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    terminal: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    wrench: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  return (
    <span onClick={onClick} className={`inline-flex items-center justify-center ${className}`}>
      {icons[name] || (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4 4h16v16H4V4z" />
        </svg>
      )}
    </span>
  );
};

// ----------------------------------------------------
// CHART WRAPPER (CHART.JS IN CANVAS)
// ----------------------------------------------------
const WasteChart = ({ type, data, options }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type,
        data,
        options
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options, type]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ maxHeight: '250px' }} />;
};

// ----------------------------------------------------
// LEAFLET MAP ELEMENT WRAPPER
// ----------------------------------------------------
const SmartCityMap = ({ bins, routePoints, isRouting, activeBinId, onSelectBin, truckPos }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [6.9117, 79.8646],
        zoom: 12.5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    Object.keys(markersRef.current).forEach(id => {
      markersRef.current[id].remove();
    });
    markersRef.current = {};

    // Depot icon
    const depotIcon = L.divIcon({
      className: 'depot-marker',
      html: `
        <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg relative">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div class="absolute -inset-0.5 rounded-full bg-blue-500 animate-ping opacity-25"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    markersRef.current['depot'] = L.marker(DEPT_COORDS, { icon: depotIcon })
      .bindPopup(`<div class="p-1"><h4 class="font-bold text-blue-400 text-xs">CMC Operations Command</h4><p class="text-[10px] text-slate-300">Central depot for fleet dispatch and telemetry parsing.</p></div>`)
      .addTo(mapRef.current);

    bins.forEach(bin => {
      let markerColor = 'bg-green-500 border-green-300';
      let shadowColor = 'rgba(34, 197, 94, 0.4)';
      let pulseAnim = '';

      if (bin.fillLevel >= 80) {
        markerColor = 'bg-red-500 border-red-300';
        shadowColor = 'rgba(239, 68, 68, 0.6)';
        pulseAnim = 'animate-bounce';
      } else if (bin.fillLevel >= 40) {
        markerColor = 'bg-yellow-500 border-yellow-300';
        shadowColor = 'rgba(234, 179, 8, 0.4)';
      }

      const binHtml = `
        <div class="w-6 h-6 rounded-full ${markerColor} border-2 flex items-center justify-center shadow-lg relative ${pulseAnim}" style="box-shadow: 0 0 10px ${shadowColor}">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'bin-marker',
        html: binHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(bin.coords, { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div class="p-2 w-48 font-sans">
            <div class="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
              <span class="font-bold text-xs text-white">${bin.name}</span>
              <span class="text-[9px] font-mono bg-white/10 px-1 rounded text-slate-300">${bin.id}</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div class="flex justify-between"><span class="text-slate-400">Level:</span><span class="font-bold ${bin.fillLevel >= 80 ? 'text-red-400' : bin.fillLevel >= 40 ? 'text-yellow-400' : 'text-green-400'}">${bin.fillLevel}%</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Type:</span><span class="font-medium text-white">${bin.wasteType}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Battery:</span><span class="font-medium text-slate-200">${bin.battery}%</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Last Pickup:</span><span class="text-slate-300">${bin.lastPickup}</span></div>
              <div class="flex justify-between border-t border-white/5 pt-1 mt-1"><span class="text-slate-400">Node Status:</span><span class="text-green-400 font-bold">Online</span></div>
            </div>
            <button class="w-full mt-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium py-1 rounded text-[10px] transition" onclick="window.selectBin('${bin.id}')">
              Open Telemetry
            </button>
          </div>
        `);

      markersRef.current[bin.id] = marker;
    });

    window.selectBin = (id) => {
      onSelectBin(id);
    };

  }, [bins, onSelectBin]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (isRouting && routePoints && routePoints.length > 0) {
      polylineRef.current = L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '8, 6',
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
    }
  }, [isRouting, routePoints]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (truckMarkerRef.current) {
      truckMarkerRef.current.remove();
      truckMarkerRef.current = null;
    }

    if (isRouting && truckPos) {
      const truckIcon = L.divIcon({
        className: 'truck-marker',
        html: `
          <div class="w-8 h-8 rounded-full bg-blue-500 border border-blue-200 flex items-center justify-center shadow-lg relative glow-blue animate-pulse">
            <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      truckMarkerRef.current = L.marker(truckPos, { icon: truckIcon })
        .bindPopup(`<div class="p-1 font-sans"><h4 class="font-bold text-xs">CMC Collector Unit 09</h4><p class="text-[9px] text-slate-300">Executing automated route dispatch.</p></div>`)
        .addTo(mapRef.current);
    }
  }, [isRouting, truckPos]);

  useEffect(() => {
    if (activeBinId && mapRef.current) {
      const targetBin = bins.find(b => b.id === activeBinId);
      if (targetBin) {
        mapRef.current.setView(targetBin.coords, 14);
        if (markersRef.current[targetBin.id]) {
          markersRef.current[targetBin.id].openPopup();
        }
      }
    }
  }, [activeBinId, bins]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

// ----------------------------------------------------
// ROOT REACT APP COMPONENT
// ----------------------------------------------------
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bins, setBins] = useState(ZONES_DATA);
  const [activeBinId, setActiveBinId] = useState('CMC-B001');
  const [selectedLoraNode, setSelectedLoraNode] = useState('B1');
  
  // Route Simulation Settings
  const [isRouting, setIsRouting] = useState(false);
  const [truckPos, setTruckPos] = useState(DEPT_COORDS);
  const [routePointIdx, setRoutePointIdx] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);

  // Operations Control Panels
  const [showConfig, setShowConfig] = useState(false);
  
  // Real-Time Notification Stream
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', msg: 'System Alarm: High Thermal threshold on Bambalapitiya Flats (CMC-B006)', time: '09:42 AM', area: 'Bambalapitiya', status: 'Active' },
    { id: 2, type: 'warning', msg: 'Battery level low (<15%) on Pettah Main Market (CMC-B002)', time: '10:15 AM', area: 'Pettah', status: 'Active' },
    { id: 3, type: 'info', msg: 'Telemetry Uplink: Fort Terminal (CMC-B001) registered Capacity Alert (85%)', time: '10:30 AM', area: 'Fort', status: 'Active' }
  ]);
  const [toast, setToast] = useState(null);

  // Decoded LoRa Terminal Stream
  const [loraPackets, setLoraPackets] = useState([
    { time: '11:10:02', node: 'B1', raw: '4A0F8E32', desc: 'Uplink: Fill=85%, Temp=28C, Bat=3.65V' },
    { time: '11:10:05', node: 'B3', raw: '12AE8810', desc: 'Uplink: Fill=15%, Temp=29C, Bat=3.62V' },
    { time: '11:10:11', node: 'B5', raw: '8C04F090', desc: 'Uplink: Fill=60%, Temp=31C, Bat=3.60V' }
  ]);

  // Citizen Portal
  const [citizenPoints, setCitizenPoints] = useState(420);
  const [citizenRank, setCitizenRank] = useState(12);
  const [scannedBinId, setScannedBinId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [overflowReportBin, setOverflowReportBin] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // AI Camera Telemetry
  const [cameraActive, setCameraActive] = useState(true);
  const [selectedCam, setSelectedCam] = useState('CMC-CAM01');

  // Trigger notifications
  const triggerNotification = (type, msg, area) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = Date.now();
    const newAlert = { id: newId, type, msg, time, area, status: 'Active' };
    
    setNotifications(prev => [newAlert, ...prev]);
    setToast(newAlert);
    
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Add fake LoRa terminal output periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'][Math.floor(Math.random() * 7)];
      const matchingBin = bins.find(b => b.id.endsWith(randomNode.replace('B', '00')));
      const fill = matchingBin ? matchingBin.fillLevel : Math.floor(Math.random() * 90);
      const temp = Math.floor(Math.random() * 5) + 27;
      const bat = (Math.random() * 0.5 + 3.2).toFixed(2);
      const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
      
      const newPacket = {
        time: new Date().toLocaleTimeString([], { hour12: false }),
        node: randomNode,
        raw: hex.padStart(8, '0'),
        desc: `Uplink: Fill=${fill}%, Temp=${temp}C, Bat=${bat}V`
      };
      
      setLoraPackets(prev => [newPacket, ...prev.slice(0, 14)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [bins]);

  // Periodic level shifts
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prev => prev.map(bin => {
        if (Math.random() > 0.7) {
          const newLevel = Math.min(100, bin.fillLevel + Math.floor(Math.random() * 6) + 1);
          
          if (newLevel >= 85 && bin.fillLevel < 85) {
            triggerNotification('warning', `Smart Telemetry: ${bin.name} (${bin.id}) capacity exceeded safety threshold (${newLevel}%)`, bin.area);
          }
          
          return { ...bin, fillLevel: newLevel };
        }
        return bin;
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // AI Route planning
  const fullBins = useMemo(() => {
    return bins.filter(b => b.fillLevel >= 80);
  }, [bins]);

  const routeCoordinates = useMemo(() => {
    const coords = [DEPT_COORDS];
    fullBins.forEach(b => coords.push(b.coords));
    coords.push(DEPT_COORDS);
    return coords;
  }, [fullBins]);

  const routeTimelineList = useMemo(() => {
    const list = [{ name: 'CMC Operational Command HQ (Depot)', id: 'HQ', level: null, active: false }];
    fullBins.forEach(b => {
      list.push({ name: b.name, id: b.id, level: b.fillLevel, active: false });
    });
    list.push({ name: 'CMC Operational Command HQ (Depot)', id: 'HQ-End', level: null, active: false });
    return list;
  }, [fullBins]);

  const routeStats = useMemo(() => {
    const count = fullBins.length;
    if (count === 0) return { time: '0 mins', distance: '0.0 km', fuel: '0.0 L' };
    
    const distance = (count * 2.6 + 3.4).toFixed(1);
    const time = Math.round(count * 9 + 14);
    const fuel = (distance * 0.11).toFixed(1);
    return { time: `${time} mins`, distance: `${distance} km`, fuel: `${fuel} L` };
  }, [fullBins]);

  // Truck path progression
  useEffect(() => {
    let animFrame;
    if (isRouting && routeCoordinates.length > 1) {
      const step = () => {
        setRouteProgress(prev => {
          const next = prev + 0.004;
          if (next >= 1) {
            setRoutePointIdx(currIdx => {
              const nextIdx = currIdx + 1;
              if (nextIdx >= routeCoordinates.length - 1) {
                setIsRouting(false);
                triggerNotification('success', 'Route clearance execution complete. Visited smart units emptied.', 'HQ Operations');
                
                // Empty the visited bins
                setBins(currBins => currBins.map(bin => {
                  if (bin.fillLevel >= 80) {
                    return { ...bin, fillLevel: 5, lastPickup: 'Just now (CMC Team)', status: 'Active', battery: Math.max(15, bin.battery - 1) };
                  }
                  return bin;
                }));
                setTruckPos(DEPT_COORDS);
                return 0;
              }
              return nextIdx;
            });
            return 0;
          }
          return next;
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isRouting, routeCoordinates]);

  // Calculate moving coordinate
  useEffect(() => {
    if (isRouting && routeCoordinates.length > 1) {
      const start = routeCoordinates[routePointIdx];
      const end = routeCoordinates[routePointIdx + 1];
      if (start && end) {
        const lat = start[0] + (end[0] - start[0]) * routeProgress;
        const lng = start[1] + (end[1] - start[1]) * routeProgress;
        setTruckPos([lat, lng]);
      }
    }
  }, [isRouting, routeCoordinates, routePointIdx, routeProgress]);

  const startRouteDispatch = () => {
    if (fullBins.length === 0) {
      triggerNotification('info', 'Routing Engine: All nodes below threshold capacity limits.', 'HQ Operations');
      return;
    }
    setRoutePointIdx(0);
    setRouteProgress(0);
    setTruckPos(DEPT_COORDS);
    setIsRouting(true);
    triggerNotification('success', `Dispatching Collector Unit 09 for optimized route covering ${fullBins.length} clusters.`, 'HQ Operations');
  };

  const activeBin = useMemo(() => {
    return bins.find(b => b.id === activeBinId) || bins[0];
  }, [bins, activeBinId]);

  // Selected LoRa Node Telemetry
  const activeLoraNodeDetail = useMemo(() => {
    const num = selectedLoraNode.replace('B', '00');
    return bins.find(b => b.id.endsWith(num)) || bins[0];
  }, [bins, selectedLoraNode]);

  // Conveyor scan simulation
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !cameraActive) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animId;
    const items = [
      { id: 1, type: 'PET Bottle', color: 'rgba(59, 130, 246, 0.45)', strokeColor: '#3b82f6', text: 'Plastic', conf: 98, x: -60, y: 120, width: 70, height: 40, speed: 2.1 },
      { id: 2, type: 'Cardboard Box', color: 'rgba(234, 179, 8, 0.4)', strokeColor: '#eab308', text: 'Paper', conf: 95, x: -220, y: 80, width: 85, height: 60, speed: 2.1 },
      { id: 3, type: 'Beverage Glass', color: 'rgba(34, 197, 94, 0.4)', strokeColor: '#22c55e', text: 'Glass', conf: 93, x: -360, y: 150, width: 60, height: 50, speed: 2.1 },
      { id: 4, type: 'Tin Soda Can', color: 'rgba(168, 85, 247, 0.45)', strokeColor: '#a855f7', text: 'Metal', conf: 97, x: -500, y: 90, width: 50, height: 50, speed: 2.1 },
      { id: 5, type: 'Processor Board', color: 'rgba(239, 68, 68, 0.45)', strokeColor: '#ef4444', text: 'E-Waste', conf: 91, x: -640, y: 140, width: 80, height: 55, speed: 2.1 }
    ];

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Belt lane
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fillRect(0, 60, canvas.width, 160);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, 60); ctx.lineTo(canvas.width, 60);
      ctx.moveTo(0, 220); ctx.lineTo(canvas.width, 220);
      ctx.stroke();

      // Laser sweep line
      const laserX = (Math.sin(Date.now() / 900) * 0.5 + 0.5) * canvas.width;
      const laserGrd = ctx.createLinearGradient(laserX - 30, 0, laserX + 30, 0);
      laserGrd.addColorStop(0, 'rgba(59, 130, 246, 0)');
      laserGrd.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
      laserGrd.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = laserGrd;
      ctx.fillRect(laserX - 30, 0, 60, canvas.height);

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(laserX, 0); ctx.lineTo(laserX, canvas.height); ctx.stroke();

      items.forEach(item => {
        item.x += item.speed;
        if (item.x > canvas.width + 50) {
          item.x = -150;
          item.y = 70 + Math.random() * 80;
          item.conf = Math.floor(Math.random() * 10) + 90;
        }

        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
        
        ctx.strokeStyle = item.strokeColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x, item.y, item.width, item.height);

        // Corner styling
        const tick = 8;
        ctx.beginPath();
        ctx.moveTo(item.x - 2, item.y + tick); ctx.lineTo(item.x - 2, item.y - 2); ctx.lineTo(item.x + tick, item.y - 2);
        ctx.moveTo(item.x + item.width + 2 - tick, item.y - 2); ctx.lineTo(item.x + item.width + 2, item.y - 2); ctx.lineTo(item.x + item.width + 2, item.y + tick);
        ctx.moveTo(item.x - 2, item.y + item.height - tick); ctx.lineTo(item.x - 2, item.y + item.height + 2); ctx.lineTo(item.x + tick, item.y + item.height + 2);
        ctx.moveTo(item.x + item.width + 2 - tick, item.y + item.height + 2); ctx.lineTo(item.x + item.width + 2, item.y + item.height + 2); ctx.lineTo(item.x + item.width + 2, item.y + item.height - tick);
        ctx.stroke();

        ctx.fillStyle = item.strokeColor;
        ctx.fillRect(item.x - 1, item.y - 20, item.width + 2, 20);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`${item.text} [${item.conf}%]`, item.x + 4, item.y - 6);
      });

      // HUD text
      ctx.fillStyle = 'rgba(34, 197, 94, 0.95)';
      ctx.font = '10px Outfit, sans-serif';
      ctx.fillText(`● CMC-VISION LIVE STREAM`, 20, 30);
      
      const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(timeStr, canvas.width - 150, 30);

      animId = requestAnimationFrame(drawFrame);
    };

    drawFrame();
    return () => cancelAnimationFrame(animId);
  }, [cameraActive, selectedCam]);

  // Citizen Redeem Voucher
  const handleRedeem = (rewardId, pointsRequired, title) => {
    if (citizenPoints < pointsRequired) {
      triggerNotification('error', `Redemption Failure: Insufficient balance for ${title}`, 'Citizen Portal');
      return;
    }
    setCitizenPoints(prev => prev - pointsRequired);
    setRedemptions(prev => [{ id: Date.now(), title, points: pointsRequired, date: 'Today' }, ...prev]);
    triggerNotification('success', `Voucher unlocked: ${title}. Claim coupon registered.`, 'Citizen Portal');
  };

  // QR deposit
  const handleQRDeposit = (e) => {
    e.preventDefault();
    if (!scannedBinId) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setCitizenPoints(prev => prev + 50);
      
      setBins(prev => prev.map(bin => {
        if (bin.id === scannedBinId) {
          return { ...bin, fillLevel: 5, lastPickup: 'Just now (Citizen drop)', battery: Math.max(20, bin.battery - 1) };
        }
        return bin;
      }));
      triggerNotification('success', `Valid deposit logged at ${scannedBinId}. +50 Citizen points awarded.`, 'Citizen Portal');
      setScannedBinId('');
    }, 1500);
  };

  // Drag and Drop simulation for overflow report
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedImage(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleOverflowSubmit = (e) => {
    e.preventDefault();
    if (!overflowReportBin) return;
    
    const target = bins.find(b => b.id === overflowReportBin);
    setBins(curr => curr.map(b => b.id === overflowReportBin ? { ...b, fillLevel: 100, status: 'Critical' } : b));
    triggerNotification('critical', `Citizen incident ticket: Verified overflow reported at ${target.name} (${overflowReportBin})`, target.area);
    
    // reset form
    setOverflowReportBin('');
    setUploadedImage(null);
  };

  // Dispatch response team to alert
  const dispatchResponseTeam = (alertId, area) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === alertId) {
        return { ...n, msg: `${n.msg.split(' (')[0]} (Response Team Dispatch Logged)`, status: 'Responding' };
      }
      return n;
    }));
    triggerNotification('success', `Fleet response dispatch authorized for zone: ${area}.`, 'HQ Operations');
  };

  // Resolve alert
  const resolveAlert = (alertId, area) => {
    setNotifications(prev => prev.filter(n => n.id !== alertId));
    
    // Also empty matching bin in that area if it was full
    setBins(currBins => currBins.map(bin => {
      if (bin.area === area && bin.fillLevel >= 85) {
        return { ...bin, fillLevel: 5, lastPickup: 'Just now (Field response)', status: 'Active' };
      }
      return bin;
    }));
    triggerNotification('success', `Alert resolved. System telemetry reset for zone: ${area}.`, 'HQ Operations');
  };

  // Inject simulation alarms
  const injectDiagnosticAlarm = (type) => {
    switch (type) {
      case 'fire':
        triggerNotification('critical', 'Emergency Sensor Alarm: High Thermal threshold on Bambalapitiya Flats (CMC-B006)', 'Bambalapitiya');
        setBins(prev => prev.map(b => b.id === 'CMC-B006' ? { ...b, status: 'Emergency' } : b));
        break;
      case 'lora':
        triggerNotification('critical', 'Gateway Error: Signal loss registered on Pettah Main Market (CMC-B002)', 'Pettah');
        break;
      case 'battery':
        triggerNotification('warning', 'Battery threshold alert: Wellawatte Coastal Hub (CMC-B005) drops to 8%', 'Wellawatte');
        setBins(prev => prev.map(b => b.id === 'CMC-B005' ? { ...b, battery: 8 } : b));
        break;
      case 'sensor':
        triggerNotification('error', 'Diagnostic Warning: Proximity sensor unresponsive on Narahenpita Market (CMC-B007)', 'Narahenpita');
        setBins(prev => prev.map(b => b.id === 'CMC-B007' ? { ...b, status: 'Hardware Issue' } : b));
        break;
    }
  };

  // ----------------------------------------------------
  // ANALTICS CHART DATA
  // ----------------------------------------------------
  const chartDataWeekly = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Recycled Waste (kg)',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        data: [420, 480, 510, 490, 610, 720, 680],
      },
      {
        label: 'Total Collected (kg)',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        data: [610, 650, 700, 670, 790, 890, 850],
      }
    ]
  };

  const chartDataMaterial = {
    labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Food', 'E-Waste'],
    datasets: [{
      data: [35, 20, 15, 10, 12, 8],
      backgroundColor: [
        'rgba(59, 130, 246, 0.65)',
        'rgba(234, 179, 8, 0.65)',
        'rgba(34, 197, 94, 0.65)',
        'rgba(168, 85, 247, 0.65)',
        'rgba(249, 115, 22, 0.65)',
        'rgba(239, 68, 68, 0.65)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Outfit' } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  const chartOptionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { family: 'Outfit' } }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* ----------------------------------------------------
          INCIDENT DISPATCH BANNER / TOAST
          ---------------------------------------------------- */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] glass-card px-5 py-4 rounded-2xl border border-red-500/30 shadow-2xl flex gap-3.5 items-start max-w-sm animate-pulse glow-red">
          <Icon name="alert" className="w-6 h-6 text-red-500 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500">Live Warning Alert</span>
              <span className="text-[9px] text-slate-400 font-mono">{toast.time}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">{toast.msg}</p>
            <div className="mt-2 text-[10px] text-slate-400">
              Region: <span className="font-semibold text-slate-200">{toast.area}</span>
            </div>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition text-sm">
            &times;
          </button>
        </div>
      )}

      {/* ----------------------------------------------------
          PREMIUM glass HEADER / STICKY NAV
          ---------------------------------------------------- */}
      <header className="sticky top-0 z-[50] glass-panel border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-green-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-extrabold text-xl tracking-tight">E</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-wide text-white">EcoSphere <span className="text-blue-500 font-extrabold">X</span></h1>
            <p className="text-[9px] font-semibold text-green-500 tracking-widest uppercase mt-0.5">Colombo AI Pilot</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-1.5">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: 'activity' },
            { id: 'map', label: 'AI Route & Mapping', icon: 'map' },
            { id: 'ai-camera', label: 'Sorting Vision feed', icon: 'camera' },
            { id: 'citizen', label: 'Citizen Portal', icon: 'user' },
            { id: 'about', label: 'Infrastructure & Tech', icon: 'info' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 shadow-lg shadow-blue-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">WAN Connection</span>
            <span className="text-xs text-green-400 font-bold flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              LoRa Gateway Uplink
            </span>
          </div>
          
          <button 
            onClick={() => setActiveTab('citizen')}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 transform active:scale-95"
          >
            Citizen Sign In
          </button>
        </div>
      </header>

      {/* Mobile nav bar */}
      <div className="lg:hidden sticky top-[72px] z-[40] glass-panel border-b border-white/5 flex overflow-x-auto py-2.5 px-4 gap-2">
        {[
          { id: 'dashboard', label: 'Overview', icon: 'activity' },
          { id: 'map', label: 'Map & Route', icon: 'map' },
          { id: 'ai-camera', label: 'AI Vision', icon: 'camera' },
          { id: 'citizen', label: 'Citizen Portal', icon: 'user' },
          { id: 'about', label: 'Infrastructure', icon: 'info' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name={tab.icon} className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* ----------------------------------------------------
            HERO / HEADLINE SECTION
            ---------------------------------------------------- */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 glass-card bg-slate-950/60 p-8 lg:p-12 mb-8 shadow-2xl animate-fadeIn">
          
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <img src="colombo_hero.png" className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-lighten" alt="Colombo Digital Twin Network" />
            <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-slate-950/80 to-transparent"></div>
            <svg className="absolute inset-0 w-full h-full text-blue-500 opacity-25" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M 45 0 L 0 0 0 45" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-green-400 bg-green-950/40 border border-green-500/30 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                  Active Pilot
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-blue-400 bg-blue-950/40 border border-blue-500/30 uppercase">
                  Colombo Municipal Council
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-400 bg-white/5">
                  Node Protocol: CMC-LORA-X26
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  EcoSphere <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">X</span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-300 font-semibold tracking-wide leading-relaxed">
                  Smart Waste Telemetry & Route Optimization System
                </p>
                <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                  Smarter Recycling. Cleaner Colombo. Greener Future. Orchestrating municipal solid waste collection, live sensor feedback, and algorithmic truck dispatches for the Colombo Municipal Council.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition duration-300 transform active:scale-95 flex items-center gap-2"
                >
                  <Icon name="route" className="w-4 h-4" />
                  View Route Controller
                </button>
                <button
                  onClick={() => setActiveTab('citizen')}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition duration-300 transform active:scale-95 flex items-center gap-2"
                >
                  <Icon name="user" className="w-4 h-4" />
                  Citizen Portal Access
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { title: 'Colombo Smart Bins', val: '150 Nodes', trend: '145 Telemetry Links Active', icon: 'zap', color: 'text-green-400 bg-green-500/10' },
                { title: 'CO₂ Saved (YTD)', val: '210 kg', trend: '+15.4kg Today', icon: 'leaf', color: 'text-blue-400 bg-blue-500/10' },
                { title: 'Recycled Rate Mix', val: '72%', trend: 'Operational Max Capacity', icon: 'refresh', color: 'text-yellow-400 bg-yellow-500/10' },
                { title: 'Pickups Logged', val: '67 Today', trend: 'CMC Target achieved', icon: 'calendar', color: 'text-purple-400 bg-purple-500/10' }
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-none">{stat.title}</span>
                    <span className={`p-1.5 rounded-lg ${stat.color}`}>
                      <Icon name={stat.icon} className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{stat.val}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{stat.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            TAB PANEL RENDERING
            ---------------------------------------------------- */}
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Telemetry Status Card */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-400">Node Sensor Telemetry</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {activeBin.id}</p>
                    </div>
                    <select 
                      value={activeBinId} 
                      onChange={(e) => setActiveBinId(e.target.value)}
                      className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg p-1.5 focus:outline-none focus:border-blue-500 font-sans"
                    >
                      {bins.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Current Volume Load:</span>
                      <span className={`text-sm font-bold ${activeBin.fillLevel >= 80 ? 'text-red-400' : activeBin.fillLevel >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {activeBin.fillLevel}%
                      </span>
                    </div>
                    {/* Fill Level Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeBin.fillLevel >= 80 ? 'bg-red-500' : activeBin.fillLevel >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${activeBin.fillLevel}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Material Stream</span>
                        <p className="text-xs font-bold text-white mt-0.5">{activeBin.wasteType}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">WAN Telemetry</span>
                        <p className="text-xs font-bold text-green-400 mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Uplink Stable
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Node Voltage</span>
                        <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                          <Icon name="zap" className={`w-3.5 h-3.5 ${activeBin.battery < 20 ? 'text-red-400 animate-pulse' : 'text-yellow-500'}`} />
                          {activeBin.battery}% ({activeBin.volts}V)
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Last Collection</span>
                        <p className="text-xs font-bold text-white mt-0.5">{activeBin.lastPickup}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-xs py-2.5 rounded-xl transition font-semibold"
                  >
                    Open Map Coordinates
                  </button>
                </div>
              </div>

              {/* Weekly Trends Chart */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-white">Colombo Pilot Waste Analytics</h3>
                      <p className="text-[10px] text-slate-400">Weekly collected vs recycled material tracking</p>
                    </div>
                    <span className="text-[10px] font-bold text-green-500 bg-green-950/40 px-2.5 py-1 rounded border border-green-500/20">
                      +12% Recycling efficiency (MoM)
                    </span>
                  </div>
                  <div className="h-56 relative">
                    <WasteChart type="line" data={chartDataWeekly} options={chartOptions} />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Materials Distribution & Live Notifications Panel */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Doughnut Chart: Materials Recycled */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white mb-1">Recycled Material Mix</h3>
                  <p className="text-[10px] text-slate-400 mb-4">Monthly distribution statistics by category</p>
                  <div className="h-52 relative flex items-center justify-center">
                    <WasteChart type="doughnut" data={chartDataMaterial} options={chartOptionsDoughnut} />
                  </div>
                </div>
              </div>

              {/* Live Alerts Notification Panel */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                    <div>
                      <h3 className="font-bold text-sm text-white">System Incidents & Alerts Console</h3>
                      <p className="text-[10px] text-slate-400">Real-time hardware & environmental safety logs</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[9px] font-bold bg-red-950/40 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                        {notifications.filter(n => n.type === 'critical' && n.status === 'Active').length} Active
                      </span>
                      <span className="text-[9px] font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                        Total Logs {notifications.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl border flex gap-3 items-center justify-between text-xs transition duration-300 ${
                          n.type === 'critical' 
                            ? 'bg-red-950/20 border-red-900/40 text-red-200' 
                            : n.type === 'warning' 
                              ? 'bg-yellow-950/20 border-yellow-900/40 text-yellow-200' 
                              : 'bg-white/5 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${
                            n.status === 'Responding' 
                              ? 'bg-blue-500 animate-ping'
                              : n.type === 'critical' ? 'bg-red-500 animate-ping' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></span>
                          <div>
                            <p className="font-semibold">{n.msg}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                              Zone: <span className="font-bold text-slate-300">{n.area}</span> | Logged: {n.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 whitespace-nowrap">
                          {n.status === 'Active' ? (
                            <>
                              <button 
                                onClick={() => dispatchResponseTeam(n.id, n.area)} 
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[8px] font-bold uppercase transition"
                              >
                                Dispatch Fleet
                              </button>
                              <button 
                                onClick={() => resolveAlert(n.id, n.area)} 
                                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[8px] font-bold uppercase transition"
                              >
                                Resolve
                              </button>
                            </>
                          ) : n.status === 'Responding' ? (
                            <div className="flex gap-1.5 items-center">
                              <span className="px-2 py-1 bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-[8px] font-bold uppercase">
                                En-Route
                              </span>
                              <button 
                                onClick={() => resolveAlert(n.id, n.area)} 
                                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[8px] font-bold uppercase transition"
                              >
                                Resolve
                              </button>
                            </div>
                          ) : (
                            <span className="px-2 py-1 bg-green-950/40 text-green-400 border border-green-500/20 rounded text-[8px] font-bold uppercase">
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations Testing Desk (Skin of Dev controls) */}
                <div className="mt-4 border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                  <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-slate-400 hover:text-slate-200 transition font-bold flex items-center gap-1.5"
                  >
                    <Icon name="wrench" className="w-3.5 h-3.5" />
                    {showConfig ? 'Hide Override Console' : 'Show Telemetry Override Panel'}
                  </button>
                  
                  {showConfig && (
                    <div className="flex gap-1.5">
                      <button onClick={() => injectDiagnosticAlarm('fire')} className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded text-[8px] font-bold uppercase transition">
                        Fire Alarm
                      </button>
                      <button onClick={() => injectDiagnosticAlarm('lora')} className="px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/20 rounded text-[8px] font-bold uppercase transition">
                        LoRa Out
                      </button>
                      <button onClick={() => injectDiagnosticAlarm('battery')} className="px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/20 rounded text-[8px] font-bold uppercase transition">
                        Low Volt
                      </button>
                      <button onClick={() => injectDiagnosticAlarm('sensor')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 rounded text-[8px] font-bold uppercase transition">
                        Sensor Err
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LIVE MAP AND AI ROUTING PLANNER */}
        {activeTab === 'map' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Map Routing Engine Panels */}
              <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
                
                {/* AI Dispatch Details */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
                  <div>
                    <h3 className="font-bold text-sm text-white">CMC Algorithmic Router</h3>
                    <p className="text-[10px] text-slate-400">Heuristics pathing engine for Colombo cleanups</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Nodes Logged</span>
                      <p className="text-lg font-extrabold text-white">{fullBins.length} <span className="text-xs text-slate-400 font-normal">Bins (Capacity &ge;80%)</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Est. Duration</span>
                        <p className="font-bold text-white text-xs mt-0.5">{routeStats.time}</p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Total Distance</span>
                        <p className="font-bold text-white text-xs mt-0.5">{routeStats.distance}</p>
                      </div>
                    </div>

                    <div className="bg-green-950/20 p-3 rounded-xl border border-green-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-green-400 uppercase block">Est. Carbon Saved</span>
                        <p className="text-sm font-extrabold text-green-400 mt-0.5">{routeStats.fuel}</p>
                      </div>
                      <Icon name="leaf" className="w-5 h-5 text-green-400" />
                    </div>
                  </div>

                  <button
                    onClick={startRouteDispatch}
                    disabled={isRouting}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 ${
                      isRouting 
                        ? 'bg-slate-800 text-slate-400 border border-white/5 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                    }`}
                  >
                    {isRouting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        Collector Dispatching...
                      </>
                    ) : (
                      <>
                        <Icon name="route" className="w-4 h-4" />
                        Execute Dispatch Schedule
                      </>
                    )}
                  </button>
                </div>

                {/* Driver Vehicle Stats */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 text-[11px] space-y-3.5">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] pb-1 border-b border-white/5">Active Collector Unit</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <span className="font-bold text-slate-200">CMC-TRK-09 (Medium Capacity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dispatch Officer:</span>
                      <span className="font-bold text-slate-200">K. Wickramasinghe</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Truck Load Capacity:</span>
                      <span className="font-semibold text-slate-200">3.2 / 5.0 Tons</span>
                    </div>
                    
                    {/* Capacity meter */}
                    <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                      <div className="h-full bg-blue-500 rounded" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Map & Step-by-Step Route Timeline */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  
                  {/* Map Element */}
                  <div className="lg:col-span-3">
                    <SmartCityMap 
                      bins={bins}
                      routePoints={routeCoordinates}
                      isRouting={isRouting}
                      activeBinId={activeBinId}
                      onSelectBin={setActiveBinId}
                      truckPos={truckPos}
                    />
                  </div>

                  {/* Step-by-Step Dispatch Timeline */}
                  <div className="lg:col-span-1 glass-card p-5 rounded-2xl border border-white/10 flex flex-col">
                    <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4 pb-1.5 border-b border-white/5">
                      Optimization Path
                    </h4>
                    
                    {routeTimelineList.length <= 2 ? (
                      <div className="flex-1 flex items-center justify-center text-center text-slate-500 border border-dashed border-white/5 rounded-xl p-3">
                        Routing engine idle. Select 'Execute Dispatch Schedule' to calculate.
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1 flex-1 relative">
                        {routeTimelineList.map((step, idx) => {
                          const isCurrent = isRouting && routePointIdx === idx;
                          const isVisited = isRouting && routePointIdx > idx;
                          
                          return (
                            <div key={idx} className="flex gap-3 text-[11px] relative items-start">
                              {/* vertical line connector */}
                              {idx < routeTimelineList.length - 1 && (
                                <div className={`absolute left-2.5 top-5 w-0.5 bottom-0 ${
                                  isVisited ? 'bg-blue-600' : 'bg-slate-800'
                                }`}></div>
                              )}
                              
                              <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] z-10 transition-all ${
                                isCurrent 
                                  ? 'bg-blue-600 border-white text-white animate-pulse' 
                                  : isVisited 
                                    ? 'bg-blue-900 border-blue-600 text-blue-200' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500'
                              }`}>
                                {idx}
                              </div>
                              
                              <div className="flex-1 pb-1">
                                <p className={`font-semibold ${isCurrent ? 'text-blue-400' : 'text-slate-300'}`}>{step.name}</p>
                                {step.level !== null && (
                                  <span className="text-[9px] font-mono text-red-400 font-bold block mt-0.5">Capacity Load: {step.level}%</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: AI WASTE DETECTION FEED */}
        {activeTab === 'ai-camera' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Camera Selection & Settings */}
              <div className="lg:col-span-1 space-y-5">
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
                  <div>
                    <h3 className="font-bold text-sm text-white">AI Vision Stream</h3>
                    <p className="text-[10px] text-slate-400">Edge-based classification cameras</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Sorting Feeds</label>
                    {[
                      { id: 'CMC-CAM01', name: 'Fort Sorting Station', active: true },
                      { id: 'CMC-CAM02', name: 'Borella Sorting Unit', active: false },
                      { id: 'CMC-CAM03', name: 'Bambalapitiya Flats Chute', active: false }
                    ].map(cam => (
                      <button
                        key={cam.id}
                        onClick={() => setSelectedCam(cam.id)}
                        className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition ${
                          selectedCam === cam.id
                            ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{cam.name}</p>
                          <span className="text-[9px] font-mono text-slate-500">{cam.id}</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Feed Connectivity</span>
                      <button 
                        onClick={() => setCameraActive(!cameraActive)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${
                          cameraActive ? 'bg-green-600/20 text-green-400 border border-green-500/20' : 'bg-red-600/20 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {cameraActive ? 'Streaming' : 'Paused'}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between"><span>Model Inference:</span><span className="font-mono text-slate-200">CMC-YOLOv8-Waste-Pro</span></div>
                      <div className="flex justify-between"><span>Edge Latency:</span><span className="font-mono text-slate-200">12ms</span></div>
                      <div className="flex justify-between"><span>Frame Rate:</span><span className="font-mono text-slate-200">29.8 FPS</span></div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 text-xs space-y-2.5">
                  <h4 className="font-bold text-slate-300">Model Targets Identified:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-bold">Plastic</span>
                    <span className="px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-400 border border-yellow-500/20 text-[9px] font-bold">Paper</span>
                    <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-400 border border-green-500/20 text-[9px] font-bold">Glass</span>
                    <span className="px-2 py-0.5 rounded bg-purple-600/20 text-purple-400 border border-purple-500/20 text-[9px] font-bold">Metal</span>
                    <span className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/20 text-[9px] font-bold">Food Waste</span>
                    <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/20 text-[9px] font-bold">E-Waste</span>
                  </div>
                </div>
              </div>

              {/* Video stream canvas container */}
              <div className="lg:col-span-3 space-y-6">
                <div className="relative glass-card p-2 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {cameraActive ? (
                    <canvas 
                      ref={canvasRef} 
                      width={640} 
                      height={320} 
                      className="w-full bg-slate-950 rounded-xl block shadow-inner"
                    />
                  ) : (
                    <div className="w-full h-[320px] bg-slate-950 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5">
                      <Icon name="camera" className="w-10 h-10 text-slate-600" />
                      <p className="text-slate-400 text-xs font-semibold">Feed suspended. Toggle connection to initialize stream.</p>
                    </div>
                  )}
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 text-xs">
                  <h4 className="font-bold text-white mb-2">Edge Classification Strategy</h4>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    EcoSphere X edge cameras process stream logs dynamically, cataloging deposit streams. This data is combined with bin capacity rates to enable the CMC to optimize downstream sorting schedules, reduce recycling impurities, and log illegal organic-waste mixtures.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CITIZEN PORTAL */}
        {activeTab === 'citizen' && (
          <div className="space-y-8 animate-fadeIn">
            {!isLoggedIn ? (
              <div className="max-w-md mx-auto glass-card p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
                    <Icon name="user" className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">CMC Citizen Portal</h3>
                  <p className="text-xs text-slate-400">Log drops, track green scores, and redeem voucher certificates.</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!username.trim()) return;
                    setIsLoggedIn(true);
                    triggerNotification('success', `Welcome back, ${username}! Let's build a greener Colombo.`, 'Citizen Portal');
                  }} 
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Citizen Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your name (e.g. Priyantha)" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full glass-input p-3 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Municipal Ward</label>
                    <input 
                      type="text" 
                      placeholder="Colombo 03 (Colpetty)" 
                      className="w-full glass-input p-3 rounded-xl text-xs"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
                  >
                    Enter Citizen Portal
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Score Profile & Live QR Code Scanner Simulator */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Citizen Profile Stats */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center justify-center">
                        <Icon name="user" className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{username}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold tracking-wider">Citizen ID: CMC-U8105</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Green Score</span>
                        <p className="text-xl font-extrabold text-green-400 mt-1">{citizenPoints} pts</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Leaderboard</span>
                        <p className="text-xl font-extrabold text-blue-400 mt-1">#{citizenRank}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* QR Scan Simulation */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-white">Log Bin Deposit</h4>
                      <p className="text-[10px] text-slate-400">Scan QR codes on smart bins to register drops and earn points</p>
                    </div>

                    <form onSubmit={handleQRDeposit} className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-slate-500">Scan Deposit Bin</label>
                        <select 
                          value={scannedBinId} 
                          onChange={(e) => setScannedBinId(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-sans"
                        >
                          <option value="">-- Choose Target Smart Bin --</option>
                          {bins.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                          ))}
                        </select>
                      </div>

                      <button 
                        type="submit" 
                        disabled={scanning || !scannedBinId}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 ${
                          scanning || !scannedBinId
                            ? 'bg-slate-800 text-slate-400 border border-white/5 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/25'
                        }`}
                      >
                        {scanning ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            Verifying QR Code...
                          </>
                        ) : (
                          <>
                            <Icon name="qrcode" className="w-4 h-4" />
                            Log QR Deposit (+50)
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Report Overflow Form with Drag & Drop Image Preview */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-white">Report Waste Overflow</h4>
                      <p className="text-[10px] text-slate-400">Submit an overflow image to alert CMC dispatches</p>
                    </div>
                    <form onSubmit={handleOverflowSubmit} className="space-y-4">
                      <select 
                        required
                        value={overflowReportBin}
                        onChange={(e) => setOverflowReportBin(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-sans"
                      >
                        <option value="">-- Select Overflow Location --</option>
                        {bins.filter(b => b.fillLevel < 80).map(b => (
                          <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                        ))}
                      </select>

                      {/* Photo Dropzone Container */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition relative flex flex-col items-center justify-center min-h-[100px] ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-600/10' 
                            : uploadedImage 
                              ? 'border-green-500 bg-green-500/5' 
                              : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {uploadedImage ? (
                          <div className="relative w-full flex flex-col items-center gap-2">
                            <img src={uploadedImage} alt="Overflow Preview" className="max-h-24 rounded border border-white/10" />
                            <span className="text-[9px] text-green-400 font-bold">Image selected. Ready to report.</span>
                          </div>
                        ) : (
                          <>
                            <Icon name="camera" className="w-6 h-6 text-slate-500 mb-1" />
                            <p className="text-[10px] text-slate-400">Drag photo here or click to select</p>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUploadedImage('overflow_report_demo.png');
                              }} 
                              className="mt-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 text-blue-400 px-2.5 py-1 rounded text-[9px] font-bold tracking-wider relative z-10"
                            >
                              Load Sample Report Photo
                            </button>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                          </>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={!overflowReportBin}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                          overflowReportBin 
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Alert Report
                      </button>
                    </form>
                  </div>

                </div>

                {/* Redeem Rewards Market & Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Rewards Catalog */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-white">Claim Reward Vouchers</h3>
                      <p className="text-[10px] text-slate-400">Redeem earned citizen points for Colombo utilities</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { id: 't1', title: 'CMC Bus Transit Ticket', points: 100, icon: 'bus', desc: 'Complimentary pass for Colombo city limits.' },
                        { id: 't2', title: 'Liberty Cinema Movie Ticket', points: 250, icon: 'film', desc: 'Valid for standard screen seat bookings.' },
                        { id: 't3', title: 'Arpico Supercentre Voucher', points: 500, icon: 'shop', desc: 'LKR 1000 store-wide shopping voucher.' },
                        { id: 't4', title: 'Plant-A-Tree Certificate', points: 1000, icon: 'leaf', desc: 'A native tree will be planted in Viharamahadevi Park in your name.' }
                      ].map(reward => (
                        <div key={reward.id} className="bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-4 transition">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
                                <Icon name={reward.icon} className="w-5 h-5" />
                              </span>
                              <span className="text-[10px] font-bold text-green-400 bg-green-950/40 border border-green-500/20 px-2 py-0.5 rounded">
                                {reward.points} Pts
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-white pt-1">{reward.title}</h4>
                            <p className="text-[10px] text-slate-400 leading-normal">{reward.desc}</p>
                          </div>
                          
                          <button
                            onClick={() => handleRedeem(reward.id, reward.points, reward.title)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition"
                          >
                            Claim Voucher
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leaderboard & Achievements Badges */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Leaderboard */}
                    <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                        <Icon name="trophy" className="w-4 h-4 text-yellow-500" />
                        Colombo Green Leaderboard
                      </h4>
                      
                      <div className="space-y-2.5 text-xs">
                        {[
                          { rank: 1, name: 'Sahan Wickramage', points: 1420, active: false },
                          { rank: 2, name: 'Fathima R.', points: 1250, active: false },
                          { rank: 3, name: 'Nishan Perera', points: 980, active: false },
                          { rank: 11, name: 'Asha Jayasekara', points: 450, active: false },
                          { rank: 12, name: username, points: citizenPoints, active: true },
                          { rank: 13, name: 'Ranasinghe K.', points: 390, active: false }
                        ].map((user, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded-xl border flex justify-between items-center ${
                              user.active 
                                ? 'bg-blue-600/10 border-blue-500/30 font-bold' 
                                : 'bg-white/5 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[9px] ${
                                user.rank <= 3 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {user.rank}
                              </span>
                              <span className={user.active ? 'text-blue-400' : 'text-slate-300'}>{user.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">{user.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements Badges Card */}
                    <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        Earned Accomplishments
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'b1', name: 'Zero Waste Hero', desc: 'Log 5 deposits', unlocked: true, color: 'border-green-500/30 text-green-400' },
                          { id: 'b2', name: 'Green Scout', desc: 'Register 1 drop', unlocked: true, color: 'border-blue-500/30 text-blue-400' },
                          { id: 'b3', name: 'Fort Protector', desc: 'Fort node drop', unlocked: citizenPoints >= 500, color: 'border-yellow-500/30 text-yellow-500' },
                          { id: 'b4', name: 'CMC Ambassador', desc: '1000 points logged', unlocked: false, color: 'border-purple-500/10 text-slate-500 opacity-50' }
                        ].map(badge => (
                          <div 
                            key={badge.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between items-center text-center gap-1.5 transition duration-300 glass-card ${
                              badge.unlocked ? badge.color + ' hover:scale-105 shadow-md' : 'border-white/5 text-slate-600'
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-full bg-white/5 border flex items-center justify-center ${badge.unlocked ? 'border-current' : 'border-transparent'}`}>
                              <Icon name={badge.id === 'b4' ? 'award' : badge.id === 'b3' ? 'shield' : badge.id === 'b2' ? 'leaf' : 'refresh'} className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="text-[10px] font-extrabold leading-tight">{badge.name}</p>
                              <span className="text-[8px] text-slate-500 block mt-0.5">{badge.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 5: ABOUT SECTION & INFRASTRUCTURE */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn text-xs">
            
            {/* Diagram Row: LoRa Gateway */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Interactive LoRa Topology SVG */}
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                    <div>
                      <h3 className="font-bold text-sm text-white">Colombo Pilot LoRaWAN Topology</h3>
                      <p className="text-[10px] text-slate-400">Click a node below to query real-time sensor metrics</p>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded font-mono">
                      868 MHz ISM band
                    </span>
                  </div>
                  
                  <div className="relative w-full h-64 bg-slate-950/80 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                    <svg className="w-full h-full p-4" viewBox="0 0 600 240">
                      <defs>
                        <linearGradient id="lineGrd" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        </linearGradient>
                      </defs>

                      {/* Radar pulses */}
                      <circle cx="300" cy="80" r="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '300px 80px', animationDuration: '3s' }}></circle>
                      <circle cx="300" cy="80" r="45" fill="none" stroke="#22c55e" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '300px 80px', animationDuration: '4.5s' }}></circle>

                      {/* Network Lines */}
                      <path d="M 120 180 Q 210 130 300 80" fill="none" stroke="url(#lineGrd)" strokeWidth={selectedLoraNode === 'B1' ? '2.5' : '1'} strokeDasharray="5,5" className="transition-all"></path>
                      <path d="M 230 180 Q 265 130 300 80" fill="none" stroke="url(#lineGrd)" strokeWidth={selectedLoraNode === 'B2' ? '2.5' : '1'} strokeDasharray="5,5" className="transition-all"></path>
                      <path d="M 370 180 Q 335 130 300 80" fill="none" stroke="url(#lineGrd)" strokeWidth={selectedLoraNode === 'B4' ? '2.5' : '1'} strokeDasharray="5,5" className="transition-all"></path>
                      <path d="M 480 180 Q 390 130 300 80" fill="none" stroke="url(#lineGrd)" strokeWidth={selectedLoraNode === 'B6' ? '2.5' : '1'} strokeDasharray="5,5" className="transition-all"></path>
                      
                      <path d="M 300 80 L 300 180" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3,3"></path>

                      {/* Gateway Antenna */}
                      <g className="cursor-pointer" onClick={() => setSelectedLoraNode('GW')}>
                        <circle cx="300" cy="80" r="22" fill="#1e293b" stroke={selectedLoraNode === 'GW' ? '#3b82f6' : '#475569'} strokeWidth="2.5"></circle>
                        <text x="300" y="84" fill="#3b82f6" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">GW</text>
                      </g>

                      {/* Bins */}
                      <g className="cursor-pointer" onClick={() => setSelectedLoraNode('B1')}>
                        <circle cx="120" cy="180" r="16" fill="#0f172a" stroke={selectedLoraNode === 'B1' ? '#22c55e' : '#475569'} strokeWidth="2"></circle>
                        <text x="120" y="184" fill={selectedLoraNode === 'B1' ? '#22c55e' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">B1</text>
                      </g>
                      
                      <g className="cursor-pointer" onClick={() => setSelectedLoraNode('B2')}>
                        <circle cx="230" cy="180" r="16" fill="#0f172a" stroke={selectedLoraNode === 'B2' ? '#22c55e' : '#475569'} strokeWidth="2"></circle>
                        <text x="230" y="184" fill={selectedLoraNode === 'B2' ? '#22c55e' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">B2</text>
                      </g>

                      <g className="cursor-pointer" onClick={() => setSelectedLoraNode('B4')}>
                        <circle cx="370" cy="180" r="16" fill="#0f172a" stroke={selectedLoraNode === 'B4' ? '#eab308' : '#475569'} strokeWidth="2"></circle>
                        <text x="370" y="184" fill={selectedLoraNode === 'B4' ? '#eab308' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">B4</text>
                      </g>

                      <g className="cursor-pointer" onClick={() => setSelectedLoraNode('B6')}>
                        <circle cx="480" cy="180" r="16" fill="#0f172a" stroke={selectedLoraNode === 'B6' ? '#ef4444' : '#475569'} strokeWidth="2"></circle>
                        <text x="480" y="184" fill={selectedLoraNode === 'B6' ? '#ef4444' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">B6</text>
                      </g>

                      {/* Server */}
                      <rect x="270" y="180" width="60" height="24" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"></rect>
                      <text x="300" y="195" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">SERVER</text>

                      {/* Labels */}
                      <text x="300" y="32" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle">LORA GATEWAY HQ</text>
                      <text x="300" y="222" fill="#f8fafc" fontSize="8" textAnchor="middle">CENTRAL OPERATIONS</text>
                      <text x="120" y="210" fill="#94a3b8" fontSize="8" textAnchor="middle">Fort (B1)</text>
                      <text x="230" y="210" fill="#94a3b8" fontSize="8" textAnchor="middle">Pettah (B2)</text>
                      <text x="370" y="210" fill="#94a3b8" fontSize="8" textAnchor="middle">Borella (B4)</text>
                      <text x="480" y="210" fill="#94a3b8" fontSize="8" textAnchor="middle">Flats (B6)</text>
                    </svg>
                  </div>
                </div>

                {/* LoRa WAN packet binary decrypt log */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3.5">
                  <h4 className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="terminal" className="w-4 h-4 text-green-400" />
                    Decoded Telemetry Hex Stream
                  </h4>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-white/5 font-mono text-[9px] space-y-1.5 h-36 overflow-y-auto pr-1">
                    {loraPackets.map((pkt, index) => (
                      <div key={index} className="flex gap-2 text-slate-400">
                        <span className="text-slate-600">[{pkt.time}]</span>
                        <span className="text-blue-500 font-bold">Node:{pkt.node}</span>
                        <span className="text-green-500">rx:{pkt.raw}</span>
                        <span className="text-slate-300 text-[8px] flex-1 text-right">{pkt.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LoRa query detail box */}
              <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                
                {selectedLoraNode === 'GW' ? (
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h4 className="font-bold text-sm text-blue-400">Gateway Antenna HQ</h4>
                      <p className="text-[9px] text-slate-500">Model: CMC-LORA-GW01</p>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-300">
                      <div className="flex justify-between"><span>Frequency:</span><span className="font-mono text-slate-200">868.1 - 868.8 MHz</span></div>
                      <div className="flex justify-between"><span>Active Uplink Channels:</span><span className="font-mono text-slate-200">8 Channels</span></div>
                      <div className="flex justify-between"><span>Sensors Linked:</span><span className="font-mono text-slate-200">150 Nodes</span></div>
                      <div className="flex justify-between"><span>Noise Floor (RSSI):</span><span className="font-mono text-slate-200">-118 dBm</span></div>
                      <div className="flex justify-between"><span>Power Supply:</span><span className="font-mono text-green-400 font-bold">Grid (Online)</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h4 className="font-bold text-sm text-green-400">Smart Node {selectedLoraNode}</h4>
                      <p className="text-[9px] text-slate-500">ID: {activeLoraNodeDetail.id}</p>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-300">
                      <div className="flex justify-between"><span>Associated Area:</span><span className="font-bold text-slate-200">{activeLoraNodeDetail.name}</span></div>
                      <div className="flex justify-between"><span>Capacity Load:</span><span className="font-bold text-slate-200">{activeLoraNodeDetail.fillLevel}%</span></div>
                      <div className="flex justify-between"><span>Signal Strength:</span><span className="font-mono text-slate-200">{activeLoraNodeDetail.rssi} dBm</span></div>
                      <div className="flex justify-between"><span>SNR Quality:</span><span className="font-mono text-green-400">{activeLoraNodeDetail.snr} dB</span></div>
                      <div className="flex justify-between"><span>Battery Level:</span><span className="font-mono text-slate-200">{activeLoraNodeDetail.battery}% ({activeLoraNodeDetail.volts}V)</span></div>
                      <div className="flex justify-between"><span>Uplink Interval:</span><span className="font-mono text-slate-200">300 seconds</span></div>
                    </div>
                  </div>
                )}

                  <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                    <img src="smart_bin_design.png" className="w-12 h-12 rounded-lg object-cover border border-white/10" alt="Smart Bin Design" />
                    <div>
                      <h5 className="font-bold text-[10px] text-slate-200">Integrated Node Hardware</h5>
                      <p className="text-[9px] text-slate-500 mt-0.5">Model CMC-SBx1 | IP67 Rated | Solar Powered</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-6">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">Consortium Partners</span>
                    <p className="font-bold text-slate-400 text-xs mt-1">CMC Operations + LoRa Alliance Sri Lanka</p>
                  </div>
              </div>

            </div>

            {/* Technology Stack Specifications */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Enterprise Tech Stack Specifications</h3>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: 'AI & Inference', tech: 'YOLOv8', desc: 'Edge vision classification with custom anchors for plastic, paper, and food waste categories.', color: 'border-blue-500/20' },
                  { name: 'IoT Telemetry', tech: 'LoRaWAN', desc: '868 MHz multi-channel sub-gigahertz gateway backend monitoring smart bin sonar arrays.', color: 'border-green-500/20' },
                  { name: 'Mobile Platform', tech: 'Flutter', desc: 'Citizen reward apps deployed natively with geofenced map notifications.', color: 'border-blue-500/20' },
                  { name: 'API Server', tech: 'Spring Boot', desc: 'Enterprise microservices orchestrating routing algorithms and citizen database logs.', color: 'border-green-500/20' },
                  { name: 'Database Stack', tech: 'MongoDB', desc: 'Document store storing granular historical sensors logs and recycling leaderboards.', color: 'border-slate-800' }
                ].map((spec, index) => (
                  <div key={index} className={`glass-card p-5 rounded-2xl border ${spec.color} flex flex-col justify-between space-y-4`}>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none block">{spec.name}</span>
                      <h4 className="text-base font-extrabold text-white">{spec.tech}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{spec.desc}</p>
                    </div>
                    <span className="text-[8px] font-bold font-mono text-slate-500 tracking-wider">SECURE NODE CONNECTIVITY</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ----------------------------------------------------
          PREMIUM FOOTER
          ---------------------------------------------------- */}
      <footer className="mt-auto border-t border-white/5 glass-panel py-8 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-green-500 flex items-center justify-center text-white font-black text-sm">
              E
            </div>
            <div>
              <p className="font-bold text-white text-xs">EcoSphere X</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Smarter Recycling. Cleaner Colombo. Greener Future.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-center md:text-left justify-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Authority Partner</span>
              <p className="font-semibold text-slate-300 mt-1">Colombo Municipal Council (CMC)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Deployment Classification</span>
              <p className="font-semibold text-slate-300 mt-1">Official Pilot Stage 1 Demonstration</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">System Year</span>
              <p className="font-semibold text-slate-300 mt-1">&copy; EcoSphere X 2026</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Render React App
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
