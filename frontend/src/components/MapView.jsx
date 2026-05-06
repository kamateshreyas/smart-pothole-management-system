import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ASSET_URL } from "../services/api.js";
import StatusBadge from "./StatusBadge.jsx";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({ reports }) {
  const center = reports?.[0] ? [reports[0].latitude, reports[0].longitude] : [12.9716, 77.5946];

  return (
    <div className="map-shell">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]} icon={markerIcon}>
            <Popup>
              <div className="popup">
                <strong>{report.title}</strong>
                <StatusBadge severity={report.severity}>{report.severity}</StatusBadge>
                <p>{report.address}</p>
                {(report.annotatedImageUrl || report.imageUrl) && (
                  <img
                    src={report.annotatedImageUrl || `${ASSET_URL}${report.imageUrl}`}
                    alt={report.title}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
