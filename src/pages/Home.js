import React, { useState, useCallback } from 'react';
import {
  Search,
  MapPin,
  Star,
  Filter,
  Clock,
  Camera,
  Thermometer,
  Box,
  DollarSign
} from 'lucide-react';
import GoogleMapReact from 'google-map-react';

const sampleSpaces = [
  {
    id: 1,
    name: "Garage Premium Downtown",
    type: "garage",
    price: 150,
    location: "Downtown Austin, Congress Ave",
    size: 25,
    features: ["Security Camera", "Climate Control"],
    rating: 4.5,
    lat: 30.2672,
    lng: -97.7431,
    image: "/images/garage-spaces/garage-premium.jpg"
  },
  {
    id: 2,
    name: "South Lamar Storage",
    type: "almacen",
    price: 300,
    location: "South Lamar Blvd, Austin",
    size: 80,
    features: ["Security Camera", "24/7 Access"],
    rating: 4.2,
    lat: 30.2557,
    lng: -97.7697,
    image: "/images/garage-spaces/garage-storage.jpg"
  },
  {
    id: 3,
    name: "East Side Mini Garage",
    type: "garage",
    price: 100,
    location: "East 6th Street, Austin",
    size: 15,
    features: ["Climate Control"],
    rating: 4.0,
    lat: 30.2626, // East Austin
    lng: -97.7147
  },
  {
    id: 4,
    name: "Mueller District Storage",
    type: "almacen",
    price: 250,
    location: "Mueller Blvd, Austin",
    size: 50,
    features: ["Climate Control", "Security Camera", "24/7 Access"],
    rating: 4.7,
    lat: 30.2998, // Mueller area
    lng: -97.7044
  },
  {
    id: 5,
    name: "Hyde Park Premium Garage",
    type: "garage",
    price: 200,
    location: "Hyde Park, Austin",
    size: 35,
    features: ["Security Camera", "Climate Control", "24/7 Access"],
    rating: 4.8,
    lat: 30.3052, // Hyde Park
    lng: -97.7372
  },
  {
    id: 6,
    name: "Barton Hills Storage",
    type: "almacen",
    price: 180,
    location: "Barton Hills Dr, Austin",
    size: 30,
    features: ["24/7 Access", "Security Camera"],
    rating: 4.3,
    lat: 30.2454, // Barton Hills
    lng: -97.7814
  },
  {
    id: 7,
    name: "Domain Luxury Garage",
    type: "garage",
    price: 350,
    location: "Domain, Austin",
    size: 40,
    features: ["Climate Control", "Security Camera", "24/7 Access", "Valet"],
    rating: 4.9,
    lat: 30.4019, // The Domain
    lng: -97.7252
  },
  {
    id: 8,
    name: "South Congress Storage",
    type: "almacen",
    price: 400,
    location: "South Congress Ave, Austin",
    size: 100,
    features: ["Loading Dock", "Security Camera", "24/7 Access"],
    rating: 4.6,
    lat: 30.2340, // SoCo area
    lng: -97.7477
  },
  {
    id: 9,
    name: "North Austin Storage Plus",
    type: "almacen",
    price: 120,
    location: "North Austin, Burnet Rd",
    size: 20,
    features: ["Climate Control", "Security Camera"],
    rating: 4.4,
    lat: 30.3541, // North Austin
    lng: -97.7377
  }
];
const MapMarker = ({ text, price, type, selected, onClick }) => (
  <div className="relative -translate-x-1/2 -translate-y-full group cursor-pointer" onClick={onClick}>
    <div className={`
      absolute bottom-0
      ${selected ? 'scale-125 z-50' : 'group-hover:scale-110'}
      transition-transform duration-200
    `}>
      <div className={`
        w-8 h-8 rounded-full shadow-lg
        flex items-center justify-center
        ${type === 'garage' ? 'bg-orange-500' : 'bg-blue-500'}
      `}>
        <MapPin className="w-5 h-5 text-white" />
      </div>

      <div className={`
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        bg-white rounded-lg shadow-lg p-2 min-w-[120px]
        ${selected ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}
        transition-all duration-200
        z-50
      `}>
        <div className="text-sm font-semibold">{text}</div>
        <div className="text-xs">${price}/mes</div>
      </div>
    </div>
  </div>
);

const SpaceCard = ({ space, onFavorite, isFavorite, onReserve, reservations, onMouseEnter, onMouseLeave, isSelected }) => {
  const [isReserving, setIsReserving] = useState(false);
  const [reservationDates, setReservationDates] = useState({
    startDate: '',
    endDate: ''
  });

  const handleReservationSubmit = () => {
    const { startDate, endDate } = reservationDates;

    if (!startDate || !endDate) {
      alert('Por favor selecciona las fechas de inicio y fin.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    const isConflict = reservations.some(reservation => {
      const reserveStart = new Date(reservation.startDate);
      const reserveEnd = new Date(reservation.endDate);
      return (start <= reserveEnd && end >= reserveStart) &&
             reservation.spaceId === space.id;
    });

    if (isConflict) {
      alert('Este espacio ya está reservado en las fechas seleccionadas.');
      return;
    }

    onReserve(space.id, startDate, endDate);
    setIsReserving(false);
    setReservationDates({ startDate: '', endDate: '' });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition
        ${isSelected ? 'ring-2 ring-orange-500' : ''}
      `}
      onMouseEnter={() => onMouseEnter(space.id)}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={space.image || `/api/placeholder/400/250?text=${encodeURIComponent(space.name)}`}
        alt={space.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{space.name}</h3>
            <p className="text-gray-500 mt-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              {space.location}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {space.size}m² • {space.type}
            </p>
          </div>
          <div className="flex items-center">
            <button onClick={() => onFavorite(space.id)}>
              <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
            </button>
            <span className="ml-1">{space.rating}</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {space.features?.map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {feature}
            </span>
          ))}
        </div>

        {isReserving ? (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inicio
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={reservationDates.startDate}
                  onChange={(e) => setReservationDates({
                    ...reservationDates,
                    startDate: e.target.value
                  })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fin
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={reservationDates.endDate}
                  onChange={(e) => setReservationDates({
                    ...reservationDates,
                    endDate: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReservationSubmit}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setIsReserving(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold">${space.price}/mes</p>
            <button
              onClick={() => setIsReserving(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Reservar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
const Home = ({ spaces = sampleSpaces, onFavorite, favorites = [], onReserve, reservations = [] }) => {
  const [mapConfig] = useState({
    defaultCenter: { lat: 30.2672, lng: -97.7431 },
    defaultZoom: 12
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    security: false,
    availability: false,
    climate: false,
    size: 'all'
  });
  const [priceFilter, setPriceFilter] = useState(500);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [hoveredSpace, setHoveredSpace] = useState(null);

  const SIZE_RANGES = {
    small: { min: 0, max: 20 },
    medium: { min: 21, max: 50 },
    large: { min: 51, max: Infinity }
  };

  const filterSpaces = () => {
    return spaces.filter(space => {
      const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          space.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === 'all' || space.type === filters.type;
      const matchesSecurity = !filters.security || space.features?.includes('Security Camera');
      const matchesClimate = !filters.climate || space.features?.includes('Climate Control');
      const matchesAvailability = !filters.availability || !reservations.some(reservation => {
        const now = new Date();
        const reserveEnd = new Date(reservation.endDate);
        return space.id === reservation.spaceId && reserveEnd > now;
      });

      const matchesSize = filters.size === 'all' ||
        (space.size >= SIZE_RANGES[filters.size].min &&
         space.size <= SIZE_RANGES[filters.size].max);

      const matchesPrice = space.price <= priceFilter;

      return matchesSearch && matchesType && matchesSecurity &&
             matchesClimate && matchesAvailability && matchesSize && matchesPrice;
    });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      security: false,
      availability: false,
      climate: false,
      size: 'all'
    });
    setPriceFilter(500);
  };

  const handleSpaceMouseEnter = useCallback((spaceId) => {
    setHoveredSpace(spaceId);
  }, []);

  const handleSpaceMouseLeave = useCallback(() => {
    setHoveredSpace(null);
  }, []);

  const handleMarkerClick = useCallback((spaceId) => {
    setSelectedSpace(spaceId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-orange-500 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-full shadow-lg flex items-center p-2">
            <Search className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar espacios por ubicación..."
              className="w-full px-4 py-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-96 w-full mb-6 rounded-xl overflow-hidden shadow-lg">
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
            defaultCenter={mapConfig.defaultCenter}
            defaultZoom={mapConfig.defaultZoom}
            options={{
              fullscreenControl: false,
              zoomControl: true,
              clickableIcons: false,
              gestureHandling: 'cooperative',
              disableDefaultUI: false,
              zoomControlOptions: {
                position: 9
              }
            }}
            yesIWantToUseGoogleMapApiInternals
            draggable={true}
          >
            {filterSpaces().map(space => (
              <MapMarker
                key={space.id}
                lat={space.lat}
                lng={space.lng}
                text={space.name}
                price={space.price}
                type={space.type}
                selected={space.id === selectedSpace || space.id === hoveredSpace}
                onClick={() => handleMarkerClick(space.id)}
              />
            ))}
          </GoogleMapReact>
        </div>

        {/* Filtros y resto del contenido... */}
        <div className="flex flex-wrap gap-4">
          {/* ... botones de filtro ... */}
        </div>

        <div className="w-full max-w-md mx-auto mt-6">
          {/* ... control deslizante de precio ... */}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {filterSpaces().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron espacios con los filtros seleccionados
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterSpaces().map(space => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onFavorite={onFavorite}
                  isFavorite={favorites.includes(space.id)}
                  onReserve={onReserve}
                  reservations={reservations}
                  onMouseEnter={handleSpaceMouseEnter}
                  onMouseLeave={handleSpaceMouseLeave}
                  isSelected={space.id === selectedSpace}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;