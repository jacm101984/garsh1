import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const SpaceCard = ({ space, onFavorite, isFavorite, onReserve, reservations }) => {
  const [hovered, setHovered] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationStartDate, setReservationStartDate] = useState('');
  const [reservationEndDate, setReservationEndDate] = useState('');

  const handleFavorite = () => {
    onFavorite(space.id);
  };

  const isDateConflict = (startDate, endDate) => {
    return reservations.some(reservation => {
      const existingStart = new Date(reservation.startDate);
      const existingEnd = new Date(reservation.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  const handleReserve = () => {
    if (reservationStartDate && reservationEndDate) {
      if (new Date(reservationStartDate) > new Date(reservationEndDate)) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }

      if (isDateConflict(reservationStartDate, reservationEndDate)) {
        alert('El espacio ya está reservado durante este período.');
        return;
      }

      onReserve(space.id, reservationStartDate, reservationEndDate);
      setIsReserving(false);
      alert(`Reserva realizada desde el ${reservationStartDate} hasta el ${reservationEndDate}`);
    } else {
      alert('Por favor, seleccione las fechas de inicio y fin para la reserva.');
    }
  };

  // Default images for spaces
  const defaultImages = [
    'https://via.placeholder.com/300x200?text=Garage+1',
    'https://via.placeholder.com/300x200?text=Garage+2',
    'https://via.placeholder.com/300x200?text=Garage+3',
    'https://via.placeholder.com/300x200?text=Garage+4',
    'https://via.placeholder.com/300x200?text=Garage+5'
  ];

  // Assign an image to the space
  const assignedImage = space.image && space.image.startsWith('http')
    ? space.image
    : defaultImages[space.id % defaultImages.length];

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={assignedImage}
        alt={space.name || 'Espacio'}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null; // Avoid infinite loop
          e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible';
        }}
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{space.name || 'Espacio sin nombre'}</h3>
        <p className="text-gray-600 text-sm mb-4">{space.description || 'Descripción no disponible.'}</p>

        <div className="flex items-center justify-between">
          <span className="text-blue-500 font-bold">${space.price || '0.00'}/mes</span>
          <button onClick={handleFavorite} className="text-gray-500 hover:text-red-500">
            {isFavorite ? (
              <Heart className="w-6 h-6 fill-current text-red-500" />
            ) : (
              <Heart className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="mt-4">
          <span className="block text-yellow-500 font-semibold">Calificación: {space.rating || 'N/A'}</span>
        </div>

        {isReserving ? (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Fecha de inicio:</label>
            <input
              type="date"
              value={reservationStartDate}
              onChange={(e) => setReservationStartDate(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="block text-sm font-medium text-gray-700">Fecha de fin:</label>
            <input
              type="date"
              value={reservationEndDate}
              onChange={(e) => setReservationEndDate(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />

            <button
              onClick={handleReserve}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Confirmar Reserva
            </button>
            <button
              onClick={() => setIsReserving(false)}
              className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsReserving(true)}
            className="w-full mt-2 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            Reservar
          </button>
        )}
      </div>
    </div>
  );
};

export default SpaceCard;
