import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
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

/*
|--------------------------------------------------------------------------
| Map Center Controller
|--------------------------------------------------------------------------
| Whenever latitude/longitude changes from the form,
| the map automatically moves to that location.
*/

const MapCenterController = ({ position }) => {
  const map = useMap();

  if (position) {
    map.setView(
      [position.latitude, position.longitude],
      map.getZoom(),
      {
        animate: true,
      }
    );
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| Location Picker
|--------------------------------------------------------------------------
| Clicking anywhere on the map sends latitude/longitude
| back to AddRoom.jsx.
*/

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

const MapView = ({
  latitude = 26.8467,
  longitude = 80.9462,
  zoom = 13,
  title = "Room Location",
  selectable = false,
  onLocationSelect,
}) => {
  const hasCoordinates =
    latitude !== "" &&
    latitude !== null &&
    latitude !== undefined &&
    longitude !== "" &&
    longitude !== null &&
    longitude !== undefined;

  const position = hasCoordinates
    ? {
        latitude: Number(latitude),
        longitude: Number(longitude),
      }
    : null;

  const mapCenter = position || {
    latitude: 26.8467,
    longitude: 80.9462,
  };

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={[mapCenter.latitude, mapCenter.longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Move map when coordinates change */}
        <MapCenterController position={position} />

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

export default MapView;