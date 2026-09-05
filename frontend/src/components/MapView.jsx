import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  if (!position) return null;

  return (
    <Marker position={[position.latitude, position.longitude]}>
      <Popup>Selected Room Location</Popup>
    </Marker>
  );
};

const MapView = ({
  latitude = 26.8467,
  longitude = 80.9462,
  zoom = 13,
  title = "Room Location",
  selectable = false,
  onLocationSelect,
}) => {
  const position =
    latitude && longitude
      ? {
          latitude: Number(latitude),
          longitude: Number(longitude),
        }
      : null;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={[Number(latitude), Number(longitude)]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectable ? (
          <LocationPicker
            position={position}
            onLocationSelect={onLocationSelect}
          />
        ) : (
          position && (
            <Marker position={[position.latitude, position.longitude]}>
              <Popup>{title}</Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
};

const LocationPicker = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  if (!position) return null;

  return (
    <Marker position={[position.latitude, position.longitude]}>
      <Popup>Selected Room Location</Popup>
    </Marker>
  );
};

export default MapView;