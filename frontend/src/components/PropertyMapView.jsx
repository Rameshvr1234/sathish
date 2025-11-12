import { useState } from 'react';
import { MapPin, Home, Navigation, Maximize2, X } from 'lucide-react';

/**
 * PropertyMapView Component
 *
 * This is a scaffold/placeholder for Google Maps integration.
 * To enable full functionality, add Google Maps API:
 *
 * 1. Install: npm install @react-google-maps/api
 * 2. Get API key from: https://console.cloud.google.com/
 * 3. Add to .env: VITE_GOOGLE_MAPS_API_KEY=your_key_here
 * 4. Uncomment the GoogleMap implementation below
 *
 * Current implementation shows a placeholder with property markers
 * that can be easily replaced with actual Google Maps
 */

const PropertyMapView = ({ properties = [], onPropertyClick, center, zoom = 12 }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  // Placeholder map implementation
  // Replace with actual Google Maps when API key is available
  const PlaceholderMap = () => (
    <div className="relative w-full h-full bg-gray-100">
      {/* Map placeholder background with grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Center message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Google Maps Integration Ready
          </h3>
          <p className="text-gray-600 mb-4">
            To enable interactive maps, add your Google Maps API key
          </p>
          <div className="text-sm text-left bg-gray-50 rounded p-4 mb-4">
            <code className="text-xs text-gray-800">
              1. Get API key from Google Cloud Console<br />
              2. Add to .env: VITE_GOOGLE_MAPS_API_KEY<br />
              3. Restart dev server
            </code>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {properties.length} Properties
            </span>
          </div>
        </div>
      </div>

      {/* Mock property markers */}
      {properties.slice(0, 10).map((property, index) => {
        // Mock positions (in production, use lat/lng)
        const top = 30 + (index % 3) * 20;
        const left = 20 + (index % 4) * 20;

        return (
          <button
            key={property.id}
            onClick={() => {
              setSelectedProperty(property);
              onPropertyClick && onPropertyClick(property);
            }}
            className="absolute transform -translate-x-1/2 -translate-y-full hover:z-10 transition-all group"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            {/* Marker */}
            <div className="flex flex-col items-center">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full shadow-lg text-xs font-bold whitespace-nowrap mb-1 group-hover:bg-red-700 group-hover:scale-110 transition-all">
                {formatPrice(property.price)}
              </div>
              <MapPin className="w-8 h-8 text-red-600 fill-current drop-shadow-lg" />
            </div>
          </button>
        );
      })}

      {/* Selected property info card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl p-4 max-w-sm w-full mx-4 z-20">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-3">
            {selectedProperty.images && selectedProperty.images[0] ? (
              <img
                src={selectedProperty.images[0].image_url}
                alt={selectedProperty.title}
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-1 truncate">
                {selectedProperty.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2 truncate">
                {selectedProperty.locality}, {selectedProperty.city}
              </p>
              <p className="text-lg font-bold text-blue-600 mb-2">
                {formatPrice(selectedProperty.price)}
              </p>
              <button
                onClick={() => onPropertyClick && onPropertyClick(selectedProperty)}
                className="text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-50">
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-50">
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );

  /*
   * GOOGLE MAPS IMPLEMENTATION (UNCOMMENT WHEN API KEY IS AVAILABLE)
   *
   * import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
   *
   * const GoogleMapImplementation = () => (
   *   <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
   *     <GoogleMap
   *       mapContainerStyle={{ width: '100%', height: '100%' }}
   *       center={center || { lat: 12.9716, lng: 77.5946 }} // Bangalore default
   *       zoom={zoom}
   *       options={{
   *         zoomControl: true,
   *         streetViewControl: true,
   *         mapTypeControl: true,
   *         fullscreenControl: true
   *       }}
   *     >
   *       {properties.map((property) => (
   *         property.latitude && property.longitude && (
   *           <Marker
   *             key={property.id}
   *             position={{ lat: property.latitude, lng: property.longitude }}
   *             onClick={() => setSelectedProperty(property)}
   *             label={{
   *               text: formatPrice(property.price),
   *               color: 'white',
   *               fontSize: '12px',
   *               fontWeight: 'bold'
   *             }}
   *             icon={{
   *               path: google.maps.SymbolPath.CIRCLE,
   *               fillColor: '#EF4444',
   *               fillOpacity: 1,
   *               strokeColor: 'white',
   *               strokeWeight: 2,
   *               scale: 8
   *             }}
   *           />
   *         )
   *       ))}
   *
   *       {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
   *         <InfoWindow
   *           position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
   *           onCloseClick={() => setSelectedProperty(null)}
   *         >
   *           <div className="p-2" style={{ maxWidth: '200px' }}>
   *             <h4 className="font-bold text-sm mb-1">{selectedProperty.title}</h4>
   *             <p className="text-xs text-gray-600 mb-2">
   *               {selectedProperty.locality}, {selectedProperty.city}
   *             </p>
   *             <p className="text-sm font-bold text-blue-600 mb-2">
   *               {formatPrice(selectedProperty.price)}
   *             </p>
   *             <button
   *               onClick={() => onPropertyClick && onPropertyClick(selectedProperty)}
   *               className="text-xs text-blue-600 hover:text-blue-700 font-medium"
   *             >
   *               View Details →
   *             </button>
   *           </div>
   *         </InfoWindow>
   *       )}
   *     </GoogleMap>
   *   </LoadScript>
   * );
   */

  return (
    <div className="w-full h-full relative">
      <PlaceholderMap />
      {/* Replace <PlaceholderMap /> with <GoogleMapImplementation /> when API key is ready */}
    </div>
  );
};

export default PropertyMapView;
