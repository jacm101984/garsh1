import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceCard from '../components/SpaceCard';

const Favorites = ({ favorites = [], spaces = [], onFavorite }) => {
  const navigate = useNavigate();
  const favoriteSpaces = spaces.filter((space) => favorites.includes(space.id));

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">
        Mis Favoritos
      </h1>
      {favoriteSpaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isFavorite={favorites.includes(space.id)}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tienes espacios favoritos.</p>
      )}
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Favorites;
