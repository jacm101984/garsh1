import React, { useState } from 'react';
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

const MapMarker = ({ text }) => (
  <div className="bg-orange-500 text-white p-1 rounded-full shadow-lg">
    {text}
  </div>
);

const SpaceCard = ({ space, onFavorite, isFavorite, onReserve, reservations }) => {
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
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
          {space.features.map((feature, index) => (
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

const Home = ({ spaces, onFavorite, favorites, onReserve, reservations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    security: false,
    availability: false,
    climate: false,
    size: 'all'
  });
  const [priceFilter, setPriceFilter] = useState(500);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [mapZoom, setMapZoom] = useState(10);

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
        <div className="h-96 w-full mb-6">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDjkYGcyFt2uHKsq31_j3YgnznpuIJAbYg' }}
            center={mapCenter}
            zoom={mapZoom}
            onChange={({ center, zoom }) => {
              setMapCenter(center);
              setMapZoom(zoom);
            }}
          >
            {spaces.map(space => (
              <MapMarker
                key={space.id}
                lat={space.lat}
                lng={space.lng}
                text={space.name}
              />
            ))}
          </GoogleMapReact>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex space-x-2">
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50 
                ${filters.type === 'all' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
            >
              <Filter className="w-4 h-4 mr-2" />
              Todos
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.type === 'garage' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, type: 'garage' }))}
            >
              Garajes
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.type === 'almacen' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, type: 'almacen' }))}
            >
              Almacenes
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.availability ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, availability: !prev.availability }))}
            >
              <Clock className="w-4 h-4 mr-2" />
              Disponibilidad
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.security ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, security: !prev.security }))}
            >
              <Camera className="w-4 h-4 mr-2" />
              Seguridad
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.climate ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, climate: !prev.climate }))}
            >
              <Thermometer className="w-4 h-4 mr-2" />
              Clima
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.size === 'small' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, size: 'small' }))}
            >
              <Box className="w-3 h-3 mr-2" />
              Pequeño
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.size === 'medium' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, size: 'medium' }))}
            >
              <Box className="w-4 h-4 mr-2" />
              Mediano
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full border hover:bg-gray-50
                ${filters.size === 'large' ? 'bg-orange-100 border-orange-500 text-orange-500' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, size: 'large' }))}
            >
              <Box className="w-5 h-5 mr-2" />
              Grande
            </button>
          </div>

          {(filters.type !== 'all' || filters.security || filters.availability ||
            filters.climate || filters.size !== 'all' || priceFilter < 500) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-orange-500 hover:text-orange-600"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="w-full max-w-md mx-auto mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-medium text-gray-700">Precio máximo</span>
              </div>
              <span className="text-orange-500 font-semibold">${priceFilter}/mes</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                        focus:outline-none focus:bg-orange-100
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-orange-500
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:bg-orange-600
                        [&::-webkit-slider-thumb]:transition-colors"
            />
            <div className="flex justify-between mt-2">
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
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
